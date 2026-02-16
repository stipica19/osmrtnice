import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MemoriesList } from "@/components/MemoriesList";

export const revalidate = 60;

export default async function MemoriesPage() {
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    where: {
      status: "published",
    },
    select: {
      id: true,
      slug: true,
      createdAt: true,
      content: true,
      personInfo: true,
      dateRange: true,
      imageUrl: true,
      authorName: true,
      publishDate: true,
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">
            Sjećanja
          </h1>
          <p className="mt-2 text-base text-neutral-600 dark:text-neutral-300 max-w-2xl">
            Stranica posvećena svim onima koji žele podijeliti uspomene, priče i
            sjećanja na osobe koje su obilježile njihove živote. Vaša riječ čuva
            uspomenu i donosi utjehu onima koji tuguju.
          </p>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Prikazano je zadnjih 20 objavljenih sjećanja.
          </p>
        </div>

        <Link
          href="/sjecanja/new"
          className="inline-flex items-center justify-center rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:border-amber-500/40 dark:bg-neutral-900 dark:text-amber-300 dark:hover:bg-neutral-800 dark:focus:ring-offset-neutral-950"
        >
          Objavi sjećanje
        </Link>
      </div>

      <MemoriesList memories={memories} />
    </div>
  );
}
