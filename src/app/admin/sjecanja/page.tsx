"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AdminTablePanel from "@/components/AdminTablePanel";
import Image from "next/image";
import Link from "next/link";

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
  } = useQuery<Memory[]>({
    queryKey: ["admin", "sjecanja"],
    queryFn: async () => {
      const res = await fetch("/api/sjecanja", {
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
      const res = await fetch(`/api/sjecanja/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as Memory;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<Memory[]>(["admin", "sjecanja"], (prev) =>
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
      const res = await fetch(`/api/sjecanja/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Memory[]>(["admin", "sjecanja"], (prev) =>
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
    return (
      item.personInfo.toLowerCase().includes(needle) ||
      item.authorName.toLowerCase().includes(needle)
    );
  });

  async function updateStatus(id: string, status: "published" | "draft") {
    await updateStatusMutation.mutateAsync({ id, status });
  }

  async function removeItem(id: string) {
    if (!confirm("Obrisati sjećanje?")) return;
    await removeMutation.mutateAsync(id);
  }

  return (
    <AdminTablePanel
      title="Admin · Sjećanja"
      counts={counts}
      onRefresh={() => refetch()}
      isFetching={isFetching}
      actionsSlot={
        <Link
          href="/admin/osmrtnice"
          className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-300 px-4 text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
        >
          Idi na osmrtnice
        </Link>
      }
      infoTitle="Upravljanje sjećanjima"
      infoText="Pregledajte i moderišite sjećanja koja su korisnici poslali. Provjerite sadržaj prije objavljivanja i osigurajte da su poruke primjerene i pažljivo napisane. Svako sjećanje čuva uspomenu na voljenu osobu."
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="Pretraga po osobi ili autoru"
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      isLoading={isLoading}
      errorMessage={error instanceof Error ? error.message : error ? String(error) : null}
      items={filtered}
      getRowId={(item) => item.id}
      firstColumnLabel="Osoba"
      renderPrimaryCell={(item) => (
        <div className="flex items-start gap-3">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt="slika"
              width={48}
              height={48}
              className="h-12 w-12 rounded-md border object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-md border flex items-center justify-center text-[10px] text-neutral-500">
              Bez slike
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900 line-clamp-2">
              {item.personInfo}
            </p>
            <p className="text-xs text-neutral-500">{item.authorName}</p>
          </div>
        </div>
      )}
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
