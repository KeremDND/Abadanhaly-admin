import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const stores = await db.store.findMany({ orderBy: [{ priority: "asc" }, { updatedAt: "desc" }] });
  return NextResponse.json(stores);
}

const storeSchema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  district: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(), // accept any, validate later if needed
  googleMapsUrl: z.string().optional().nullable(),
  mapsUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = storeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { name, address, city } = parsed.data;
  let slugBase = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Ensure unique slug
  let slug = slugBase;
  let suffix = 1;
  while (await db.store.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${suffix++}`;
  }

  const data = {
    slug,
    name,
    type: (parsed.data.type || "retail").toLowerCase(),
    address,
    city,
    district: parsed.data.district ?? undefined,
    phone: parsed.data.phone ?? undefined,
    email: parsed.data.email ?? undefined,
    mapsUrl: (parsed.data.mapsUrl || parsed.data.googleMapsUrl || undefined) as string | undefined,
    isActive: parsed.data.isActive ?? true,
  } as const;

  const store = await db.store.create({ data });
  revalidateTag("stores");
  ['/','/gallery','/about','/collaboration'].forEach(revalidatePath);
  return NextResponse.json(store, { status: 201 });
}

