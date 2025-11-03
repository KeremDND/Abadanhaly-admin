import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all translations
    const translations = await prisma.translation.findMany({
      orderBy: [
        { page: 'asc' },
        { section: 'asc' },
        { key: 'asc' }
      ]
    });

    // Group translations by locale
    const locales = ['en', 'tk', 'ru'];
    const generatedFiles: string[] = [];

    for (const locale of locales) {
      const groupedTranslations: any = {};

      // Group by page and section
      translations.forEach(translation => {
        const { page, section, key } = translation;
        const value = (translation as any)[locale] || '';

        if (!groupedTranslations[page]) {
          groupedTranslations[page] = {};
        }
        if (!groupedTranslations[page][section]) {
          groupedTranslations[page][section] = {};
        }
        groupedTranslations[page][section][key] = value;
      });

      // Write to file
      const contentDir = path.join(process.cwd(), 'content', 'i18n');
      
      // Ensure directory exists
      if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
      }

      const filePath = path.join(contentDir, `${locale}.json`);
      fs.writeFileSync(filePath, JSON.stringify(groupedTranslations, null, 2));
      generatedFiles.push(filePath);
    }

    // Remove any German files if they exist
    const deFilePath = path.join(process.cwd(), 'content', 'i18n', 'de.json');
    if (fs.existsSync(deFilePath)) {
      fs.unlinkSync(deFilePath);
    }

    // Revalidate caches
    revalidateTag('i18n');
    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath('/about');
    revalidatePath('/collaboration');
    revalidatePath('/stores');

    // Log to audit
    await prisma.auditLog.create({
      data: {
        actor: session.email || 'admin',
        action: 'SYNC_JSON',
        target: 'Generated locale files',
        diff: { 
          files: generatedFiles,
          translationsCount: translations.length,
          locales: locales
        }
      }
    });

    return NextResponse.json({
      message: 'Locale files generated successfully',
      files: generatedFiles,
      translationsCount: translations.length
    });
  } catch (error) {
    console.error('Error syncing JSON files:', error);
    return NextResponse.json({ message: 'Failed to sync JSON files' }, { status: 500 });
  }
}
