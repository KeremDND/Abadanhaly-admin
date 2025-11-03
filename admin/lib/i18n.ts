import { unstable_cache } from 'next/cache';

export type Locale = 'en' | 'tk' | 'ru';

interface TranslationData {
  [page: string]: {
    [section: string]: {
      [key: string]: string;
    };
  };
}

// Cache translations for 1 hour
const getCachedTranslations = unstable_cache(
  async (locale: Locale): Promise<TranslationData> => {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const filePath = path.join(process.cwd(), 'content', 'i18n', `${locale}.json`);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`Translation file not found: ${filePath}`);
        return {};
      }

      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error loading translations for ${locale}:`, error);
      return {};
    }
  },
  ['translations'],
  { 
    revalidate: 3600, // 1 hour
    tags: ['i18n']
  }
);

export async function t(
  page: string,
  section: string,
  key: string,
  locale: Locale = 'en'
): Promise<string> {
  try {
    const translations = await getCachedTranslations(locale);
    
    // Navigate through the nested structure
    const pageTranslations = translations[page];
    if (!pageTranslations) {
      console.warn(`Page not found: ${page}`);
      return key; // Fallback to key
    }

    const sectionTranslations = pageTranslations[section];
    if (!sectionTranslations) {
      console.warn(`Section not found: ${page}.${section}`);
      return key; // Fallback to key
    }

    const translation = sectionTranslations[key];
    if (!translation) {
      console.warn(`Key not found: ${page}.${section}.${key}`);
      return key; // Fallback to key
    }

    return translation;
  } catch (error) {
    console.error(`Error getting translation for ${page}.${section}.${key}:`, error);
    return key; // Fallback to key
  }
}

// Helper function for client-side usage (when you need to pass translations to client)
export async function getTranslationsForPage(
  page: string,
  locale: Locale = 'en'
): Promise<{ [section: string]: { [key: string]: string } }> {
  try {
    const translations = await getCachedTranslations(locale);
    return translations[page] || {};
  } catch (error) {
    console.error(`Error getting translations for page ${page}:`, error);
    return {};
  }
}

// Helper function to get all translations for a specific section
export async function getTranslationsForSection(
  page: string,
  section: string,
  locale: Locale = 'en'
): Promise<{ [key: string]: string }> {
  try {
    const translations = await getCachedTranslations(locale);
    return translations[page]?.[section] || {};
  } catch (error) {
    console.error(`Error getting translations for section ${page}.${section}:`, error);
    return {};
  }
}

// Validation helper to check for placeholder mismatches
export function validatePlaceholders(translations: { [key: string]: string }): {
  [key: string]: string[];
} {
  const issues: { [key: string]: string[] } = {};
  
  Object.entries(translations).forEach(([key, value]) => {
    const placeholders = value.match(/\{[^}]+\}/g) || [];
    const uniquePlaceholders = [...new Set(placeholders)];
    
    if (uniquePlaceholders.length > 0) {
      issues[key] = uniquePlaceholders;
    }
  });
  
  return issues;
}

// Helper to check if all locales have the same placeholders
export function checkPlaceholderConsistency(
  translations: { [locale: string]: { [key: string]: string } }
): { [key: string]: { [locale: string]: string[] } } {
  const issues: { [key: string]: { [locale: string]: string[] } } = {};
  
  // Get all unique keys
  const allKeys = new Set<string>();
  Object.values(translations).forEach(localeTranslations => {
    Object.keys(localeTranslations).forEach(key => allKeys.add(key));
  });
  
  allKeys.forEach(key => {
    const placeholdersByLocale: { [locale: string]: string[] } = {};
    
    Object.entries(translations).forEach(([locale, localeTranslations]) => {
      const value = localeTranslations[key] || '';
      const placeholders = value.match(/\{[^}]+\}/g) || [];
      placeholdersByLocale[locale] = [...new Set(placeholders)].sort();
    });
    
    // Check if all locales have the same placeholders
    const localeKeys = Object.keys(placeholdersByLocale);
    if (localeKeys.length > 1) {
      const firstLocalePlaceholders = placeholdersByLocale[localeKeys[0]];
      const hasInconsistency = localeKeys.some(locale => 
        JSON.stringify(placeholdersByLocale[locale]) !== JSON.stringify(firstLocalePlaceholders)
      );
      
      if (hasInconsistency) {
        issues[key] = placeholdersByLocale;
      }
    }
  });
  
  return issues;
}
