import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const filePath = join(process.cwd(), '../dist', ...slug);
  
  // Security check - prevent directory traversal
  const resolvedPath = join(process.cwd(), '../dist', ...slug);
  if (!resolvedPath.startsWith(join(process.cwd(), '../dist'))) {
    notFound();
  }
  
  if (!existsSync(filePath)) {
    notFound();
  }
  
  try {
    const file = await readFile(filePath);
    const ext = slug[slug.length - 1].split('.').pop()?.toLowerCase();
    
    // For HTML files, render them
    if (ext === 'html') {
      const html = file.toString();
      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }
    
    // For other files, return as plain text or handle appropriately
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">File Found</h1>
          <p className="text-gray-600">This is a static file: {slug.join('/')}</p>
          <p className="text-sm text-gray-500 mt-2">Type: {ext}</p>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
