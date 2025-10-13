import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params: { composite } }: { params: { composite: string } }) {
  const { page, section, key, locale, value } = await req.json();
  const [pg, sc, ky] = composite.includes('.') ? composite.split('.') : [page, section, key];
  
  const k = await prisma.translationKey.upsert({
    where: { page_section_key: { page: pg, section: sc, key: ky } },
    update: {},
    create: { page: pg, section: sc, key: ky }
  });
  
  await prisma.translationValue.upsert({
    where: { key_locale: { keyId: k.id, locale } },
    update: { value },
    create: { keyId: k.id, locale, value }
  });
  
  return Response.json({ ok: true });
}
