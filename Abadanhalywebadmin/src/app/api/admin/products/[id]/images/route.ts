import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { randomUUID } from "crypto";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const form = await req.formData();
  const file = form.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), bytes);

  const media = await db.media.create({
    data: { url: `/uploads/${filename}` },
  });

  const count = await db.productImage.count({ where: { productId: id } });
  await db.productImage.create({
    data: { productId: id, mediaId: media.id, position: count },
  });

  revalidateTag("products");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true, media });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { images } = body; // array of { id, position }

  for (const img of images) {
    await db.productImage.update({
      where: { id: img.id },
      data: { position: img.position },
    });
  }

  revalidateTag("products");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const imageId = searchParams.get("imageId");
  if (!imageId) return NextResponse.json({ error: "Missing imageId" }, { status: 400 });

  await db.productImage.delete({ where: { id: imageId } });
  revalidateTag("products");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}

