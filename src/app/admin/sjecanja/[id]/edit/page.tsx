"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { generateHTML, generateJSON } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";

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

type MemoryApiItem = {
  id: string;
  publishDate?: string | null;
  status: "published" | "draft";
  publishedAt?: string | null;
  personInfo: string;
  dateRange?: string | null;
  content: unknown;
  authorName: string;
  imageUrl?: string | null;
};

function toDateInput(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function contentToJson(value: unknown): JSONContent {
  if (value && typeof value === "object") {
    return value as JSONContent;
  }

  if (typeof value === "string" && value.trim()) {
    try {
      return generateJSON(value, [...TIPTAP_EXTENSIONS]);
    } catch {
      return {
        type: "doc",
        content: [{ type: "paragraph", content: [{ type: "text", text: value }] }],
      };
    }
  }

  return { type: "doc", content: [{ type: "paragraph" }] };
}

export default function EditMemoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const memoryId = params.id;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      date: "",
      personInfo: "",
      dateRange: "",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      author: "",
      imageUrl: null,
      website: "",
    },
  });

  const { data, isLoading, error } = useQuery<MemoryApiItem>({
    queryKey: ["admin", "sjecanje", memoryId],
    enabled: Boolean(memoryId),
    queryFn: async () => {
      const res = await fetch(`/api/sjecanja/${memoryId}`, { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      date: toDateInput(data.publishDate),
      personInfo: data.personInfo ?? "",
      dateRange: data.dateRange ?? "",
      content: contentToJson(data.content),
      author: data.authorName ?? "",
      imageUrl: data.imageUrl ?? null,
      website: "",
    });
  }, [data, form]);

  async function onSubmit(values: Values) {
    if (!data) return;

    try {
      const contentHtmlLocal = values.content
        ? generateHTML(values.content as JSONContent, [...TIPTAP_EXTENSIONS])
        : "";

      const res = await fetch(`/api/sjecanja/${memoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: values.date,
          personInfo: values.personInfo,
          dateRange: values.dateRange ?? null,
          content: contentHtmlLocal,
          author: values.author,
          imageUrl: values.imageUrl ?? null,
          status: data.status,
          publishedAt: data.publishedAt,
          website: values.website ?? "",
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(`Greška: ${msg}`);
        return;
      }

      alert("Izmjene su spremljene.");
      router.push("/admin/sjecanja");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Neuspješno spremanje.";
      alert(message);
    }
  }

  if (isLoading) {
    return <div className="p-6">Učitavanje...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Greška: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight">
          Uređivanje sjećanja
        </h1>
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-4 dark:bg-amber-950/20 dark:border-amber-900/30">
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Ovdje možete ažurirati postojeće sjećanje. Nakon spremanja izmjene
            će biti vidljive na listi.
          </p>
        </div>
      </div>

      <MemoryForm
        form={form}
        onSubmit={onSubmit}
        onBack={() => router.push("/admin/sjecanja")}
      />
    </div>
  );
}
