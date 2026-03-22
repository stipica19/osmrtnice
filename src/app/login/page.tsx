"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/osmrtnice";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Neispravno korisnicko ime ili lozinka.");
      return;
    }

    router.push(result.url || callbackUrl);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4">
      <div className="w-full rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">Admin Login</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Prijavi se za pristup administraciji.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Korisnicko ime
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-neutral-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-neutral-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Prijava..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}
