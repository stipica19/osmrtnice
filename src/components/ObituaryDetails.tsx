import { Extension } from "@tiptap/core";
import { TextStyle } from "@tiptap/extension-text-style";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

import Image from "next/image";
import ShareButtons from "./ShareButtons";

type Props = {
  portraitUrl?: string | null;
  firstName?: string;
  lastName?: string;
  djevojackoPrezime?: string;
  spol?: "M" | "Z";
  birthYear?: string;
  deathDate?: string; // ISO yyyy-mm-dd
  contentJson?: JSONContent;
  contentJson1?: JSONContent;
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

  const deathVerb = spol === "Z" ? "preminula" : spol === "M" ? "preminuo" : "preminuo/la";

  return (
    <div className="mx-auto max-w-200 bg-white px-6 py-10 font-serif text-neutral-900 print:max-w-none print:px-12 print:py-16">
      {/* PORTRET */}
      {portraitUrl && (
        <div className="mb-6 flex justify-center">
          <Image
            src={portraitUrl}
            alt="Portret"
            width={220}
            height={220}
            className="h-full w-58 rounded-md border object-cover"
          />
        </div>
      )}

      {/* IME */}
      <h1 className="text-center text-4xl font-bold tracking-wide">
        {fullName}
      </h1>

      {/* GODINA / DATUM */}
      <p className="mt-2 text-center text-3xl text-neutral-800">
        {birthLine}
       
      </p>
      <p className="mt-2 text-center text-xl text-neutral-800">
         {dDate && (
          <>
            {birthLine && " "}{deathVerb} {dDate}
          </>
        )}
      </p>
      {/* RAZDJELNA LINIJA */}
      <div className="mx-auto my-6 h-px w-24 bg-neutral-300" />

      {/* TEKST POKOPA */}
      {pokopDesc && (
        <div
          className="prose prose-base mx-auto max-w-none text-center text-lg leading-relaxed
                     prose-p:my-2 prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: pokopDesc }}
        />
      )}

      {/* OŽALOŠĆENI */}
      {ozalosceni && (
        <div className="mt-8">
          <h2 className="mb-2 text-center text-lg font-semibold tracking-widest uppercase text-neutral-800">
            Ožalošćeni
          </h2>

          <div
            className="prose prose-base mx-auto max-w-none text-center text-lg leading-relaxed
                       prose-p:my-1"
            dangerouslySetInnerHTML={{ __html: ozalosceni }}
          />
        </div>
      )}
      <ShareButtons title={fullName} />
    </div>
  );
}
