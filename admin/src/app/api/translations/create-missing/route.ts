import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';
import { revalidateTag } from 'next/cache';
import { TRANSLATION_KEYS } from '../../../../content/translation-keys';

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { keys } = await req.json();
    
    // Use provided keys or fall back to registry
    const keysToCreate = keys || TRANSLATION_KEYS;
    
    if (!Array.isArray(keysToCreate)) {
      return NextResponse.json({ message: 'Invalid keys format' }, { status: 400 });
    }

    const created = [];
    const skipped = [];

    for (const keyData of keysToCreate) {
      const { page, section, key, en, tk, ru } = keyData;
      
      if (!page || !section || !key) {
        skipped.push({ reason: 'Missing required fields', key: keyData });
        continue;
      }

      // Check if translation already exists
      const existing = await prisma.translation.findUnique({
        where: { page_section_key: { page, section, key } }
      });

      if (existing) {
        skipped.push({ reason: 'Already exists', key: `${page}.${section}.${key}` });
        continue;
      }

      // Create new translation
      const translation = await prisma.translation.create({
        data: {
          page,
          section,
          key,
          en: en || '',
          tk: tk || '',
          ru: ru || ''
        }
      });

      created.push(translation);
    }

    // Log to audit
    await prisma.auditLog.create({
      data: {
        actor: session.email || 'admin',
        action: 'CREATE_MISSING_KEYS',
        target: `${created.length} new keys created`,
        diff: { created: created.length, skipped: skipped.length }
      }
    });

    // Revalidate translations cache
    revalidateTag('i18n');

    return NextResponse.json({
      message: 'Missing keys processed',
      created: created.length,
      skipped: skipped.length,
      details: { created, skipped }
    });
  } catch (error) {
    console.error('Error creating missing keys:', error);
    return NextResponse.json({ message: 'Failed to create missing keys' }, { status: 500 });
  }
}
