import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";

type PreviewImage = {
  secureUrl: string;
};

export function ObituaryPreview({
  firstName,
  lastName,
  city,
  birthDate,
  deathDate,
  contentJson,
  image,
}: {
  firstName?: string;
  lastName?: string;
  city?: string;
  birthDate?: string;
  deathDate?: string;
  contentJson?: any;
  image?: PreviewImage | null;
}) {
  const title =
    [firstName, lastName].filter(Boolean).join(" ") || "Ime Prezime";

  const dates =
    birthDate || deathDate
      ? `${birthDate ? new Date(birthDate).toLocaleDateString("hr-HR") : "—"} – ${
          deathDate ? new Date(deathDate).toLocaleDateString("hr-HR") : "—"
        }`
      : "";

  const html = contentJson
    ? generateHTML(contentJson, [StarterKit])
    : "<p>Ovdje će se prikazati tekst osmrtnice…</p>";

  return (
    <div className="rounded-xl border bg-background p-6 shadow-sm">
      <div className="flex gap-4 items-start">
        {image?.secureUrl ? (
          <img
            src={image.secureUrl}
            alt="Slika"
            className="h-28 w-28 rounded-md border object-cover"
          />
        ) : (
          <div className="h-28 w-28 rounded-md border flex items-center justify-center text-xs text-muted-foreground">
            Slika
          </div>
        )}

        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{title}</h2>
          {dates && (
            <p className="text-sm text-muted-foreground mt-1">{dates}</p>
          )}
          {city && <p className="text-sm text-muted-foreground">{city}</p>}
        </div>
      </div>

      <hr className="my-4" />

      <div
        className="prose max-w-none"
        // HTML generiran iz tiptap JSON-a
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
