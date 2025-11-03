import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { readFile } from 'fs/promises';
import { join } from 'path';

// POST /api/admin/sync-products - Sync products from data/products.ts
// This endpoint reads and parses the products.ts file directly without importing it
export async function POST(request: NextRequest) {
  try {
    // Determine the correct path to data/products.ts
    // admin folder is at: project/admin
    // products.ts is at: project/data/products.ts
    const adminDir = process.cwd(); // Should be project/admin
    const productsPath = join(adminDir, '..', 'data', 'products.ts');
    
    let fileContent: string;
    
    try {
      fileContent = await readFile(productsPath, 'utf-8');
    } catch (error: any) {
      // Try alternative paths
      const altPaths = [
        join(process.cwd(), 'data', 'products.ts'),
        join(process.cwd(), '..', '..', 'data', 'products.ts'),
      ];
      
      let found = false;
      for (const altPath of altPaths) {
        try {
          fileContent = await readFile(altPath, 'utf-8');
          found = true;
          break;
        } catch (e) {
          // Continue to next path
        }
      }
      
      if (!found) {
        return NextResponse.json(
          { ok: false, message: `Could not find data/products.ts. Tried: ${productsPath} and alternatives` },
          { status: 404 }
        );
      }
    }

    // Extract products array from TypeScript file
    // Match: export const products: Product[] = [...] or export const products = [...]
    const productsMatch = fileContent.match(/export\s+const\s+products\s*:\s*Product\[\]\s*=\s*(\[[\s\S]*?\])\s*;/) 
      || fileContent.match(/export\s+const\s+products\s*=\s*(\[[\s\S]*?\])\s*;/);
    
    if (!productsMatch || !productsMatch[1]) {
      return NextResponse.json(
        { ok: false, message: 'Could not extract products array from file. Make sure the file has: export const products = [...]' },
        { status: 400 }
      );
    }

    // Extract and clean the array string
    let productsString = productsMatch[1];
    
    // Remove comments that might break parsing
    productsString = productsString.replace(/\/\/.*$/gm, '');
    productsString = productsString.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Parse the array - use Function constructor to evaluate the array
    let products: any[];
    try {
      // This is safe because we're reading our own controlled file
      const parseFunction = new Function('return ' + productsString);
      products = parseFunction();
      
      if (!Array.isArray(products)) {
        return NextResponse.json(
          { ok: false, message: 'Parsed result is not an array' },
          { status: 400 }
        );
      }
    } catch (parseError: any) {
      console.error('Parse error:', parseError);
      return NextResponse.json(
        { ok: false, message: `Failed to parse products: ${parseError.message}. Please ensure data/products.ts is valid TypeScript.` },
        { status: 500 }
      );
    }

    // Sync products to database
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const product of products) {
      // Validate required fields
      if (!product || typeof product !== 'object') {
        skipped++;
        continue;
      }

      const sku = product.id || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : null);
      
      if (!sku || !product.name || !product.image) {
        console.warn('Skipping invalid product:', product);
        skipped++;
        continue;
      }

      const slug = product.slug || sku;
      
      // Map color to category
      const colorToCategory: Record<string, string> = {
        'Grey': 'Grey',
        'Dark Grey': 'Dark Grey',
        'Gray': 'Grey',
        'Grey Green': 'Grey',
        'Yellow Grey': 'Grey',
        'Cream': 'Cream',
        'Red': 'Red',
        'Green': 'Green',
      };
      const category = colorToCategory[product.color] || product.color || 'Grey';
      
      // Map category to tags
      const tags = product.category === 'new' ? ['new'] : product.category === 'bestseller' ? ['best-seller'] : [];
      const colors = product.color ? [product.color.toLowerCase().replace(/\s+/g, '-')] : [];
      const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;

      try {
        const existing = await prisma.product.findUnique({
          where: { sku },
        });

        if (existing) {
          await prisma.product.update({
            where: { sku },
            data: {
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
          updated++;
        } else {
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
      } catch (dbError: any) {
        console.error(`Error processing product ${sku}:`, dbError);
        skipped++;
      }
    }

    // Revalidate pages to update website
    try {
      revalidatePath('/gallery');
      revalidatePath('/');
    } catch (error) {
      console.warn('Revalidation error (non-critical):', error);
    }

    return NextResponse.json({
      ok: true,
      message: `Synced successfully: ${created} created, ${updated} updated${skipped > 0 ? `, ${skipped} skipped` : ''}`,
      data: { created, updated, skipped },
    });
  } catch (error: any) {
    console.error('Error syncing products:', error);
    return NextResponse.json(
      { ok: false, message: `Failed to sync products: ${error.message}` },
      { status: 500 }
    );
  }
}

