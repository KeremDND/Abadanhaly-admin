import { db } from "@/server/db";
import TranslationsTable from "./translations-table";

export default async function TranslationsIndex() {
  const keys = await db.translationKey.findMany({
    include: { values: true },
    orderBy: [{ page: "asc" }, { section: "asc" }, { key: "asc" }],
  });

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Translations</h1>
      <TranslationsTable keys={keys} />
    </div>
  );
}

