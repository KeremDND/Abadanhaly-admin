import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET /api/admin/translations?page=home
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');

    const where: any = {};
    if (page) {
      where.page = page;
    }

    const translations = await prisma.translation.findMany({
      where,
      orderBy: [{ page: 'asc' }, { section: 'asc' }],
    });

    // Group by page and section
    const grouped: Record<string, Record<string, Array<{
      id: string;
      locale: string;
      value: string;
      section: string;
      updatedAt: Date;
    }>>> = {};

    translations.forEach((t) => {
      if (!grouped[t.page]) {
        grouped[t.page] = {};
      }
      if (!grouped[t.page][t.section]) {
        grouped[t.page][t.section] = [];
      }
      grouped[t.page][t.section].push({
        id: t.id,
        locale: t.locale,
        value: t.value,
        section: t.section,
        updatedAt: t.updatedAt,
      });
    });

    return NextResponse.json({
      ok: true,
      data: grouped,
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

// POST /api/admin/translations/batch - upsert translations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { translations } = body;

    if (!Array.isArray(translations)) {
      return NextResponse.json(
        { ok: false, message: 'Translations must be an array' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      translations.map((t: { page: string; section: string; locale: string; value: string }) =>
        prisma.translation.upsert({
          where: {
            page_section_locale: {
              page: t.page,
              section: t.section,
              locale: t.locale,
            },
          },
          update: {
            value: t.value,
          },
          create: {
            page: t.page,
            section: t.section,
            locale: t.locale,
            value: t.value,
          },
        })
      )
    );

    // Revalidate pages based on affected pages
    const affectedPages = new Set(translations.map((t: { page: string }) => t.page));
    affectedPages.forEach((page) => {
      const route = page === 'home' ? '/' : `/${page}`;
      revalidatePath(route);
    });

    return NextResponse.json({
      ok: true,
      message: `${results.length} translations updated`,
      data: results,
    });
  } catch (error) {
    console.error('Error updating translations:', error);
    return NextResponse.json(
      { ok: false, message: 'Failed to update translations' },
      { status: 500 }
    );
  }
}

