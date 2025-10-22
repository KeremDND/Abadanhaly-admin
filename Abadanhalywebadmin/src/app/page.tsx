import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function HomePage() {
  try {
    // Serve the main website from the dist folder
    const distPath = join(process.cwd(), '../dist');
    const htmlPath = join(distPath, 'index.html');
    const html = await readFile(htmlPath, 'utf-8');
    
    return (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Website Not Found</h1>
          <p className="text-gray-600">The website files could not be loaded.</p>
          <p className="text-sm text-gray-500 mt-2">Make sure the dist folder exists in the parent directory.</p>
        </div>
      </div>
    );
  }
}