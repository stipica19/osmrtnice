export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              O nama
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Pružamo platformu za dostojanstveno sjećanje i odavanje počasti
              našim najmilijima.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Brzi linkovi
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <a
                  href="/"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  Osmrtnice
                </a>
              </li>
              <li>
                <a
                  href="/sjecanja"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  Sjećanja
                </a>
              </li>
              <li>
                <a
                  href="/admin/osmrtnice/new"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  Predaj osmrtnicu
                </a>
              </li>
              <li>
                <a
                  href="/sjecanja/new"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition"
                >
                  Podijeli sjećanje
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Kontakt
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li>Email: info@osmrtnice.ba</li>
              <li>Telefon: +387 XX XXX XXX</li>
              <li>Radno vrijeme: 0-24h</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Podrška
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Za sva pitanja i podršku, slobodno nas kontaktirajte. Tu smo da
              pomognemo.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6 text-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            © {new Date().getFullYear()} Osmrtnice. Sva prava pridržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
