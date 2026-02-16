import Card from "@/components/Card";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const obituaries = await prisma.obituary.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      status: "published",
    },
    take: 24,
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center  py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* Hero Section */}
        <div className="mb-16 w-full text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
            In Memoriam
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Mjesto sjećanja na naše najmilije koji su nas napustili. Ovdje
            čuvamo uspomene i odajemo počast onima koji će zauvijek ostati u
            našim srcima.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="/sjecanja"
              className="inline-flex items-center rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 transition"
            >
              Pogledaj sjećanja
            </a>
            <a
              href="/admin/sjecanja/new"
              className="inline-flex items-center rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 transition dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Predaj sjećanje
            </a>
          </div>
        </div>

        {/* Obituaries Grid */}
        <div className="w-full">
          <h2 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-6 mt-6">
            Osmrtnice
          </h2>
        </div>
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 items-stretch">
          {obituaries.map((o: any) => {
            const fullName = [o.firstName, o.lastName]
              .filter(Boolean)
              .join(" ");
            const birthDate = o.birthDate ? new Date(o.birthDate) : null;
            const deathDate = o.deathDate ? new Date(o.deathDate) : null;
            const age =
              birthDate && deathDate
                ? Math.floor(
                    (deathDate.getTime() - birthDate.getTime()) /
                      (1000 * 60 * 60 * 24 * 365.25),
                  )
                : null;
            const imageSrc = o.image;

            return (
              <Card
                key={o.id}
                imageSrc={imageSrc}
                fullName={fullName}
                birthDate={birthDate ? birthDate.toLocaleDateString() : "N/A"}
                deathDate={deathDate ? deathDate.toLocaleDateString() : "N/A"}
                location={"Nepoznata lokacija"}
                age={age || 0}
                href={o.slug ? `/osmrtnice/${o.slug}` : undefined}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
