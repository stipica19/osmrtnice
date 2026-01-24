"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Obituary = {
  id: string;
  firstName: string;
  lastName: string;
  djevojackoPrezime?: string | null;
  spol?: string | null;
  birthDate?: string | null;
  deathDate?: string | null;
  slug: string;
  status: "published" | "draft" | string;
  publishedAt?: string | null;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AdminObituariesPage() {
  const [items, setItems] = useState<Obituary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/osmrtnice", { cache: "no-store" });
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
      const res = await fetch(`/api/osmrtnice/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated: Obituary = await res.json();
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
    } catch (e: any) {
      alert(e?.message || "Greška pri ažuriranju statusa");
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Obrisati osmrtnicu?")) return;
    try {
      const res = await fetch(`/api/osmrtnice/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e: any) {
      alert(e?.message || "Greška pri brisanju");
    }
  }

  return (
    <div className="p-6 mb-0 mt-0 mr-auto ml-auto max-w-7xl">
      <h1 className="text-2xl font-semibold mb-4">Admin · Osmrtnice</h1>

      {loading && <div>Učitavanje…</div>}
      {error && (
        <div className="text-red-600 mb-3">Greška: {String(error)}</div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto max-w-7xl ">
          <table className="min-w-full border divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ime i prezime
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
              {items.map((o) => {
                const fullName = [o.firstName, o.lastName]
                  .filter(Boolean)
                  .join(" ");
                const published = o.status === "published";
                const publishedAt = o.publishedAt
                  ? new Date(o.publishedAt).toLocaleString()
                  : "—";
                return (
                  <tr key={o.id}>
                    <td className="px-3 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium">{fullName}</span>
                        <span className="text-xs text-gray-500">{o.slug}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={`status-${o.id}`}
                            checked={published}
                            onChange={() => updateStatus(o.id, "published")}
                          />
                          <span>Published</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={`status-${o.id}`}
                            checked={!published}
                            onChange={() => updateStatus(o.id, "draft")}
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
                          onClick={() => removeItem(o.id)}
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
