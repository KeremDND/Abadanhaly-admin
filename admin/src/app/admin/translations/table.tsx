'use client';

async function save(page: string, section: string, key: string, locale: 'tk' | 'ru' | 'en', value: string) {
  await fetch(`/api/translations/${page}.${section}.${key}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page, section, key, locale, value })
  });
}

export default function TranslationsTable({ grouped }: { grouped: any }) {
  return (
    <div className="p-6 space-y-6">
      {Object.entries(grouped).map(([page, sections]: any) => (
        <div key={page} className="border rounded">
          <div className="px-4 py-3 font-semibold bg-gray-50">{page.toUpperCase()}</div>
          <div className="p-4 space-y-6">
            {Object.entries(sections).map(([section, rows]: any) => (
              <div key={section}>
                <div className="text-sm font-medium mb-2 text-gray-600">{section}</div>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Key</th>
                      <th className="text-left p-2">TK</th>
                      <th className="text-left p-2">RU</th>
                      <th className="text-left p-2">EN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((k: any) => (
                      <tr key={k.id} className="border-t">
                        <td className="p-2 font-mono">{k.key}</td>
                        {(['tk', 'ru', 'en'] as const).map(loc => {
                          const v = k.values.find((x: any) => x.locale === loc)?.value || '';
                          return (
                            <td key={loc} className="p-2">
                              <input
                                defaultValue={v}
                                onBlur={(e) => save(k.page, k.section, k.key, loc, e.currentTarget.value)}
                                className="w-full border rounded px-2 py-1"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
