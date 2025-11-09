// Base path for GitHub Pages
export const BASE_PATH = '/Abadanhaly-admin';

/**
 * Get the full path for an asset (image, etc.) with the base path
 * @param path - The asset path (e.g., '/Images/logo.png')
 * @returns The full path with base path (e.g., '/Abadanhaly-admin/Images/logo.png')
 */
export function getAssetPath(path: string): string {
  // If path already starts with base path, return as is
  if (path.startsWith(BASE_PATH)) {
    return path;
  }
  
  // If path starts with '/', prepend base path
  if (path.startsWith('/')) {
    return `${BASE_PATH}${path}`;
  }
  
  // Otherwise, prepend base path and '/'
  return `${BASE_PATH}/${path}`;
}

