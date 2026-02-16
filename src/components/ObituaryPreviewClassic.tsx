import { TIPTAP_EXTENSIONS } from "@/lib/tiptapExtensions";
import { generateHTML } from "@tiptap/html";
import { formatDateHr, formatYear } from "@/lib/format";
import type { ObituaryPreviewSettings } from "@/lib/obituary";

type UploadedImage = {
  secureUrl: string;
};

export function ObituaryPreviewClassic({
  templateLeftUrl = "/kriz.jpg",
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
  settings,
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
  settings?: ObituaryPreviewSettings;
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

  const aDate = formatDateHr(announcementDate);
  const birthYear = formatYear(birthDate);

  const birthLine =
    spol === "Z"
      ? birthDate
        ? `(rođ. ${djevojackoPrezime ? djevojackoPrezime + " " : ""}${birthYear}.)`
        : "(rođ. ______.)"
      : birthDate
        ? `(rođ. ${birthYear}.)`
        : "(____.)";

  const fontClassName =
    settings?.fontFamily === "sans" ? "font-sans" : "font-serif";
  const fontStyle =
    settings?.fontFamily === "classic"
      ? { fontFamily: '"Times New Roman", "Georgia", serif' }
      : undefined;
  const contentSizeClass =
    settings?.contentSize === "lg"
      ? "text-3xl"
      : settings?.contentSize === "sm"
        ? "text-xl"
        : "text-2xl";
  const familySizeClass =
    settings?.familySize === "lg"
      ? "text-2xl"
      : settings?.familySize === "sm"
        ? "text-lg"
        : "text-xl";
  const imageFitClass =
    settings?.imageFit === "contain" ? "object-contain" : "object-cover";

  const safeFooterText = footerText || "Počivao u miru Božjem!";

  return (
    <div className="obituary-preview-frame h-full w-full rounded-2xl border-[6px] border-neutral-900 bg-neutral-900 box-border">
      <div className="overflow-hidden rounded-xl bg-white">
        <div className="grid h-full grid-cols-[32%_1fr]">
          <div className="h-full bg-neutral-900">
            <img
              src="/kriz.jpg"
              alt="motiv"
              className="h-[19cm] w-full object-cover"
            />
          </div>

          <div className="flex p-6">
            <div
              className={`flex w-full flex-col items-center justify-center text-center ${fontClassName}`}
              style={fontStyle}
            >
              {portrait?.secureUrl && (
                <div className="mb-4 h-36 w-28 overflow-hidden rounded-md border">
                  <img
                    src={portrait.secureUrl}
                    alt="portret"
                    className={`h-full w-full ${imageFitClass}`}
                  />
                </div>
              )}

              <p className="text-lg font-semibold leading-snug">
                Tužnim srcem javljamo rodbini i prijateljima
                <br />
                {aDate ? (
                  <>
                    da je dana <span className="font-bold">{aDate}</span> godine
                  </>
                ) : (
                  <>da je dana ________. godine</>
                )}
                {spol === "Z" ? " preminula naša draga" : " preminuo naš dragi"}
              </p>

              <h1 className="mt-4 text-6xl font-extrabold tracking-tight">
                {fullName}
              </h1>

              <p className="mt-2 text-xl font-semibold">{birthLine}</p>

              <div
                className={`mt-6 max-h-60 overflow-hidden ${contentSizeClass}`}
              >
                {contentJson?.type && (
                  <div
                    className="mx-auto mt-2 max-w-none text-center"
                    dangerouslySetInnerHTML={{ __html: pokop_desc }}
                  />
                )}
              </div>

              <div className="mt-6 max-h-48 overflow-hidden">
                <p className="text-2xl font-extrabold tracking-wide">
                  OŽALOŠĆENI:
                </p>
                {contentJson1?.type && (
                  <div
                    className={`mx-auto mt-2 max-w-none text-center ${familySizeClass}`}
                    dangerouslySetInnerHTML={{ __html: ozalosceni }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="obituary-footer bg-neutral-900 py-3 text-center text-lg text-white">
          <p className="font-serif" style={fontStyle}>
            {safeFooterText}
          </p>
        </div>
      </div>
    </div>
  );
}
