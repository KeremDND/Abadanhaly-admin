import { db } from "@/server/db";
import { notFound } from "next/navigation";
import BlockEditor from "./block-editor";

export default async function PageEditor({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await db.page.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { position: "asc" } } },
  });

  if (!page) notFound();

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Page: {page.title}</h1>
        <p className="text-sm text-gray-600 mt-1">Slug: {page.slug}</p>
      </div>
      <BlockEditor page={page} />
    </div>
  );
}

