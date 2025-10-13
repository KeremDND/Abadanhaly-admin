import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function PATCH(req: Request, { params }: { params: { slug: string; blockId: string } }) {
  const body = await req.json();
  const data = body.data as any;
  const updated = await prisma.block.update({ where: { id: params.blockId }, data: { data } });
  revalidatePath(`/${params.slug}`);
  revalidatePath(`/admin/content/${params.slug}`);
  return NextResponse.json(updated);
}
