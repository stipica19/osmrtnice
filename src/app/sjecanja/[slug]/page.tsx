import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MemoryDetails from "@/components/MemoryDetails";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 120;

export default async function MemoryDetailPage({ params }: Params) {
  const { slug } = await params;

  const memory = await prisma.memory.findUnique({ where: { slug } });
  if (!memory) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <a href="/sjecanja" className="text-sm text-primary hover:underline">
        ← Povratak na sjećanja
      </a>

      <div className="mt-4 rounded-xl border bg-white p-6 dark:bg-neutral-900">
        <MemoryDetails
          personInfo={(memory.personInfo as any) || ""}
          dateRange={(memory.dateRange as any) || ""}
          imageUrl={(memory.imageUrl as any) || null}
          contentHtml={(memory.content as any) || ""}
        />
      </div>
    </div>
  );
}
