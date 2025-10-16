import { db } from "@/server/db";
import NewStore from "./new-store";

export default async function StoresIndex() {
  const stores = await db.store.findMany({ orderBy: [{ priority: "asc" }] });

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
        <NewStore />
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stores.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {s.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {s.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {s.isActive ? "Yes" : "No"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href={`/admin/stores/${s.id}`} className="text-green-600 hover:text-green-900">
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

