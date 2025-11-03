import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface ImageFile {
  name: string;
  path: string;
  color: string;
}

function getColorFromPath(filePath: string): string {
  const pathParts = filePath.split('/');
  const colorFolder = pathParts[pathParts.length - 2];
  
  if (!colorFolder) return 'Grey';
  
  switch (colorFolder.toLowerCase()) {
    case 'grey':
    case 'gray':
      return 'Grey';
    case 'dark grey':
    case 'darkgery':
      return 'DarkGrey';
    case 'cream':
      return 'Cream';
    case 'red':
      return 'Red';
    case 'green':
      return 'Green';
    default:
      return 'Grey';
  }
}

function generateSku(name: string): string {
  // Extract numbers from filename
  const numbers = name.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    return `AH-${numbers[0]}`;
  }
  
  // Generate SKU from name
  const cleanName = name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .toUpperCase()
    .substring(0, 10);
  
  return `AH-${cleanName}`;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

async function scanImages(): Promise<ImageFile[]> {
  const imagesDir = path.join(process.cwd(), '..', 'public', 'Images', 'Halylar');
  const images: ImageFile[] = [];

  if (!fs.existsSync(imagesDir)) {
    console.log('Images directory not found:', imagesDir);
    return images;
  }

  const colorFolders = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const colorFolder of colorFolders) {
    const colorDir = path.join(imagesDir, colorFolder);
    const files = fs.readdirSync(colorDir)
      .filter(file => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
      .map(file => ({
        name: file,
        path: `/Images/Halylar/${colorFolder}/${file}`,
        color: getColorFromPath(`/Images/Halylar/${colorFolder}/`)
      }));

    images.push(...files);
  }

  return images;
}

async function seedProducts() {
  try {
    console.log('Starting product seeding from images...');
    
    const images = await scanImages();
    console.log(`Found ${images.length} images`);

    if (images.length === 0) {
      console.log('No images found. Please check the path: ../public/Images/Halylar/');
      return;
    }

    let created = 0;
    let updated = 0;

    for (const image of images) {
      const sku = generateSku(image.name);
      const slug = generateSlug(image.name);
      const name = image.name
        .replace(/\.(jpg|jpeg)$/i, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

      try {
        const existingProduct = await prisma.product.findUnique({
          where: { sku }
        });

        if (existingProduct) {
          await prisma.product.update({
            where: { sku },
            data: {
              name,
              color: image.color as any,
              imagePath: image.path,
              category: 'All carpets',
              slug,
            }
          });
          updated++;
          console.log(`Updated: ${name} (${sku})`);
        } else {
          await prisma.product.create({
            data: {
              name,
              sku,
              color: image.color as any,
              category: 'All carpets',
              slug,
              imagePath: image.path,
              active: true,
            }
          });
          created++;
          console.log(`Created: ${name} (${sku})`);
        }
      } catch (error) {
        console.error(`Error processing ${image.name}:`, error);
      }
    }

    console.log(`\nSeeding completed!`);
    console.log(`Created: ${created} products`);
    console.log(`Updated: ${updated} products`);
    console.log(`Total processed: ${created + updated} products`);

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedProducts();
