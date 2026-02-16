"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintableObituaryClassic } from "@/components/PrintableObituaryClassic";
import { AdminGuard } from "@/components/AdminGuard";
import { ObituaryForm } from "@/components/ObituaryForm";

import { createSlug } from "@/lib/slug";
import { useDebouncedValue } from "@/lib/hooks";
import {
  DEFAULT_OBITUARY_SETTINGS,
  mapObituaryFormToPreview,
  type ObituaryFormValues,
} from "@/lib/obituary";
import { ADMIN_HEADER, getAdminKeyFromStorage } from "@/lib/admin";

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

export default function Page() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      djevojackoPrezime: "",
      spol: "M",
      birthDate: "",
      deathDate: "",
      status: "published",
      contentJson: { type: "doc", content: [{ type: "paragraph" }] },
      contentJson1: { type: "doc", content: [{ type: "paragraph" }] },
      image: "",
      settings: DEFAULT_OBITUARY_SETTINGS,
    },
  });

  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const deathDate = form.watch("deathDate");
  const watched = form.watch();
  const debounced = useDebouncedValue(watched, 150);
  const previewModel = useMemo(
    () => mapObituaryFormToPreview(debounced),
    [debounced],
  );

  useEffect(() => {
    const slug = createSlug(firstName, lastName, deathDate);
    if (slug && slug !== form.getValues("slug")) {
      form.setValue("slug", slug);
    }
  }, [firstName, lastName, deathDate, form]);

  async function onSubmit(values: Values) {
    const adminKey = getAdminKeyFromStorage();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (adminKey) headers[ADMIN_HEADER] = adminKey;

    const res = await fetch("/api/osmrtnice", {
      method: "POST",
      headers,
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const txt = await res.text();
      alert(`Greška: ${txt}`);
      return;
    }

    alert("Spremljeno!");
    form.reset();
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
              Kreiranje nove osmrtnice
            </h2>
            <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
              Pažljivo popunite obrazac sa svim potrebnim podacima. Pregled
              osmrtnice će se prikazati u realnom vremenu na desnoj strani. Za
              pomoć i pitanja nazovite
              <a
                href="tel:+38763063111"
                className="ml-1 font-semibold underline"
              >
                063063111
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Nova osmrtnica</CardTitle>
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
