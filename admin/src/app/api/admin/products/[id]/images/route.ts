import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { revalidatePath } from 'next/cache';

// POST /api/admin/products/[id]/images
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { ok: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { ok: false, message: 'No images provided' },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { ok: false, message: 'Maximum 10 images per product' },
        { status: 400 }
      );
    }

    const uploadedImages: string[] = [];
    const basePath = process.cwd();
    const publicPath = join(basePath, 'public', 'Images', 'Halylar');

    // Ensure directory exists
    await mkdir(publicPath, { recursive: true });

    for (const file of files) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { ok: false, message: `File ${file.name} exceeds 5MB limit` },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { ok: false, message: `File ${file.name} has invalid type` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate filename
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
      const jpgPath = join(publicPath, `${nameWithoutExt}-${timestamp}.jpg`);
      const webpPath = join(publicPath, `${nameWithoutExt}-${timestamp}.webp`);

      // Process image with Sharp
      const image = sharp(buffer);

      // Generate JPEG
      await image
        .jpeg({ quality: 85 })
        .toFile(jpgPath);

      // Generate WebP
      await image
        .webp({ quality: 85 })
        .toFile(webpPath);

      // Relative path for database
      const relativePath = `/Images/Halylar/${nameWithoutExt}-${timestamp}.jpg`;
      uploadedImages.push(relativePath);
    }

    // Update product with new images
    const existingImages = JSON.parse(product.images || '[]');
    const allImages = [...existingImages, ...uploadedImages];

    // Set first image as primary if no imagePath exists
    const imagePath = product.imagePath || uploadedImages[0];

    const updated = await prisma.product.update({
      where: { id },
      data: {
        imagePath,
        images: JSON.stringify(allImages),
      },
    });

    // Revalidate public pages
    revalidatePath('/gallery');
    revalidatePath('/');

    return NextResponse.json({
      ok: true,
      data: {
        ...updated,
        images: JSON.parse(updated.images || '[]'),
      },
      message: 'Images uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to upload images' },
      { status: 500 }
    );
  }
}

