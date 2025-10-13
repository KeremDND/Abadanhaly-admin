import { prisma } from "@/lib/prisma";

export async function t(page: string, section: string, key: string, locale: 'tk' | 'ru' | 'en', fallback = '') {
  const k = await prisma.translationKey.findFirst({
    where: { page, section, key },
    include: { values: true }
  });
  
  return k?.values.find(v => v.locale === locale)?.value ?? fallback;
}
