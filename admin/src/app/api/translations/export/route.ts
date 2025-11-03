import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await verifyAdminSession(req);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';
    const scope = searchParams.get('scope') || 'all';

    // Build where clause based on scope
    const where: any = {};
    if (scope.startsWith('page:')) {
      const page = scope.replace('page:', '');
      where.page = page;
    }

    const translations = await prisma.translation.findMany({
      where,
      orderBy: [
        { page: 'asc' },
        { section: 'asc' },
        { key: 'asc' }
      ]
    });

    let data: string;
    let contentType: string;
    let filename: string;

    if (format === 'json') {
      data = JSON.stringify(translations, null, 2);
      contentType = 'application/json';
      filename = `translations-${scope}-${new Date().toISOString().split('T')[0]}.json`;
    } else if (format === 'csv') {
      // Convert to CSV
      const headers = ['id', 'page', 'section', 'key', 'en', 'tk', 'ru', 'updatedAt'];
      const csvRows = [
        headers.join(','),
        ...translations.map(t => 
          headers.map(h => `"${(t as any)[h] || ''}"`).join(',')
        )
      ];
      data = csvRows.join('\n');
      contentType = 'text/csv';
      filename = `translations-${scope}-${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      return NextResponse.json({ message: 'Unsupported format' }, { status: 400 });
    }

    // Log to audit
    await prisma.auditLog.create({
      data: {
        actor: session.email || 'admin',
        action: 'EXPORT',
        target: `${translations.length} translations exported as ${format}`,
        diff: { format, scope, count: translations.length }
      }
    });

    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error exporting translations:', error);
    return NextResponse.json({ message: 'Failed to export translations' }, { status: 500 });
  }
}
