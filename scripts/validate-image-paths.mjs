#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Import products from products.ts
async function loadProducts() {
  try {
    const productsFile = path.join(projectRoot, 'data', 'products.ts');
    const content = await fs.readFile(productsFile, 'utf-8');
    
    // Extract image paths using regex
    const imageRegex = /image:\s*['"`]([^'"`]+)['"`]/g;
    const imagePaths = [];
    let match;
    
    while ((match = imageRegex.exec(content)) !== null) {
      imagePaths.push(match[1]);
    }
    
    return [...new Set(imagePaths)]; // Remove duplicates
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

async function checkImageExists(imagePath) {
  // Remove leading slash for path joining
  const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const fullPath = path.join(projectRoot, 'public', relativePath);
  
  try {
    await fs.access(fullPath);
    return { exists: true, path: fullPath };
  } catch {
    return { exists: false, path: fullPath };
  }
}

async function getAllImageFiles() {
  const halylarDir = path.join(projectRoot, 'public', 'Images', 'Halylar');
  const images = [];
  
  try {
    await fs.access(halylarDir);
  } catch {
    console.error(`Directory not found: ${halylarDir}`);
    return images;
  }
  
  async function scanDirectory(dir, basePath = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath, relativePath);
      } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name)) {
        const publicPath = `/Images/Halylar/${relativePath}`;
        images.push({
          path: publicPath,
          fullPath: fullPath,
          relativePath: relativePath
        });
      }
    }
  }
  
  await scanDirectory(halylarDir);
  return images;
}

async function main() {
  console.log('🔍 Validating image paths...\n');
  
  // Load all image paths from products.ts
  const productImagePaths = await loadProducts();
  console.log(`Found ${productImagePaths.length} unique image paths in products.ts\n`);
  
  // Check which images exist
  const missingImages = [];
  const existingImages = [];
  
  for (const imagePath of productImagePaths) {
    const check = await checkImageExists(imagePath);
    if (check.exists) {
      existingImages.push(imagePath);
    } else {
      missingImages.push({ path: imagePath, expected: check.path });
    }
  }
  
  // Get all actual image files
  const allImages = await getAllImageFiles();
  console.log(`Found ${allImages.length} actual image files in public/Images/Halylar\n`);
  
  // Find orphaned images (images that exist but aren't referenced)
  const referencedPaths = new Set(productImagePaths.map(p => {
    // Normalize paths for comparison
    return p.replace(/^\/Images\/Halylar\//, '').replace(/\/+/g, '/');
  }));
  
  const orphanedImages = allImages.filter(img => {
    const relative = img.path.replace(/^\/Images\/Halylar\//, '');
    return !referencedPaths.has(relative);
  });
  
  // Report results
  console.log('='.repeat(60));
  console.log('VALIDATION RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n✅ Existing images: ${existingImages.length}/${productImagePaths.length}`);
  if (existingImages.length > 0) {
    console.log('   All referenced images exist!');
  }
  
  if (missingImages.length > 0) {
    console.log(`\n❌ Missing images: ${missingImages.length}`);
    console.log('   The following images are referenced but not found:');
    missingImages.forEach(({ path: imgPath, expected }) => {
      console.log(`   - ${imgPath}`);
      console.log(`     Expected at: ${expected}`);
    });
  }
  
  if (orphanedImages.length > 0) {
    console.log(`\n⚠️  Orphaned images: ${orphanedImages.length}`);
    console.log('   These images exist but are not referenced in products.ts:');
    orphanedImages.slice(0, 20).forEach(img => {
      console.log(`   - ${img.path}`);
    });
    if (orphanedImages.length > 20) {
      console.log(`   ... and ${orphanedImages.length - 20} more`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  if (missingImages.length === 0) {
    console.log('✅ All product image paths are valid!');
    process.exit(0);
  } else {
    console.log('❌ Some image paths need to be fixed.');
    console.log(`\nFix ${missingImages.length} missing image path(s) before proceeding.`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error during validation:', error);
  process.exit(1);
});

