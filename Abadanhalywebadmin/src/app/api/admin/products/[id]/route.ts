import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { images: { include: { media: true }, orderBy: { position: "asc" } } },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const product = await db.product.update({
    where: { id },
    data: body,
  });
  revalidateTag("products");
  revalidatePath("/gallery");
  return NextResponse.json(product);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.product.delete({ where: { id } });
  revalidateTag("products");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}

