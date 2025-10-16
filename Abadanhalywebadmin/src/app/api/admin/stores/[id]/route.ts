import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const store = await db.store.findUnique({ where: { id } });
  if (!store) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(store);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const store = await db.store.update({
    where: { id },
    data: body,
  });
  revalidateTag("stores");
  ["/", "/stores"].forEach((p) => revalidatePath(p));
  return NextResponse.json(store);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.store.delete({ where: { id } });
  revalidateTag("stores");
  ["/", "/stores"].forEach((p) => revalidatePath(p));
  return NextResponse.json({ ok: true });
}

