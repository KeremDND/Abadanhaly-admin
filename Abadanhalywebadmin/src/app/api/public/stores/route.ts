import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  const stores = await db.store.findMany({
    where: { isActive: true },
    orderBy: [{ priority: "asc" }],
  });
  return NextResponse.json(stores);
}

