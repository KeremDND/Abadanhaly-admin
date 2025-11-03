import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const blockSchema = z.object({
  id: z.string().optional(),
  kind: z.string(),
  position: z.number(),
  data: z.any(),
});

const pageUpdateSchema = z.object({
  title: z.string().optional(),
  status: z.string().optional(),
  blocks: z.array(blockSchema).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = await db.page.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const parsed = pageUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const page = await db.page.findUnique({ where: { slug } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Update page
  await db.page.update({
    where: { slug },
    data: {
      title: parsed.data.title,
      status: parsed.data.status,
    },
  });

  // Update blocks if provided
  if (parsed.data.blocks) {
    // Delete all existing blocks and recreate
    await db.block.deleteMany({ where: { pageId: page.id } });
    for (const b of parsed.data.blocks) {
      await db.block.create({
        data: {
          pageId: page.id,
          kind: b.kind,
          position: b.position,
          data: JSON.stringify(b.data),
        },
      });
    }
  }

  revalidateTag("pages");
  revalidatePath(`/${slug}`);
  revalidatePath(`/admin/pages/${slug}`);
  return NextResponse.json({ ok: true });
}

