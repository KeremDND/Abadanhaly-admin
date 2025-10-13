import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ slug: string; blockId: string }> }) {
  const params = await ctx.params;
  const body = await req.json();
  const data = body.data as any;
  const updated = await prisma.block.update({ where: { id: params.blockId }, data: { data } });
  revalidatePath(`/${params.slug}`);
  revalidatePath(`/admin/content/${params.slug}`);
  return NextResponse.json(updated);
}
