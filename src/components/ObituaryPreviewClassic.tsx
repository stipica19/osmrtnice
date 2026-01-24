import { TIPTAP_EXTENSIONS } from "@/lib/tiptapExtensions";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

type UploadedImage = {
  secureUrl: string;
};

export function ObituaryPreviewClassic({
  templateLeftUrl = "/templates/cross.jpg",
  portrait,
  announcementDate,
  firstName,
  lastName,
  djevojackoPrezime,
  spol,
  birthDate,
  deathDate,
  funeralDate,
  funeralTime,
  cemetery,
  familyText,
  contentJson,
  contentJson1,
  footerText,
}: {
  templateLeftUrl?: string;
  portrait?: UploadedImage | null;
  announcementDate?: string;
  firstName?: string;
  djevojackoPrezime?: string;
  spol?: "M" | "Z";
  lastName?: string;
  birthDate?: string;
  deathDate?: string;
  funeralDate?: string;
  funeralTime?: string;
  cemetery?: string;
  familyText?: string;
  contentJson?: any;
  contentJson1?: any;
  footerText?: string;
}) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || "Ime Prezime";

  const pokop_desc = contentJson?.type
    ? generateHTML(contentJson, [...TIPTAP_EXTENSIONS])
    : "<p></p>";
  const ozalosceni =
    contentJson1 && contentJson1?.type
      ? generateHTML(contentJson1, [...TIPTAP_EXTENSIONS])
      : "<p></p>";

  const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("hr-HR") : "";

  const formatYear = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    return date.getFullYear().toString();
  };

  const aDate = fmtDate(announcementDate);

  const birthLine =
    spol === "Z"
      ? birthDate
        ? `(rođ. ${djevojackoPrezime ? djevojackoPrezime + " " : ""}${formatYear(birthDate)}.)`
        : "(rođ. ______.)"
      : birthDate
        ? `(rođ. ${formatYear(birthDate)}.)`
        : "(____.)";

  return (
    <div className="bg-black rounded-xl p-10">
      {/* unutarnji frame */}
      <div className="rounded-xl bg-white overflow-hidden">
        <div className="grid grid-cols-[260px_1fr]">
          {/* LIJEVO: template slika */}
          <div className="bg-neutral-900">
            <img
              src="/kriz.jpg"
              alt="motiv"
              className="h-full w-full object-cover"
            />
          </div>

          {/* DESNO: sadržaj */}
          <div className=" flex  p-8">
            {/* centrirani tekst */}
            <div className="flex flex-col w-full items-center text-center justify-around font-serif px-6">
              {portrait?.secureUrl && (
                <img
                  src={portrait.secureUrl}
                  alt="portret"
                  className="h-50 w-40 object-cover border border-neutral-300"
                />
              )}
              <p className="text-xl font-semibold leading-snug">
                Tužnim srcem javljamo rodbini i prijateljima
                <br />
                {aDate ? (
                  <>
                    da je dana <span className="font-bold">{aDate} &nbsp;</span>
                    godine
                  </>
                ) : (
                  <>da je dana ________. godine</>
                )}
                {spol == "Z" ? " preminula naša draga" : " preminuo naš dragi"}
              </p>

              <h1 className="mt-6 text-6xl font-extrabold tracking-tight">
                {fullName}
              </h1>

              <p className="mt-2 text-2xl font-bold">{birthLine}</p>

              <div className="mt-6 text-3xl font-extrabold leading-snug">
                {contentJson?.type && (
                  <div
                    className="max-w-none mx-auto mt-2 text-center font-sans"
                    dangerouslySetInnerHTML={{ __html: pokop_desc }}
                  />
                )}
              </div>

              <div className="mt-8">
                <p className="text-3xl font-extrabold">OŽALOŠĆENI:</p>
                {contentJson1?.type && (
                  <div
                    className="max-w-none mx-auto mt-2 text-center font-sans"
                    dangerouslySetInnerHTML={{ __html: ozalosceni }}
                  />
                )}
              </div>

              {/* Rich text sadržaj ispod (ako želiš dodatni tekst) */}
            </div>
          </div>
        </div>

        {/* donji footer na crnom (kao na slici) */}
        <div className="bg-black text-white text-center py-4 font-serif text-2xl">
          {footerText}
        </div>
      </div>
    </div>
  );
}
