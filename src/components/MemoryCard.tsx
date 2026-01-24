"use client";

type Props = {
  personInfo: string;
  imageUrl?: string | null;
  contentHtml?: string | null;
  authorName?: string | null;
  dateRange?: string | null;
  publishDate?: string | Date | null;
};

export default function MemoryCard({
  personInfo,
  imageUrl,
  dateRange,
  contentHtml,
}: Props) {
  const stripTags = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const firstWords = (text: string, count: number) => {
    const words = text.trim().split(/\s+/);
    const out = words.slice(0, count).join(" ");
    return words.length > count ? out + "…" : out;
  };

  const previewText = contentHtml
    ? firstWords(stripTags(contentHtml), 15)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 text-center">
      <h1 className="font-serif text-base font-bold mb-1">{personInfo}</h1>
      {dateRange && (
        <p className="text-sm text-muted-foreground mb-4 italic">{dateRange}</p>
      )}

      <div className="mx-auto mb-6 w-[150px]">
        <div className="relative  border bg-white dark:bg-neutral-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={personInfo}
              className="block h-[150px] w-[150px] object-cover"
            />
          ) : (
            <img
              src="/kriz-sjecanja.png"
              alt="križ"
              className="block h-[150px] w-[150px] object-cover"
            />
          )}
        </div>
      </div>

      {previewText && (
        <p className="mx-auto max-w-none text-center text-sm text-neutral-700 dark:text-neutral-200">
          {previewText}
        </p>
      )}
    </div>
  );
}
