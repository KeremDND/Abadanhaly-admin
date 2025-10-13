import { prisma } from "@/lib/prisma";
import TranslationsTable from "./table";

export default async function Translations() {
  const keys = await prisma.translationKey.findMany({
    include: { values: true },
    orderBy: [{ page: 'asc' }, { section: 'asc' }, { key: 'asc' }]
  });
  
  const grouped = keys.reduce((a: any, k: any) => {
    a[k.page] ??= {};
    a[k.page][k.section] ??= [];
    a[k.page][k.section].push(k);
    return a;
  }, {});
  
  return (
    <main className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Translations</h1>
      </div>
      <TranslationsTable grouped={grouped} />
    </main>
  );
}
