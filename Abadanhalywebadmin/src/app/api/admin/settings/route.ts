import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET() {
  const s = await db.setting.findUnique({ where: { id: 1 } });
  return NextResponse.json(s || {});
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  // Only persist fields that exist in the current schema
  const updateData: any = {};
  if (typeof body.brandName === "string") updateData.brandName = body.brandName;
  if (typeof body.primaryHex === "string") updateData.primaryHex = body.primaryHex;
  if (typeof body.arEnabled === "boolean") updateData.arEnabled = body.arEnabled;

  const s = await db.setting.upsert({
    where: { id: 1 },
    update: updateData,
    create: { id: 1, brandName: updateData.brandName || "Abadan Haly", primaryHex: updateData.primaryHex || "#0B6A43", arEnabled: !!updateData.arEnabled },
  });
  revalidateTag("settings");
  ['/','/gallery','/about','/collaboration'].forEach(path => revalidatePath(path));
  return NextResponse.json(s);
}


