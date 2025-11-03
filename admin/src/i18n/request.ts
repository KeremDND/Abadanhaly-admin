import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Use default locale if locale is undefined
  const validLocale = locale || defaultLocale;
  
  // Validate that the incoming `locale` parameter is valid
  if (!validLocale || !locales.includes(validLocale as any)) {
    console.warn(`Invalid locale: ${validLocale}, using default: ${defaultLocale}`);
    return {
      locale: defaultLocale,
      messages: (await import(`./messages/${defaultLocale}.json`)).default
    };
  }

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});