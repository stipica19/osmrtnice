"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RichEditor } from "@/components/RichEditor";
import { ImageUploader } from "@/components/ImageUploader";

import { PrintableObituaryClassic } from "@/components/PrintableObituaryClassic";
import { useEffect } from "react";
import { createSlug } from "@/lib/slug";

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

  image: z.string(),
});

type Values = z.infer<typeof schema>;

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
    },
  });

  const v = form.watch();

  useEffect(() => {
    const slug = createSlug(v.firstName, v.lastName, v.deathDate);
    if (slug && slug !== v.slug) {
      form.setValue("slug", slug);
    }
  }, [v.firstName, v.lastName, v.deathDate]);

  async function onSubmit(values: Values) {
    const res = await fetch("/api/osmrtnice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    <div className="p-6 max-w-7xl mx-auto space-y-6 ">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-3">
          <span
            className="mt-1 inline-block h-2 w-2 rounded-full bg-amber-400"
            aria-hidden
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-amber-900">
              Predajte oglas na Osmrtnice.hr
            </h2>
            <p className="mt-1 text-sm text-amber-900">
              Predajte oglas brzo i jednostavno koristeći obrazac ispod. Za svu
              pomoć i pitanja nazovite
              <a
                href="tel:+38598430381"
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
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ime</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prezime</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="spol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spol</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="M"
                                checked={field.value === "M"}
                                onChange={() => field.onChange("M")}
                              />
                              <span>Muško</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                value="Z"
                                checked={field.value === "Z"}
                                onChange={() => field.onChange("Z")}
                              />
                              <span>Žensko</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("spol") === "Z" && (
                    <FormField
                      control={form.control}
                      name="djevojackoPrezime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Djevojacko prezime</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Godina rodjenja</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deathDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Datum smrti</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contentJson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pokop ce se obaviti ...</FormLabel>
                      <FormControl>
                        <RichEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Npr: Pokop će se obaviti u petak, 12.11. u 15:00 na mjesnom groblju…"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contentJson1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ožalošćeni</FormLabel>
                      <FormControl>
                        <RichEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Npr: Braća, sestre, djeca i unuci…"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slika</FormLabel>
                      <FormControl>
                        <ImageUploader
                          value={(field.value as string) || null}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Spremi</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:sticky lg:col-span-2 lg:top-6">
          <PrintableObituaryClassic
            templateLeftUrl="/templates/cross.jpg"
            portrait={v.image ? { secureUrl: v.image } : null}
            announcementDate={v.deathDate}
            firstName={v.firstName}
            lastName={v.lastName}
            djevojackoPrezime={v.djevojackoPrezime}
            spol={v.spol}
            birthDate={v.birthDate}
            deathDate={v.deathDate}
            contentJson={v.contentJson}
            contentJson1={v.contentJson1}
            footerText={`${v.spol === "Z" ? "Počivala" : "Počivao"} u miru Božjem!`}
          />
        </div>
      </div>
    </div>
  );
}
