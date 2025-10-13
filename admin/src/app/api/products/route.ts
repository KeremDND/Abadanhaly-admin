import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const fd = await req.formData();
  const sku = String(fd.get("sku"));
  const name = String(fd.get("name"));
  const slug = String(fd.get("slug"));
  const categoryId = (fd.get("categoryId") as string) || undefined;
  const p = await prisma.product.create({ data: { sku, name, slug, categoryId, isActive: true } });
  return NextResponse.json({ id: p.id });
}
