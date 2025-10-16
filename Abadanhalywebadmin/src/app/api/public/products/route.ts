import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await db.product.findMany({
    where: { isActive: true },
    include: { images: { include: { media: true }, orderBy: { position: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(products);
}

