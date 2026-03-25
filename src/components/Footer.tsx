import Link from "next/link";

const FACEBOOK_PAGE_URL =
  process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL || "https://www.facebook.com/";

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-50">
              O nama
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Pružamo platformu za dostojanstveno sjećanje i odavanje počasti
              našim najmilijima.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-50">
              Brzi linkovi
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-amber-600 dark:hover:text-amber-400"
                >
                  Početna (osmrtnice)
                </Link>
              </li>
              <li>
                <Link
                  href="/o-nama"
                  className="transition hover:text-amber-600 dark:hover:text-amber-400"
                >
                  O nama
                </Link>
              </li>
              <li>
                <Link
                  href="/sjecanja"
                  className="transition hover:text-amber-600 dark:hover:text-amber-400"
                >
                  Sjećanja
                </Link>
              </li>
              <li>
                <Link
                  href="/sjecanja/new"
                  className="transition hover:text-amber-600 dark:hover:text-amber-400"
                >
                  Podijeli sjećanje
                </Link>
              </li>
              <li>
                <Link
                  href="/uslovi-koristenja"
                  className="transition hover:text-amber-600 dark:hover:text-amber-400"
                >
                  Uslovi koristenja
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-50">
              Kontakt
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li> <a href="mailto:tiskarahumac@gmail.com" className="text-sm text-neutral-600 dark:text-neutral-400">Email: tiskarahumac@gmail.com</a></li>
              <li><a href="tel:+38763040404" className="text-sm text-neutral-600 dark:text-neutral-400">Telefon: +387 63 040 404</a></li>
              <li>
                <a
                  href={FACEBOOK_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-amber-600 dark:hover:text-amber-400"
                >
                  Facebook stranica Osmrtnice
                </a>
              </li>
             
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-50">
              Podrška
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Za sva pitanja i podršku, slobodno nas kontaktirajte. Tu smo da
              pomognemo.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-200 pt-6 text-center dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            © {new Date().getFullYear()} Osmrtnice Uskoplje. Sva prava pridržana.
          </p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
            Stranicu napravio{" "}
            <a
              href="https://bitelex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline transition hover:text-amber-600 dark:hover:text-amber-400"
            >
              bitelex.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
