import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const productSchema = z.object({
  sku: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  color: z.string(),
  sizes: z.string().optional(),
  tags: z.string().optional(),
  isActive: z.boolean().optional(),
  nameKeyId: z.string().optional(),
  descKeyId: z.string().optional(),
});

export async function GET() {
  const products = await db.product.findMany({
    include: { images: { include: { media: true }, orderBy: { position: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  // Generate slug if missing from sku
  const base = parsed.data.slug || parsed.data.sku;
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Normalize color
  const color = (parsed.data.color || "").toLowerCase().replace(/\s+/g, "-");

  const data = {
    sku: parsed.data.sku,
    slug,
    color,
    sizes: parsed.data.sizes ?? "160x230,200x300,300x400",
    tags: parsed.data.tags ?? "",
    isActive: parsed.data.isActive ?? true,
    nameKeyId: parsed.data.nameKeyId,
    descKeyId: parsed.data.descKeyId,
  } as const;

  const product = await db.product.create({ data });
  revalidateTag("products");
  ['/','/gallery','/about','/collaboration'].forEach(path => revalidatePath(path));
  return NextResponse.json(product, { status: 201 });
}

