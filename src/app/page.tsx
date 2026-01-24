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
  console.log("Nizz", obituaries);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="max-w-max grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 justify-center items-center">
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
