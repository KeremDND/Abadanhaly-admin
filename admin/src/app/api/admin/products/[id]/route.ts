import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/admin/products/[id]
export async function GET(
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

    return NextResponse.json({
      ok: true,
      data: {
        ...product,
        tags: JSON.parse(product.tags || '[]'),
        colors: JSON.parse(product.colors || '[]'),
        images: JSON.parse(product.images || '[]'),
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { sku, name, slug, category, tags, colors, imagePath, images, active } = body;

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if SKU is being changed and conflicts with another product
    if (sku && sku !== existing.sku) {
      const skuConflict = await prisma.product.findUnique({
        where: { sku },
      });

      if (skuConflict) {
        return NextResponse.json(
          { ok: false, message: 'SKU already in use' },
          { status: 409 }
        );
      }
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(sku && { sku }),
        ...(name && { name }),
        ...(slug && { slug }),
        ...(category !== undefined && { category }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(colors && { colors: JSON.stringify(colors) }),
        ...(imagePath !== undefined && { imagePath }),
        ...(images && { images: JSON.stringify(images) }),
        ...(active !== undefined && { active }),
      },
    });

    // Revalidate public pages
    revalidatePath('/gallery');
    revalidatePath('/');

    return NextResponse.json({
      ok: true,
      data: {
        ...product,
        tags: JSON.parse(product.tags || '[]'),
        colors: JSON.parse(product.colors || '[]'),
        images: JSON.parse(product.images || '[]'),
      },
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete by setting active to false
    const product = await prisma.product.update({
      where: { id },
      data: { active: false },
    });

    // Revalidate public pages
    revalidatePath('/gallery');
    revalidatePath('/');

    return NextResponse.json({
      ok: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

