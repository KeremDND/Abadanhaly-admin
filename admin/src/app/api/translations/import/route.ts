import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

export async function POST(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { format, data } = await req.json();
    
    if (!format || !data) {
      return NextResponse.json({ message: 'Format and data are required' }, { status: 400 });
    }

    let parsedData: any[] = [];
    const summary = { created: 0, updated: 0, errors: 0, conflicts: [] };

    // Parse data based on format
    if (format === 'json') {
      try {
        parsedData = JSON.parse(data);
      } catch (error) {
        return NextResponse.json({ message: 'Invalid JSON format' }, { status: 400 });
      }
    } else if (format === 'csv') {
      // Simple CSV parsing (for production, use a proper CSV library)
      const lines = data.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      parsedData = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });
    } else {
      return NextResponse.json({ message: 'Unsupported format' }, { status: 400 });
    }

    if (!Array.isArray(parsedData)) {
      return NextResponse.json({ message: 'Data must be an array' }, { status: 400 });
    }

    // Process each translation
    for (const item of parsedData) {
      try {
        const { page, section, key, en, tk, ru } = item;
        
        if (!page || !section || !key) {
          summary.errors++;
          continue;
        }

        // Check for existing translation
        const existing = await prisma.translation.findUnique({
          where: { page_section_key: { page, section, key } }
        });

        if (existing) {
          // Check for conflicts (non-empty values being overwritten)
          const hasConflict = 
            (existing.en && en && existing.en !== en) ||
            (existing.tk && tk && existing.tk !== tk) ||
            (existing.ru && ru && existing.ru !== ru);

          if (hasConflict) {
            summary.conflicts.push({
              key: `${page}.${section}.${key}`,
              existing: { en: existing.en, tk: existing.tk, ru: existing.ru },
              incoming: { en, tk, ru }
            });
          }

          // Update existing
          await prisma.translation.update({
            where: { id: existing.id },
            data: { en: en || existing.en, tk: tk || existing.tk, ru: ru || existing.ru }
          });
          summary.updated++;
        } else {
          // Create new
          await prisma.translation.create({
            data: {
              page,
              section,
              key,
              en: en || '',
              tk: tk || '',
              ru: ru || ''
            }
          });
          summary.created++;
        }
      } catch (error) {
        console.error('Error processing translation item:', error);
        summary.errors++;
      }
    }

    // Log to audit
    await prisma.auditLog.create({
      data: {
        actor: session.email || 'admin',
        action: 'IMPORT',
        target: `${summary.created + summary.updated} translations imported`,
        diff: summary
      }
    });

    // Revalidate translations cache
    revalidateTag('i18n');

    return NextResponse.json({
      message: 'Import completed',
      summary
    });
  } catch (error) {
    console.error('Error importing translations:', error);
    return NextResponse.json({ message: 'Failed to import translations' }, { status: 500 });
  }
}
