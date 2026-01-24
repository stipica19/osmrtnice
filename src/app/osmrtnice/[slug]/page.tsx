import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ObituaryDetails from "@/components/ObituaryDetails";

export const revalidate = 60;
export const runtime = "nodejs";

type PageProps = {
  params: { slug: string } | Promise<{ slug: string }> | string;
};

function getImageUrl(image: any): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (typeof image === "object") {
    return (image as any).secureUrl || (image as any).url || null;
  }
  return null;
}

export default async function Page({ params }: PageProps) {
  const raw = await Promise.resolve(params);

  const parsed =
    typeof raw === "string"
      ? (JSON.parse(raw) as { slug?: string })
      : (raw as { slug?: string });

  const slug = parsed.slug;

  if (!slug) return notFound();

  const o = await prisma.obituary.findUnique({
    where: { slug },
  });

  if (!o) return notFound();

  const portraitUrl = getImageUrl(o.image);
  const birthYear = o.birthDate
    ? new Date(o.birthDate).getFullYear().toString()
    : "";

  return (
    <ObituaryDetails
      portraitUrl={portraitUrl}
      firstName={o.firstName}
      lastName={o.lastName}
      djevojackoPrezime={o.djevojackoPrezime ?? undefined}
      spol={(o.spol as "M" | "Z") ?? undefined}
      birthYear={birthYear}
      deathDate={
        o.deathDate
          ? new Date(o.deathDate).toISOString().slice(0, 10)
          : undefined
      }
      contentJson={o.contentJson}
      contentJson1={o.contentJson1}
    />
  );
}
