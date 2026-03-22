import Link from "next/link";
import Image from "next/image";

type CardProps = {
  imageSrc: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  location: string;
  age: number;
  href?: string;
};

export default function Card({
  imageSrc,
  fullName,
  birthDate,
  deathDate,
  age,
  href,
}: CardProps) {
  const cardContent = (
    <>
      {/* Image */}
      <div className="flex justify-center">
        <div className="relative h-36 w-28 overflow-hidden border-4 border-black bg-neutral-50">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={fullName}
              fill
              sizes="112px"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Name */}
      <h2 className="mt-4 text-center text-2xl font-bold tracking-wide">
        {fullName}
      </h2>

      {/* Dates */}
      <p className="mt-1 text-center text-sm text-neutral-600">
        {birthDate} {birthDate && deathDate ? "-" : ""} {deathDate}
      </p>

      {typeof age === "number" && age > 0 && (
        <p className="mt-1 text-center text-xs text-neutral-500">
          u {age} godini
        </p>
      )}

      <div className="mx-auto my-4 h-px w-16 bg-neutral-200" />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block h-full rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      >
        <article className="flex h-full flex-col border bg-white px-6 py-6 font-serif text-neutral-900 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">
          {cardContent}
        </article>
      </Link>
    );
  }

  return (
    <article className="flex h-full flex-col border bg-white px-6 py-6 font-serif text-neutral-900 shadow-sm">
      {cardContent}
    </article>
  );
}
