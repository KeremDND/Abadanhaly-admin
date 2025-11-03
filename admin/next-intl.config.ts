import { getRequestConfig } from 'next-intl/server';
import { locales } from './src/i18n/config';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  return {
    messages: (await import(`./src/i18n/messages/${locale}.json`)).default
  };
});


