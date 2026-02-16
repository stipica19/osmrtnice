import Link from "next/link";
import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "@/lib/tiptapExtensions";
import MemoryCard from "@/components/MemoryCard";

type MemoryItem = {
  id: string;
  slug: string | null;
  content: unknown;
  personInfo: string | null;
  dateRange: string | null;
  imageUrl: string | null;
};

function toContentHtml(content: unknown): string {
  if (!content) return "";
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

export function MemoriesList({ memories }: { memories: MemoryItem[] }) {
  if (!memories.length) {
    return (
      <div className="rounded-xl border border-dashed p-10 text-center text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-300">
        Još nema objavljenih sjećanja.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {memories.map((m) => {
        const contentHtml = toContentHtml(m.content);
        if (!m.slug) return null;

        return (
          <Link
            key={m.id}
            href={`/sjecanja/${m.slug}`}
            className="group block border border-neutral-200 bg-white p-4 shadow-sm transition
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

            <div className="mt-3 text-xs font-medium text-amber-700 opacity-0 transition group-hover:opacity-100 dark:text-amber-300">
              Pročitaj više →
            </div>
          </Link>
        );
      })}
    </div>
  );
}
