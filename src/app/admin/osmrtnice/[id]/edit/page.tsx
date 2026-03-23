"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { JSONContent } from "@tiptap/core";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintableObituaryClassic } from "@/components/PrintableObituaryClassic";
import { ObituaryForm } from "@/components/ObituaryForm";

import { createSlug } from "@/lib/slug";
import { useDebouncedValue } from "@/lib/hooks";
import {
  DEFAULT_OBITUARY_SETTINGS,
  mapObituaryFormToPreview,
  type ObituaryFormValues,
  type ObituaryPreviewSettings,
} from "@/lib/obituary";

const schema = z.object({
  firstName: z.string().min(1, "Obavezno"),
  lastName: z.string().min(1, "Obavezno"),
  djevojackoPrezime: z.string().optional(),
  spol: z.enum(["M", "Z"]).optional(),
  birthDate: z.string().optional(),
  deathDate: z.string().optional(),

  slug: z.string().min(1),

  status: z.enum(["published", "draft"]),
  publishedAt: z.string().optional(),

  contentJson: z.any(),
  contentJson1: z.any(),

  image: z.string().optional(),
  settings: z.object({
    fontFamily: z.enum(["serif", "sans", "classic"]),
    contentSize: z.enum(["sm", "md", "lg"]),
    familySize: z.enum(["sm", "md", "lg"]),
    imageFit: z.enum(["cover", "contain"]),
  }),
});

type Values = ObituaryFormValues;

type ObituaryApiItem = {
  id: string;
  firstName: string;
  lastName: string;
  djevojackoPrezime?: string | null;
  spol?: "M" | "Z" | null;
  birthDate?: string | null;
  deathDate?: string | null;
  slug: string;
  status: "published" | "draft";
  publishedAt?: string | null;
  contentJson: unknown;
  contentJson1: unknown;
  image?: string | null;
};

function toDateInput(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function asJsonContent(value: unknown): JSONContent | null {
  return value && typeof value === "object" ? (value as JSONContent) : null;
}

export default function EditObituaryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const obituaryId = params.id;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      djevojackoPrezime: "",
      spol: "M",
      birthDate: "",
      deathDate: "",
      slug: "",
      status: "draft",
      publishedAt: "",
      contentJson: { type: "doc", content: [{ type: "paragraph" }] },
      contentJson1: { type: "doc", content: [{ type: "paragraph" }] },
      image: "",
      settings: DEFAULT_OBITUARY_SETTINGS,
    },
  });

  const { data, isLoading, error } = useQuery<ObituaryApiItem>({
    queryKey: ["admin", "osmrtnica", obituaryId],
    enabled: Boolean(obituaryId),
    queryFn: async () => {
      const res = await fetch(`/api/osmrtnice/${obituaryId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      djevojackoPrezime: data.djevojackoPrezime ?? "",
      spol: data.spol ?? "M",
      birthDate: toDateInput(data.birthDate),
      deathDate: toDateInput(data.deathDate),
      slug: data.slug ?? "",
      status: data.status ?? "draft",
      publishedAt: data.publishedAt ? toDateInput(data.publishedAt) : "",
      contentJson: asJsonContent(data.contentJson),
      contentJson1: asJsonContent(data.contentJson1),
      image: data.image ?? "",
      settings: DEFAULT_OBITUARY_SETTINGS,
    });
  }, [data, form]);

  const firstName = useWatch({ control: form.control, name: "firstName" });
  const lastName = useWatch({ control: form.control, name: "lastName" });
  const deathDate = useWatch({ control: form.control, name: "deathDate" });
  const watched = useWatch({ control: form.control });
  const debounced = useDebouncedValue(watched, 150);

  const previewValues = useMemo<ObituaryFormValues>(
    () => {
      const normalizedSettings: ObituaryPreviewSettings = {
        fontFamily:
          debounced.settings?.fontFamily ?? DEFAULT_OBITUARY_SETTINGS.fontFamily,
        contentSize:
          debounced.settings?.contentSize ?? DEFAULT_OBITUARY_SETTINGS.contentSize,
        familySize:
          debounced.settings?.familySize ?? DEFAULT_OBITUARY_SETTINGS.familySize,
        imageFit:
          debounced.settings?.imageFit ?? DEFAULT_OBITUARY_SETTINGS.imageFit,
      };

      return {
        firstName: debounced.firstName ?? "",
        lastName: debounced.lastName ?? "",
        djevojackoPrezime: debounced.djevojackoPrezime ?? "",
        spol: debounced.spol,
        birthDate: debounced.birthDate ?? "",
        deathDate: debounced.deathDate ?? "",
        slug: debounced.slug ?? "",
        status: debounced.status ?? "draft",
        publishedAt: debounced.publishedAt ?? "",
        contentJson: asJsonContent(debounced.contentJson),
        contentJson1: asJsonContent(debounced.contentJson1),
        image: debounced.image ?? "",
        settings: normalizedSettings,
      };
    },
    [debounced],
  );

  const previewModel = useMemo(
    () => {
      const mapped = mapObituaryFormToPreview(previewValues);
      return {
        ...mapped,
        contentJson: mapped.contentJson ?? undefined,
        contentJson1: mapped.contentJson1 ?? undefined,
      };
    },
    [previewValues],
  );

  useEffect(() => {
    const slug = createSlug(firstName, lastName, deathDate);
    if (slug && slug !== form.getValues("slug")) {
      form.setValue("slug", slug);
    }
  }, [firstName, lastName, deathDate, form]);

  async function onSubmit(values: Values) {
    const res = await fetch(`/api/osmrtnice/${obituaryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const txt = await res.text();
      alert(`Greška: ${txt}`);
      return;
    }

    alert("Izmjene su spremljene.");
    router.push("/admin/osmrtnice");
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <span
            className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-400"
            aria-hidden
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-amber-900 dark:text-amber-100">
              Uređivanje osmrtnice
            </h2>
            <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
              Izmijenite podatke i spremite. Pregled osmrtnice se prikazuje u
              realnom vremenu.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Uredi osmrtnicu</CardTitle>
          </CardHeader>
          <CardContent>
            <ObituaryForm form={form} onSubmit={onSubmit} />
          </CardContent>
        </Card>

        <div className="lg:sticky lg:col-span-2 lg:top-6">
          <PrintableObituaryClassic {...previewModel} />
        </div>
      </div>
    </div>
  );
}
