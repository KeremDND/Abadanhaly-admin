import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function PagesList() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pages</h1>
      </div>

      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  <Link href={`/admin/pages/${p.id}`} className="text-green-700 underline">{p.slug}</Link>
                </TableCell>
                <TableCell>{p.status}</TableCell>
                <TableCell>{p.template}</TableCell>
                <TableCell>{new Date(p.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Link href={`/admin/content/${p.slug}`} className="text-green-700 underline">Edit content</Link>
                </TableCell>
              </TableRow>
            ))}
            {pages.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-sm text-gray-600">No pages yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
