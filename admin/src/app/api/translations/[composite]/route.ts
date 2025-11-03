import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ composite: string }> }) {
  const { composite } = await ctx.params;
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
