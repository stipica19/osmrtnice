import ShareButtons from "./ShareButtons";

type Props = {
  personInfo: string;
  imageUrl?: string | null;
  contentHtml?: string | null;
  authorName?: string | null;
  dateRange?: string | null;
  publishDate?: string | Date | null;
};

export default function MemoryDetails({
  personInfo,
  imageUrl,
  contentHtml,
  authorName,
  dateRange,
  publishDate,
}: Props) {
  const fmtDate = (d?: string | Date | null) => {
    if (!d) return "";
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return isNaN(dateObj.getTime()) ? "" : dateObj.toLocaleDateString("hr-HR");
  };

  return (
    <div className="mx-auto max-w-800 bg-white px-8 py-10 font-serif text-neutral-900 print:max-w-none print:px-12 print:py-16">
      {/* PORTRET */}
      <div className="mb-6 flex justify-center">
        <div className="h-40 w-40 overflow-hidden rounded-md border bg-neutral-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={personInfo}
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src="/kriz-sjecanja.png"
              alt="križ"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {/* IME */}
      <h1 className="text-center text-4xl font-bold tracking-wide">
        {personInfo}
      </h1>

      {/* DATUMSKI OPIS */}
      {dateRange && (
        <p className="mt-2 text-center text-base text-neutral-600 italic">
          {dateRange}
        </p>
      )}

      {/* RAZDJELNA LINIJA */}
      <div className="mx-auto my-6 h-px w-24 bg-neutral-300" />

      {/* SADRŽAJ */}
      {contentHtml && (
        <div
          className="prose prose-base mx-auto max-w-none text-center leading-relaxed prose-p:my-2 prose-strong:font-semibold"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      )}
      <ShareButtons />
    </div>
  );
}
