import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  const current = (locales.includes(locale as any) ? locale : defaultLocale) as "tk" | "ru" | "en" | "de";
  const messages = (await import(`./messages/${current}.json`)).default;
  return { locale: current, messages };
});
