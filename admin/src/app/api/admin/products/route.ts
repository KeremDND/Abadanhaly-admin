import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/admin/products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const active = searchParams.get('active');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Search by name or SKU
    // SQLite doesn't support case-insensitive mode, but it's case-insensitive by default for ASCII
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { sku: { contains: query } },
      ];
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by tags (JSON array contains)
    if (tags) {
      where.tags = { contains: tags };
    }

    // Filter by active status
    if (active !== null && active !== undefined) {
      where.active = active === 'true';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    // Parse JSON strings back to arrays (with safe parsing)
    const productsWithArrays = products.map((product) => {
      try {
        return {
          ...product,
          tags: product.tags ? JSON.parse(product.tags) : [],
          colors: product.colors ? JSON.parse(product.colors) : [],
          images: product.images ? JSON.parse(product.images) : [],
        };
      } catch (parseError) {
        console.error(`Error parsing product ${product.id}:`, parseError);
        return {
          ...product,
          tags: [],
          colors: [],
          images: [],
        };
      }
    });

    return NextResponse.json({
      ok: true,
      data: productsWithArrays,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    const errorMessage = error?.message || 'Unknown error';
    const errorName = error?.name || 'Error';
    return NextResponse.json(
      { 
        ok: false, 
        message: 'Failed to fetch products',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        errorType: process.env.NODE_ENV === 'development' ? errorName : undefined,
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sku, name, slug, category, tags, colors, imagePath, images, active } = body;

    // Validation
    if (!sku || !name || !slug) {
      return NextResponse.json(
        { ok: false, message: 'SKU, name, and slug are required' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existing = await prisma.product.findUnique({
      where: { sku },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: 'Product with this SKU already exists' },
        { status: 409 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        sku,
        name,
        slug,
        category: category || '',
        tags: JSON.stringify(tags || []),
        colors: JSON.stringify(colors || []),
        imagePath: imagePath || '',
        images: JSON.stringify(images || []),
        active: active !== undefined ? active : true,
      },
    }).catch((error) => {
      console.error('Prisma error:', error);
      throw error;
    });

    // Revalidate public pages
    try {
      revalidatePath('/gallery');
      revalidatePath('/');
    } catch (error) {
      console.error('Revalidation error:', error);
    }

    return NextResponse.json({
      ok: true,
      data: {
        ...product,
        tags: JSON.parse(product.tags || '[]'),
        colors: JSON.parse(product.colors || '[]'),
        images: JSON.parse(product.images || '[]'),
      },
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}

