import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uslovi koristenja",
  description: "Uslovi koristenja platforme Osmrtnice Uskoplje.",
};

export default function UsloviKoristenjaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-50 sm:text-4xl">
        Uslovi koristenja
      </h1>

      <div className="mt-8 space-y-8 text-sm leading-7 text-neutral-700 dark:text-neutral-300 sm:text-base">
        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            1. Opste odredbe
          </h2>
          <p className="mt-2">
            Koristenjem ove web stranice prihvatate ove uslove koristenja. Ako
            se ne slazete sa uslovima, molimo vas da ne koristite stranicu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. Sadrzaj i odgovornost korisnika
          </h2>
          <p className="mt-2">
            Korisnik je odgovoran za tacnost i zakonitost podataka koje objavljuje.
            Zabranjeno je objavljivanje uvredljivog, neistinitog ili nezakonitog
            sadrzaja.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. Prava intelektualne svojine
          </h2>
          <p className="mt-2">
            Tekstovi, fotografije i drugi materijali mogu biti zasticeni autorskim
            pravima. Objavom korisnik potvrdjuje da ima pravo na koristenje i
            objavu datog sadrzaja.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            4. Ogranicenje odgovornosti
          </h2>
          <p className="mt-2">
            Administrator zadrzava pravo izmjene ili uklanjanja sadrzaja koji
            nije u skladu sa pravilima, bez prethodne najave. Stranica se
            pruza &quot;kakva jeste&quot;, bez garancije neprekidnog rada.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            5. Izmjene uslova
          </h2>
          <p className="mt-2">
            Zadrzavamo pravo izmjene ovih uslova u bilo kojem trenutku.
            Nastavkom koristenja stranice nakon izmjena smatra se da ih
            prihvatate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            6. Kontakt
          </h2>
          <p className="mt-2">
            Za pitanja vezana za uslove koristenja mozete nas kontaktirati na
            email adresu info@osmrtnice.ba.
          </p>
        </section>
      </div>
    </div>
  );
}
