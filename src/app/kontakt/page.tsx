"use client";

import { FormEvent, useState } from "react";

export default function KontaktPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        website: "",
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setResult(data?.error || "Doslo je do greske.");
      return;
    }

    setResult("Poruka je uspjesno poslana.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold tracking-tight">Kontakt</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Posaljite nam poruku putem forme ispod.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Ime i prezime
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 w-full rounded-md border px-3 text-sm"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-md border px-3 text-sm"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Naslov</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-10 w-full rounded-md border px-3 text-sm"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Poruka</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[140px] w-full rounded-md border px-3 py-2 text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Slanje..." : "Posalji poruku"}
        </button>

        {result && <p className="text-sm">{result}</p>}
      </form>
    </div>
  );
}
