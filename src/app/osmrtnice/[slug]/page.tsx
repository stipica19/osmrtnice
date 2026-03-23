import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { JSONContent } from "@tiptap/core";
import { toCloudinaryAvif } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import ObituaryDetails from "@/components/ObituaryDetails";

export const revalidate = 60;
export const runtime = "nodejs";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://osmrtnice-uskoplje.com";

const siteOrigin = new URL(siteUrl);

type PageProps = {
  params: { slug: string } | Promise<{ slug: string }> | string;
};

async function resolveSlug(params: PageProps["params"]): Promise<string | null> {
  const raw = await Promise.resolve(params);

  const parsed =
    typeof raw === "string"
      ? (JSON.parse(raw) as { slug?: string })
      : (raw as { slug?: string });

  return parsed.slug ?? null;
}

function getImageUrl(image: unknown): string | null {
  if (!image) return null;
  if (typeof image === "string") return toCloudinaryAvif(image);
  if (typeof image === "object") {
    const maybeImage = image as { secureUrl?: string; url?: string };
    return toCloudinaryAvif(maybeImage.secureUrl || maybeImage.url || null);
  }
  return null;
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return new URL(normalized, siteOrigin).toString();
}

function toJsonContent(value: unknown): JSONContent | undefined {
  if (!value || typeof value !== "object") return undefined;
  const candidate = value as JSONContent;
  return typeof candidate.type === "string" ? candidate : undefined;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = await resolveSlug(params);
  if (!slug) {
    return {
      robots: { index: false, follow: false },
    };
  }

  const o = await prisma.obituary.findFirst({
    where: { slug, status: "published" },
    select: {
      firstName: true,
      lastName: true,
      birthDate: true,
      deathDate: true,
      image: true,
      slug: true,
    },
  });

  if (!o) {
    return {
      robots: { index: false, follow: false },
    };
  }

  const fullName = [o.firstName, o.lastName].filter(Boolean).join(" ");
  const birthDate = o.birthDate
    ? new Date(o.birthDate).toLocaleDateString("hr-HR")
    : "";
  const deathDate = o.deathDate
    ? new Date(o.deathDate).toLocaleDateString("hr-HR")
    : "";

  const title = deathDate
    ? `${fullName} | Osmrtnica (${deathDate})`
    : `${fullName} | Osmrtnica`;
  const shareTitle = fullName || "Osmrtnica";

  const description = birthDate && deathDate
    ? `${fullName} (${birthDate} - ${deathDate}). S tugom javljamo da je preminuo/la ${fullName}.`
    : deathDate
      ? `${fullName} (${deathDate}). S tugom javljamo da je preminuo/la ${fullName}.`
      : `S tugom javljamo da je preminuo/la ${fullName}.`;

  const obituaryUrl = toAbsoluteUrl(`/osmrtnice/${o.slug}`);
  const imageUrl = getImageUrl(o.image);
  const ogImage = imageUrl
    ? toAbsoluteUrl(imageUrl)
    : toAbsoluteUrl("/kriz.jpg");

  return {
    title,
    description,
    alternates: {
      canonical: obituaryUrl,
    },
    openGraph: {
      title: shareTitle,
      description,
      url: obituaryUrl,
      siteName: "Osmrtnice",
      locale: "hr_HR",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullName || "Osmrtnica",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const slug = await resolveSlug(params);

  if (!slug) return notFound();

  const o = await prisma.obituary.findFirst({
    where: { slug, status: "published" },
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
      contentJson={toJsonContent(o.contentJson)}
      contentJson1={toJsonContent(o.contentJson1)}
    />
  );
}
