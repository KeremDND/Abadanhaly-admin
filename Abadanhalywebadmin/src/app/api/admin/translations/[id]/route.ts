import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { locale, value } = body;

  await db.translationValue.upsert({
    where: { key_locale: { keyId: id, locale } },
    update: { value },
    create: { keyId: id, locale, value },
  });

  revalidateTag("i18n");
  ['/','/gallery','/about','/collaboration'].forEach(revalidatePath);
  return NextResponse.json({ ok: true });
}

