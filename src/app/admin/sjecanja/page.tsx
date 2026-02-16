"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminGuard } from "@/components/AdminGuard";
import { ADMIN_HEADER, getAdminKeyFromStorage } from "@/lib/admin";

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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const adminKey = getAdminKeyFromStorage();
      const res = await fetch("/api/sjecanja", {
        cache: "no-store",
        headers: adminKey ? { [ADMIN_HEADER]: adminKey } : undefined,
      });
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

  const counts = items.reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.status === "published") acc.published += 1;
      if (item.status === "draft") acc.draft += 1;
      return acc;
    },
    { total: 0, published: 0, draft: 0 },
  );

  const filtered = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (!query.trim()) return true;
    const needle = query.toLowerCase();
    return (
      item.personInfo.toLowerCase().includes(needle) ||
      item.authorName.toLowerCase().includes(needle)
    );
  });

  const statusBadge = (status: string) =>
    status === "published"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";

  async function updateStatus(id: string, status: "published" | "draft") {
    try {
      const adminKey = getAdminKeyFromStorage();
      const res = await fetch(`/api/sjecanja/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(adminKey ? { [ADMIN_HEADER]: adminKey } : {}),
        },
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
      const adminKey = getAdminKeyFromStorage();
      const res = await fetch(`/api/sjecanja/${id}`, {
        method: "DELETE",
        headers: adminKey ? { [ADMIN_HEADER]: adminKey } : undefined,
      });
      if (!res.ok) throw new Error(await res.text());
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e: any) {
      alert(e?.message || "Greška pri brisanju");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin · Sjećanja</h1>
          <p className="text-sm text-neutral-500">
            Ukupno: {counts.total} · Objavljeno: {counts.published} · Draft:{" "}
            {counts.draft}
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={load}>
          Osvježi
        </Button>
      </div>

      {/* Info Banner */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Upravljanje sjećanjima
            </h3>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
              Pregledajte i moderišite sjećanja koja su korisnici poslali.
              Provjerite sadržaj prije objavljivanja i osigurajte da su poruke
              primjerene i pažljivo napisane. Svako sjećanje čuva uspomenu na
              voljenu osobu.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraga po osobi ili autoru"
            className="md:max-w-sm"
          />
          <div className="flex items-center gap-2">
            {(["all", "published", "draft"] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={`h-9 rounded-md border px-3 text-sm ${
                  statusFilter === status
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-700"
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all"
                  ? "Sve"
                  : status === "published"
                    ? "Objavljeno"
                    : "Draft"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && <div>Učitavanje…</div>}
      {error && (
        <div className="text-red-600 mb-3">Greška: {String(error)}</div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Osoba
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Objavljeno
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.map((m) => {
                const published = m.status === "published";
                const publishedAt = m.publishedAt
                  ? new Date(m.publishedAt).toLocaleString()
                  : "—";
                return (
                  <tr key={m.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        {m.imageUrl ? (
                          <img
                            src={m.imageUrl}
                            alt="slika"
                            className="h-12 w-12 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md border flex items-center justify-center text-[10px] text-neutral-500">
                            Bez slike
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                            {m.personInfo}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {m.authorName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge(m.status)}`}
                        >
                          {m.status === "published" ? "Objavljeno" : "Draft"}
                        </span>
                        <div className="flex items-center gap-3 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`status-${m.id}`}
                              checked={published}
                              onChange={() => updateStatus(m.id, "published")}
                            />
                            Objavljeno
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`status-${m.id}`}
                              checked={!published}
                              onChange={() => updateStatus(m.id, "draft")}
                            />
                            Draft
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {publishedAt}
                    </td>
                    <td className="px-4 py-3">
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
