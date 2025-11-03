import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const filePath = join(process.cwd(), '../dist', ...path);
  
  // Security check - prevent directory traversal
  const resolvedPath = join(process.cwd(), '../dist', ...path);
  if (!resolvedPath.startsWith(join(process.cwd(), '../dist'))) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  if (!existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }
  
  try {
    const file = await readFile(filePath);
    const ext = path[path.length - 1].split('.').pop()?.toLowerCase();
    
    let contentType = 'application/octet-stream';
    switch (ext) {
      case 'html':
        contentType = 'text/html';
        break;
      case 'css':
        contentType = 'text/css';
        break;
      case 'js':
        contentType = 'application/javascript';
        break;
      case 'json':
        contentType = 'application/json';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
      case 'avif':
        contentType = 'image/avif';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      case 'ico':
        contentType = 'image/x-icon';
        break;
      case 'xml':
        contentType = 'application/xml';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
    }
    
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return new NextResponse('Error reading file', { status: 500 });
  }
}
