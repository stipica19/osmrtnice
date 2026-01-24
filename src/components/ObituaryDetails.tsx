import { Extension } from "@tiptap/core";
import { TextStyle } from "@tiptap/extension-text-style";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ShareButtons from "./ShareButtons";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const o = await prisma.obituary.findUnique({
    where: { slug: params.slug },
    select: {
      firstName: true,
      lastName: true,
      birthDate: true,
      deathDate: true,
      image: true,
    },
  });

  if (!o) {
    return {};
  }

  const fullName = [o.firstName, o.lastName].filter(Boolean).join(" ");

  const deathDate = o.deathDate
    ? new Date(o.deathDate).toLocaleDateString("hr-HR")
    : "";

  const title = deathDate ? `${fullName} • preminuo/la ${deathDate}` : fullName;

  const imageUrl =
    typeof o.image === "string"
      ? o.image
      : (o.image as any)?.secureUrl || (o.image as any)?.url;

  return {
    title,
    description: `S tugom javljamo da je preminuo/la ${fullName}.`,
    openGraph: {
      title,
      description: `S tugom javljamo da je preminuo/la ${fullName}.`,
      type: "article",
      locale: "hr_HR",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: fullName,
            },
          ]
        : [],
    },
  };
}

type Props = {
  portraitUrl?: string | null;
  firstName?: string;
  lastName?: string;
  djevojackoPrezime?: string;
  spol?: "M" | "Z";
  birthYear?: string;
  deathDate?: string; // ISO yyyy-mm-dd
  contentJson?: any;
  contentJson1?: any;
};
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              (element as HTMLElement).style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

const EXTENSIONS = [StarterKit, TextStyle, FontSize];
export default function ObituaryDetails({
  portraitUrl,
  firstName,
  lastName,
  djevojackoPrezime,
  spol,
  birthYear,
  deathDate,
  contentJson,
  contentJson1,
}: Props) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Ime Prezime";

  const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("hr-HR") : "";

  const dDate = fmtDate(deathDate);

  const pokopDesc = contentJson?.type
    ? generateHTML(contentJson, EXTENSIONS)
    : "";

  const ozalosceni = contentJson1?.type
    ? generateHTML(contentJson1, EXTENSIONS)
    : "";

  const birthLine =
    spol === "Z"
      ? birthYear
        ? `rođ. ${djevojackoPrezime ? djevojackoPrezime + " " : ""}${birthYear}.`
        : ""
      : birthYear
        ? `rođ. ${birthYear}.`
        : "";

  return (
    <div className="mx-auto max-w-[800px] bg-white px-8 py-10 font-serif text-neutral-900 print:max-w-none print:px-12 print:py-16">
      {/* PORTRET */}
      {portraitUrl && (
        <div className="mb-6 flex justify-center">
          <img
            src={portraitUrl}
            alt="Portret"
            className="h-40 w-40 rounded-md border object-cover"
          />
        </div>
      )}

      {/* IME */}
      <h1 className="text-center text-4xl font-bold tracking-wide">
        {fullName} ++
      </h1>

      {/* GODINA / DATUM */}
      <p className="mt-2 text-center text-base text-neutral-600">
        {birthLine}
        {dDate && (
          <>
            {birthLine && " "}• preminuo/la {dDate}
          </>
        )}
      </p>

      {/* RAZDJELNA LINIJA */}
      <div className="mx-auto my-6 h-px w-24 bg-neutral-300" />

      {/* TEKST POKOPA */}
      {pokopDesc && (
        <div
          className="prose prose-base mx-auto max-w-none text-center leading-relaxed
                     prose-p:my-2 prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: pokopDesc }}
        />
      )}

      {/* OŽALOŠĆENI */}
      {ozalosceni && (
        <div className="mt-8">
          <h2 className="mb-2 text-center text-sm font-semibold tracking-widest uppercase text-neutral-600">
            Ožalošćeni
          </h2>

          <div
            className="prose prose-sm mx-auto max-w-none text-center
                       prose-p:my-1"
            dangerouslySetInnerHTML={{ __html: ozalosceni }}
          />
        </div>
      )}
      <ShareButtons title={fullName} />
    </div>
  );
}
