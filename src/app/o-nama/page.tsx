import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "O nama",
  description:
    "Saznajte vise o platformi Osmrtnice Uskoplje i nasoj misiji da sacuvamo uspomene na najmilije.",
};

export default function ONamaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-50 sm:text-4xl">
        O nama
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-7 text-neutral-700 dark:text-neutral-300 sm:text-base">
        <p>
          Osmrtnice Uskoplje je mjesto na kojem zajednica može na dostojanstven
          i miran način podijeliti vijest, odati počast i sačuvati uspomenu na
          one koji više nisu s nama.
        </p>

        <p>
          Nas cilj nije samo objava informacija, nego i stvaranje prostora u
          kojem porodica, prijatelji i komšije mogu pronaći riječi utjehe,
          zahvalnosti i sjećanja. Vjerujemo da svaka osoba zaslužuje da bude
          spomenuta s poštovanjem, toplinom i istinom.
        </p>

        <p>
          Zato smo platformu napravili jednostavnom za korištenje, preglednom i
          prilagođenom svim generacijama. Svaki unos prolazi osnovnu provjeru
          kako bi sadržaj ostao prikladan, tačan i u skladu sa vrijednostima
          zajednice.
        </p>

        <p>
          Hvala vam na povjerenju. Ako imate prijedlog, pitanje ili trebate
          pomoć oko objave, stojimo vam na raspolaganju.
        </p>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-neutral-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-neutral-200">
          Kontakt: info@osmrtnice.ba
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Nazad na početnu
          </Link>
        </div>
      </div>
    </div>
  );
}
