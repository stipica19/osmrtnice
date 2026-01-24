"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Memory = {
  id: string;
  publishDate?: string | null;
  status: "published" | "draft" | string;
  publishedAt?: string | null;
  personInfo: string;
  content: string;
  authorName: string;
  imageUrl?: string | null;
  createdAt: string;
};

export default function AdminMemoriesPage() {
  const [items, setItems] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sjecanja", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Neuspješno učitavanje");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: "published" | "draft") {
    try {
      const res = await fetch(`/api/sjecanja/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: Memory = await res.json();
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
    } catch (e: any) {
      alert(e?.message || "Greška pri ažuriranju statusa");
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Obrisati sjećanje?")) return;
    try {
      const res = await fetch(`/api/sjecanja/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e: any) {
      alert(e?.message || "Greška pri brisanju");
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin · Sjećanja</h1>

      {loading && <div>Učitavanje…</div>}
      {error && (
        <div className="text-red-600 mb-3">Greška: {String(error)}</div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Osoba
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Objavljeno
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((m) => {
                const published = m.status === "published";
                const publishedAt = m.publishedAt
                  ? new Date(m.publishedAt).toLocaleString()
                  : "—";
                return (
                  <tr key={m.id}>
                    <td className="px-3 py-2">
                      <div className="flex items-start gap-3">
                        {m.imageUrl ? (
                          <img
                            src={m.imageUrl}
                            alt="slika"
                            className="h-10 w-10 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md border flex items-center justify-center text-[10px] text-neutral-500">
                            Bez slike
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-neutral-700 line-clamp-2">
                            {m.personInfo}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {m.authorName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={`status-${m.id}`}
                            checked={published}
                            onChange={() => updateStatus(m.id, "published")}
                          />
                          <span>Published</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={`status-${m.id}`}
                            checked={!published}
                            onChange={() => updateStatus(m.id, "draft")}
                          />
                          <span>Draft</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-700">
                      {publishedAt}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="destructive"
                          onClick={() => removeItem(m.id)}
                        >
                          Obriši
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
