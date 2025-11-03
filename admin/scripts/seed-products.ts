import { PrismaClient } from '@prisma/client';
import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('🌱 Seeding products from data/products.ts...');

  try {
    // Import products from parent directory
    let products;
    try {
      const productsPath = join(process.cwd(), '..', 'data', 'products.ts');
      const productsModule = await import(productsPath);
      products = productsModule.products;
    } catch (error) {
      // Fallback: try relative path
      try {
        const productsModule = await import('../../data/products.ts');
        products = productsModule.products;
      } catch (e) {
        console.error('Failed to import products:', e);
        throw new Error('Could not import products from data/products.ts');
      }
    }

    if (!products || !Array.isArray(products)) {
      throw new Error('Products array not found or invalid');
    }

    // Clear existing products
    await prisma.product.deleteMany();
    console.log('✅ Cleared existing products');

    let created = 0;

    // Seed from data/products.ts
    for (const product of products) {
      // Extract SKU from id or generate from name
      const sku = product.id || slugify(product.name, { lower: true, strict: true });

      // Infer category from color (map colors to categories)
      const colorToCategory: Record<string, string> = {
        'Grey': 'Grey',
        'Dark Grey': 'Dark Grey',
        'Gray': 'Grey',
        'Cream': 'Cream',
        'Red': 'Red',
        'Green': 'Green',
      };
      const category = colorToCategory[product.color] || product.color || 'Grey';

      // Map category to tags
      const tags = product.category === 'new' ? ['new'] : product.category === 'bestseller' ? ['best-seller'] : [];

      // Colors array
      const colors = [product.color.toLowerCase()];

      // Image path (relative to public)
      const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;

      // Generate slug
      const slug = product.slug || slugify(product.name, { lower: true, strict: true });

      await prisma.product.create({
        data: {
          sku,
          name: product.name,
          slug,
          category,
          tags: JSON.stringify(tags),
          colors: JSON.stringify(colors),
          imagePath,
          images: JSON.stringify([imagePath]),
          active: true,
        },
      });

      created++;
    }

    console.log(`✅ Created ${created} products from data/products.ts`);

    // Also scan /public/Images/Halylar for any additional images
    console.log('🔍 Scanning /public/Images/Halylar for additional images...');

    const publicPath = join(process.cwd(), 'public', 'Images', 'Halylar');
    
    try {
      const folders = await readdir(publicPath);
      let scanned = 0;

      for (const folder of folders) {
        const folderPath = join(publicPath, folder);
        const stats = await stat(folderPath);
        
        if (!stats.isDirectory()) continue;

        const files = await readdir(folderPath);
        const imageFiles = files.filter((f) => 
          f.toLowerCase().endsWith('.jpg') || 
          f.toLowerCase().endsWith('.jpeg') || 
          f.toLowerCase().endsWith('.png')
        );

        for (const file of imageFiles) {
          // Check if product already exists with this image
          const existing = await prisma.product.findFirst({
            where: {
              imagePath: { contains: file },
            },
          });

          if (existing) continue;

          // Generate product data from filename
          const nameWithoutExt = file.replace(/\.[^/.]+$/, '').replace(/-/g, ' ');
          const sku = slugify(file, { lower: true, strict: true }).replace(/\.[^/.]+$/, '');
          const slug = sku;
          const imagePath = `/Images/Halylar/${folder}/${file}`;

          await prisma.product.create({
            data: {
              sku,
              name: nameWithoutExt,
              slug,
              category: folder,
              tags: JSON.stringify([]),
              colors: JSON.stringify([folder.toLowerCase()]),
              imagePath,
              images: JSON.stringify([imagePath]),
              active: true,
            },
          });

          scanned++;
        }
      }

      console.log(`✅ Created ${scanned} additional products from image scan`);
    } catch (error) {
      console.warn('⚠️ Could not scan image folder:', error);
    }

    console.log(`\n✅ Total products created: ${created + scanned}`);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts()
  .then(() => {
    console.log('✅ Product seeding completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Product seeding failed:', error);
    process.exit(1);
  });

