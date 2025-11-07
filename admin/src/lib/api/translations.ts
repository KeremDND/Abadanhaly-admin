/**
 * Translations API Client
 * 
 * Centralized API functions for translation management
 */

export interface Translation {
  id: string;
  page: string;
  section: string;
  key: string;
  locale: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TranslationInput {
  page: string;
  section: string;
  key: string;
  locale: string;
  value: string;
}

/**
 * Fetch translations for a specific page
 */
export async function getTranslations(page?: string): Promise<Translation[]> {
  const url = page ? `/api/translations?page=${encodeURIComponent(page)}` : '/api/translations';
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch translations');
  }
  
  return response.json();
}

/**
 * Batch update translations
 */
export async function updateTranslations(translations: TranslationInput[]): Promise<{ success: boolean; message: string; count: number }> {
  const response = await fetch('/api/translations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ translations }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update translations');
  }
  
  return response.json();
}

