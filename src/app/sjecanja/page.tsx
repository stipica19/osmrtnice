import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "@/lib/tiptapExtensions";
import MemoryCard from "@/components/MemoryCard";

export const revalidate = 60;

type Memory = {
  id: string;
  slug: string;
  createdAt: Date;
  content: unknown;
  personInfo: string | null;
  dateRange: string | null;
  imageUrl: string | null;
  authorName: string | null;
  publishDate: Date | string | null;
};

function toContentHtml(content: unknown): string {
  if (!content) return "";

  // TipTap JSON
  if (typeof content === "object") {
    try {
      return generateHTML(content as any, TIPTAP_EXTENSIONS as any);
    } catch {
      return "";
    }
  }

  if (typeof content === "string") return content;

  return "";
}

export default async function MemoriesPage() {
  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
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
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            Najnovija sjećanja — pregled zadnjih 20 objava.
          </p>
        </div>

        <Link
          href="/sjecanja/new"
          className="inline-flex items-center justify-center rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:border-amber-500/40 dark:bg-neutral-900 dark:text-amber-300 dark:hover:bg-neutral-800 dark:focus:ring-offset-neutral-950"
        >
          Objavi sjećanje
        </Link>
      </div>

      {memories.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
          Još nema objavljenih sjećanja.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {memories.map((m: any) => {
            const contentHtml = toContentHtml(m.content);

            return (
              <Link
                key={m.id}
                href={`/sjecanja/${m.slug}`}
                className="group block  border border-neutral-200 bg-white p-4 shadow-sm transition
                           hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-md
                           focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
                           dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800
                           dark:focus:ring-offset-neutral-950"
              >
                <span className="sr-only">Otvori sjećanje</span>

                <div className="min-h-[120px]">
                  <MemoryCard
                    personInfo={m.personInfo ?? ""}
                    dateRange={m.dateRange ?? ""}
                    imageUrl={m.imageUrl ?? null}
                    contentHtml={contentHtml}
                  />
                </div>

                {/* suptilni “read more” affordance */}
                <div className="mt-3 text-xs font-medium text-amber-700 opacity-0 transition group-hover:opacity-100 dark:text-amber-300">
                  Pročitaj više →
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
