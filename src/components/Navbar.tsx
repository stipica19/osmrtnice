"use client";

import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const NavLinks = (
    <nav className="flex flex-col gap-3 md:flex-row md:gap-6">
      <a
        href="/"
        className="text-gray-600 text-base md:text-lg font-medium uppercase hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        onClick={() => setOpen(false)}
      >
        Osmrtnice
      </a>
      <a
        href="/sjecanja"
        className="text-gray-600 text-base md:text-lg font-medium uppercase hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        onClick={() => setOpen(false)}
      >
        Sjećanja
      </a>
      <a
        href="/admin/osmrtnice/new"
        className="text-gray-600 text-base md:text-lg font-medium uppercase hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        onClick={() => setOpen(false)}
      >
        Predaj osmrtnicu
      </a>
      <a
        href="/sjecanja/new"
        className="text-gray-600 text-base md:text-lg font-medium uppercase hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        onClick={() => setOpen(false)}
      >
        Predaj sjećanje
      </a>
      <a
        href="/admin/osmrtnice"
        className="text-gray-600 text-base md:text-lg font-medium uppercase hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        onClick={() => setOpen(false)}
      >
        Admin
      </a>
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur dark:bg-black/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded bg-amber-500" />
          <span className="font-serif text-lg font-semibold">Osmrtnice</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:block">{NavLinks}</div>

        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-neutral-800"
          onClick={() => setOpen((v) => !v)}
        >
          {/* Simple hamburger */}
          <span className="sr-only">Menu</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      <div
        id="mobile-nav"
        className={`${open ? "block" : "hidden"} md:hidden border-t bg-white/95 px-4 py-3 backdrop-blur dark:bg-black/80`}
      >
        {NavLinks}
      </div>
    </header>
  );
}
