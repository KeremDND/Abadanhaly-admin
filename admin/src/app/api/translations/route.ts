import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const page = searchParams.get('page') || '';
    const section = searchParams.get('section') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause for filtering
    const where: any = {};
    
    if (page) where.page = page;
    if (section) where.section = section;
    
    // Fuzzy search over key and values
    if (query) {
      where.OR = [
        { key: { contains: query, mode: 'insensitive' } },
        { en: { contains: query, mode: 'insensitive' } },
        { tk: { contains: query, mode: 'insensitive' } },
        { ru: { contains: query, mode: 'insensitive' } }
      ];
    }

    const [translations, total] = await Promise.all([
      prisma.translation.findMany({
        where,
        orderBy: [
          { page: 'asc' },
          { section: 'asc' },
          { key: 'asc' }
        ],
        skip: offset,
        take: limit
      }),
      prisma.translation.count({ where })
    ]);

    return NextResponse.json({
      translations,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ message: 'Failed to fetch translations' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows } = await req.json();
    
    if (!Array.isArray(rows)) {
      return NextResponse.json({ message: 'Invalid data format' }, { status: 400 });
    }

    const results = [];
    const auditDiffs = [];

    for (const row of rows) {
      const { id, page, section, key, en, tk, ru } = row;
      
      // Validate required fields
      if (!page || !section || !key) {
        continue; // Skip invalid rows
      }

      let result;
      let diff = null;

      if (id) {
        // Update existing translation
        const existing = await prisma.translation.findUnique({ where: { id } });
        if (existing) {
          diff = {
            before: { en: existing.en, tk: existing.tk, ru: existing.ru },
            after: { en, tk, ru }
          };
        }
        
        result = await prisma.translation.update({
          where: { id },
          data: { en, tk, ru }
        });
      } else {
        // Create new translation
        result = await prisma.translation.create({
          data: { page, section, key, en, tk, ru }
        });
        diff = { created: { page, section, key, en, tk, ru } };
      }

      results.push(result);
      if (diff) auditDiffs.push(diff);
    }

    // Log to audit
    if (auditDiffs.length > 0) {
      await prisma.auditLog.create({
        data: {
          actor: session.email || 'admin',
          action: 'UPDATE_TRANSLATIONS',
          target: `${results.length} translations`,
          diff: auditDiffs
        }
      });
    }

    // Revalidate translations cache
    revalidateTag('i18n');

    return NextResponse.json({ 
      message: 'Translations updated successfully',
      updated: results.length 
    });
  } catch (error) {
    console.error('Error updating translations:', error);
    return NextResponse.json({ message: 'Failed to update translations' }, { status: 500 });
  }
}