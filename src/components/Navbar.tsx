"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {signOut} from "next-auth/react";
import Image from "next/image";
import { Facebook } from "lucide-react";
import styles from "./Navbar.module.css";

const FACEBOOK_PAGE_URL =
  process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL || "https://www.facebook.com/OsmtrniceUskoplje";

const baseNavItems = [
  { href: "/", label: "Osmrtnice" },
  { href: "/sjecanja", label: "Sjećanja" },
  { href: "/sjecanja/new", label: "Predaj sjećanje" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { status } = useSession();

  const navItems =
    status === "authenticated"
      ? [...baseNavItems, { href: "/admin/osmrtnice", label: "Admin" }]
      : baseNavItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className={styles.logoLink}
        >
          <div className={styles.logoFrame}>
            <Image
              src="/osmrtnicelogo_2.svg"
              alt="Osmrtnice Uskoplje"
              fill
              priority
              sizes="(max-width: 640px) 80px, 96px"
              className={styles.logoImage}
            />
          </div>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.href === "/sjecanja/new"
                  ? styles.submitMemoryDesktop
                  : "rounded-md px-3 py-2 text-md font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
              }
            >
              {item.label}
            </Link>
          ))}
          <a
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook stranica"
            className={styles.fbLinkDesktop}
          >
            <span className={styles.fbIconBox}>
              <Facebook className="h-4 w-4" />
            </span>
            <span className="sr-only">Facebook</span>
          </a>
          {status === "authenticated" && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                void signOut({ callbackUrl: "/" });
              }}
              className="mt-2 block w-full rounded-md px-3 py-2.5 text-left text-base font-medium text-red-700 transition-colors hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              Odjava
            </button>
          )}
        </nav>

        <button
          type="button"
          aria-label={open ? "Zatvori meni" : "Otvori meni"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus:ring-offset-neutral-950"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="sr-only">{open ? "Zatvori" : "Otvori"} meni</span>
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

      <div
        id="mobile-nav"
        className={"overflow-hidden transition-all duration-300 ease-in-out md:hidden " + (open ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}
      >
        <nav className="border-t border-neutral-200 bg-white px-4 pb-4 pt-2 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  item.href === "/sjecanja/new"
                    ? styles.submitMemoryMobile
                    : "block rounded-md px-3 py-2.5 text-lg font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
                }
              >
                {item.label}
              </Link>
            ))}
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook stranica"
              className={styles.fbLinkMobile}
            >
              <span className={styles.fbIconBox}>
                <Facebook className="h-4 w-4" />
              </span>
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
