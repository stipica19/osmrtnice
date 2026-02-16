export default function AdBanner() {
  return (
    <div className="w-full border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          {/* Text */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              Mjesto za vašu reklamu
            </h3>
            <p className="max-w-2xl text-sm text-neutral-600 dark:text-neutral-400">
              Za više informacija kontaktirajte nas.
            </p>
          </div>

          {/* CTA Button */}
          <a
            href="mailto:info@osmrtnice.ba"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Kontaktirajte nas
          </a>

          {/* Additional info */}
          <p className="text-xs text-neutral-500 dark:text-neutral-500">
            Telefon: +387 XX XXX XXX | Email: info@osmrtnice.ba
          </p>
        </div>
      </div>
    </div>
  );
}
