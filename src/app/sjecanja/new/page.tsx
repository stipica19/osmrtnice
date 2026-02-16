"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "@/lib/tiptapExtensions";
import { MemoryForm } from "@/components/MemoryForm";
import type { MemoryFormValues } from "@/lib/memory";

const schema = z.object({
  date: z.string().min(1, "Datum je obavezan"),
  personInfo: z.string().min(1, "Podaci za objavu su obavezni"),
  dateRange: z.string().optional(),
  content: z.any(),
  author: z.string().min(1, "Vaši podaci su obavezni"),
  imageUrl: z.string().url("Neispravan URL slike").nullable().optional(),
  website: z.string().optional(),
});

type Values = MemoryFormValues;

export default function NewMemoryPage() {
  const router = useRouter();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      date: "",
      personInfo: "",
      dateRange: "",
      content: "",
      author: "",
      imageUrl: null,
      website: "",
    },
  });

  async function onSubmit(values: Values) {
    try {
      const contentHtmlLocal = values.content
        ? generateHTML(values.content as any, TIPTAP_EXTENSIONS as any)
        : "";
      const res = await fetch("/api/sjecanja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: values.date,
          personInfo: values.personInfo,
          dateRange: values.dateRange ?? null,
          content: contentHtmlLocal,
          author: values.author,
          imageUrl: values.imageUrl ?? null,
          website: values.website ?? "",
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(`Greška: ${msg}`);
        return;
      }

      alert("Hvala! Vaše sjećanje je zabilježeno.");
      router.push("/sjecanja");
    } catch (e: any) {
      alert(e?.message ?? "Neuspješno slanje.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Objava sjećanja
        </h1>
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 dark:bg-amber-950/20 dark:border-amber-900/30">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Podijelite Vaše sjećanje na osobu koja je obilježila Vaš život. Ova
            stranica je mjesto gdje možete izraziti ljubav, zahvalnost i
            poštovanje.
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            <strong>Upute:</strong> Ispunite formu sa Vašim sjećanjem. Možete
            dodati fotografiju, napisati poruku, unijeti datume i Vaše podatke.
            Sjećanje će biti pregledano prije objavljivanja.
          </p>
        </div>
      </div>
      <MemoryForm
        form={form}
        onSubmit={onSubmit}
        onBack={() => router.back()}
      />
    </div>
  );
}
