import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MemoryDetails from "@/components/MemoryDetails";
import Link from "next/link";

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 120;

export default async function MemoryDetailPage({ params }: Params) {
  const { slug } = await params;

  const memory = await prisma.memory.findFirst({
    where: { slug, status: "published" },
  });
  if (!memory) return notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/sjecanja" className="text-sm text-primary hover:underline">
        ← Povratak na sjećanja
      </Link>

      <div className="mt-4 rounded-xl border bg-white p-6 dark:bg-neutral-900">
        <MemoryDetails
          personInfo={memory.personInfo || ""}
          dateRange={memory.dateRange || ""}
          imageUrl={memory.imageUrl || null}
          contentHtml={memory.content || ""}
        />
      </div>
    </div>
  );
}
