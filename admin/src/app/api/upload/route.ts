import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { validateAllowedFile, saveUpload } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);
  const filename = file.name || "upload.bin";
  const mime = file.type || "application/octet-stream";

  if (!validateAllowedFile(filename, mime)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const stored = await saveUpload(filename, bytes);
  return NextResponse.json(stored);
}
