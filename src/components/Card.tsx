import Link from "next/link";

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
  location,
  age,
  href,
}: CardProps) {
  return (
    <div className="flex h-full flex-col bg-white border shadow-sm px-6 py-6 font-serif text-neutral-900">
      {/* Image */}
      <div className="flex justify-center">
        <div className="relative h-36 w-28 overflow-hidden border-4 border-black bg-neutral-50">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={fullName}
              height={150}
              width={150}
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

      {/* Buttons - push to bottom */}
      <div className="mt-auto space-y-3">
        {href && (
          <Link
            href={href}
            className="block w-full rounded-md border border-amber-400 py-2 text-center text-sm font-medium text-amber-600 transition hover:bg-amber-50"
          >
            Pročitaj više
          </Link>
        )}
      </div>
    </div>
  );
}
