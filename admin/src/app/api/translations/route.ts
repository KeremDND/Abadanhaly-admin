import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const keys = await prisma.translationKey.findMany({ 
    include: { values: true }, 
    orderBy: [{ page: 'asc' }, { section: 'asc' }, { key: 'asc' }] 
  });
  return NextResponse.json({ keys });
}
