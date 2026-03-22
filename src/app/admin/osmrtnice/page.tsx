"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AdminTablePanel from "@/components/AdminTablePanel";
import Link from "next/link";

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
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const {
    data: items = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery<Obituary[]>({
    queryKey: ["admin", "osmrtnice"],
    queryFn: async () => {
      const res = await fetch("/api/osmrtnice", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "published" | "draft";
    }) => {
      const res = await fetch(`/api/osmrtnice/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as Obituary;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Obituary[]>(["admin", "osmrtnice"], (prev) =>
        (prev ?? []).map((it) => (it.id === updated.id ? updated : it)),
      );
    },
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : "Greška pri ažuriranju";
      alert(message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/osmrtnice/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Obituary[]>(["admin", "osmrtnice"], (prev) =>
        (prev ?? []).filter((it) => it.id !== id),
      );
    },
    onError: (e: unknown) => {
      const message = e instanceof Error ? e.message : "Greška pri brisanju";
      alert(message);
    },
  });

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
    const fullName = [item.firstName, item.lastName].filter(Boolean).join(" ");
    return (
      fullName.toLowerCase().includes(needle) ||
      item.slug.toLowerCase().includes(needle)
    );
  });

  async function updateStatus(id: string, status: "published" | "draft") {
    await updateStatusMutation.mutateAsync({ id, status });
  }

  async function removeItem(id: string) {
    if (!confirm("Obrisati osmrtnicu?")) return;
    await removeMutation.mutateAsync(id);
  }

  return (
    <AdminTablePanel
      title="Admin · Osmrtnice"
      counts={counts}
      onRefresh={() => refetch()}
      isFetching={isFetching}
      actionsSlot={
        <div className="flex items-center gap-2">
          <Link
            href="/admin/sjecanja"
            className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            Idi na sjećanja
          </Link>
          <Link
            href="/admin/osmrtnice/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white"
          >
            Nova osmrtnica
          </Link>
        </div>
      }
      infoTitle="Upravljanje osmrtnicama"
      infoText="Ovdje možete pregledati, uređivati i upravljati svim osmrtnicama. Koristite filtere za pretragu i mijenjajte status objava (Draft/Objavljeno). Provjerite sadržaj prije objavljivanja."
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Pretraga po imenu ili slug-u"
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      isLoading={isLoading}
      errorMessage={error instanceof Error ? error.message : error ? String(error) : null}
      items={filtered}
      getRowId={(item) => item.id}
      firstColumnLabel="Ime i prezime"
      renderPrimaryCell={(item) => {
        const fullName = [item.firstName, item.lastName].filter(Boolean).join(" ");
        return (
          <div className="flex flex-col">
            <span className="font-medium text-neutral-900">{fullName}</span>
            <span className="text-xs text-neutral-500">{item.slug}</span>
          </div>
        );
      }}
      getStatus={(item) => item.status}
      getPublishedAt={(item) => item.publishedAt}
      onUpdateStatus={(item, status) => {
        void updateStatus(item.id, status);
      }}
      onDeleteItem={(item) => {
        void removeItem(item.id);
      }}
    />
  );
}
