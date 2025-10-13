import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import { locales } from "@/i18n/config";

export const metadata: Metadata = {
  title: "Abadan Haly Admin",
  description: "Admin Dashboard",
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const { locale } = params;
  if (!locales.includes(locale as any)) notFound();
  const messages = (await import(`@/i18n/messages/${locale}.json`)).default;
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
