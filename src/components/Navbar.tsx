"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Osmrtnice" },
  { href: "/sjecanja", label: "Sjećanja" },
  { href: "/admin/osmrtnice/new", label: "Predaj osmrtnicu" },
  { href: "/sjecanja/new", label: "Predaj sjećanje" },
  { href: "/admin/osmrtnice", label: "Admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Osmrtnice
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus:ring-offset-neutral-950"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">{open ? "Zatvori" : "Otvori"} meni</span>
          {/* Animated hamburger/close icon */}
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      <div
        id="mobile-nav"
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-neutral-200 bg-white px-4 pb-4 pt-2 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
