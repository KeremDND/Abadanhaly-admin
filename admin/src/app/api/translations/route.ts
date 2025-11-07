import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 'home';

    const translations = await prisma.translation.findMany({
      where: { page },
      orderBy: [{ section: 'asc' }, { key: 'asc' }, { locale: 'asc' }],
    });

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { translations } = body;

    if (!Array.isArray(translations)) {
      return NextResponse.json(
        { error: 'Translations must be an array' },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      translations.map((t: any) =>
        prisma.translation.upsert({
          where: {
            page_section_key_locale: {
              page: t.page,
              section: t.section,
              key: t.key,
              locale: t.locale,
            },
          },
          update: {
            value: t.value,
          },
          create: {
            page: t.page,
            section: t.section,
            key: t.key,
            locale: t.locale,
            value: t.value,
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: results.length });
  } catch (error) {
    console.error('Error saving translations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

