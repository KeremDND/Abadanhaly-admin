import { cache } from "react";
import { db } from "@/server/db";

export type Locale = "tk" | "ru" | "en";

export const getDict = cache(async (locale: Locale) => {
  const rows = await db.translationValue.findMany({
    where: { locale },
    include: { key: true },
  });
  const dict = new Map<string, string>();
  for (const r of rows) {
    dict.set(`${r.key.page}.${r.key.section}.${r.key.key}`, r.value);
  }
  return dict;
});

export async function t(
  locale: Locale,
  page: string,
  section: string,
  key: string,
  fallback = ""
): Promise<string> {
  const dict = await getDict(locale);
  const id = `${page}.${section}.${key}`;
  if (dict.has(id)) return dict.get(id)!;

  // Fallback chain: tk -> ru -> en
  const locales: Locale[] =
    locale === "tk"
      ? ["tk", "ru", "en"]
      : locale === "ru"
      ? ["ru", "tk", "en"]
      : ["en", "tk", "ru"];

  for (const L of locales) {
    const rows = await db.translationValue.findMany({
      where: { locale: L, key: { page, section, key } },
      take: 1,
    });
    if (rows[0]) return rows[0].value;
  }
  return fallback;
}

