import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// POST /api/admin/revalidate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, all } = body;

    if (all) {
      // Revalidate all public routes
      revalidatePath('/');
      revalidatePath('/gallery');
      revalidatePath('/about');
      revalidatePath('/collaboration');

      return NextResponse.json({
        ok: true,
        message: 'All routes revalidated successfully',
      });
    }

    if (path) {
      revalidatePath(path);

      return NextResponse.json({
        ok: true,
        message: `Route ${path} revalidated successfully`,
      });
    }

    return NextResponse.json(
      { ok: false, message: 'Either path or all must be provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}

