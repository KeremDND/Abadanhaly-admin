import { prisma } from "@/lib/prisma";
import ContentForm from "./ui/content-form";

export default async function ContentEditor(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const page = await prisma.page.findUnique({ where: { slug }, include: { blocks: { orderBy: { order: "asc" } } } });
  if (!page) return <div className="p-6">Page not found</div>;
  return <ContentForm page={page} />;
}
