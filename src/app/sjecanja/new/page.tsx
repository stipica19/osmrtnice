"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { RichEditor } from "@/components/RichEditor";
import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "@/lib/tiptapExtensions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MAX_WORDS = 100;

const schema = z.object({
  date: z.string().min(1, "Datum je obavezan"),
  personInfo: z.string().min(1, "Podaci za objavu su obavezni"),
  dateRange: z.string().optional(),
  content: z.any(),
  author: z.string().min(1, "Vaši podaci su obavezni"),
  imageUrl: z.string().url("Neispravan URL slike").nullable().optional(),
});

type Values = z.infer<typeof schema>;

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
    },
  });

  const contentJson = form.watch("content") || null;
  const contentHtml = contentJson
    ? generateHTML(contentJson as any, TIPTAP_EXTENSIONS as any)
    : "";
  const wordCount = contentHtml
    ? contentHtml
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;

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
      <h1 className="mb-6 font-serif text-2xl font-bold">Objava sjećanja</h1>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Datum objave */}
          <section className="mb-2">
            <h2 className="text-lg font-semibold">DATUM OBJAVE *</h2>
            <p className="text-sm text-muted-foreground">
              Molimo vas da odaberete željeni datum objave za vaš oglas.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-64">
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Podaci za objavu */}
          <section className="mb-2">
            <h2 className="text-lg font-semibold">PODACI ZA OBJAVU *</h2>
            <p className="text-sm text-muted-foreground">
              Unesite podatke o osobi za koju predajete oglas: ime, prezime i
              datume.
              <br />
              Na primjer: Jurica Jurković, 31.10.1940 - 10.11.2021
            </p>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="personInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="dateRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Raspon datuma (npr. 31.10.1940 - 10.11.2021)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="31.10.1940 - 10.11.2021" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Sadržaj sjećanja */}
          <section className="mb-2">
            <h2 className="text-lg font-semibold">
              SADRŽAJ OBJAVE ZA SJEĆANJE *
            </h2>
            <p className="text-sm text-muted-foreground">
              Upišite tekst Sjećanja. Ako trebate pomoć, pogledajte neke od
              naših primjera.
            </p>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichEditor
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {wordCount}/{MAX_WORDS} riječi
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Vaši podaci */}
          <section className="mb-2">
            <h2 className="text-lg font-semibold">VAŠI PODACI *</h2>
            <p className="text-sm text-muted-foreground">
              Molimo vas upišete vaše ime i adresu. Na primjer: Marko Marković,
              Vukovarska 4, Zagreb.
            </p>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* Slika */}
          <section className="mb-2">
            <h2 className="text-lg font-semibold">SLIKA (opcionalno)</h2>
            <div className="mt-2">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        value={(field.value as string | null) ?? null}
                        onChange={(val) => field.onChange(val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {/* IBAN / Uplata */}
          <section className="mb-4">
            <h2 className="text-lg font-semibold">PODACI ZA UPLATU</h2>
            <div className="mt-2 rounded-xl border bg-white p-4 dark:bg-neutral-900">
              <p className="text-sm">
                Molimo izvršite uplatu na sljedeći IBAN:
              </p>
              <p className="mt-2 text-xl font-bold tracking-wide">
                HR12 3456 7890 1234 5678 9
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Primatelj: Osmrtnice d.o.o.
              </p>
            </div>
          </section>

          {/* PREVIEW */}
          <section className="mb-4">
            <h2 className="text-lg font-semibold">Pregled sjećanja</h2>
            <div className="mt-3 rounded-xl border bg-white p-4 dark:bg-neutral-900">
              <div className="flex items-start gap-4">
                {form.getValues("imageUrl") ? (
                  <img
                    src={form.getValues("imageUrl") as any}
                    alt="slika"
                    className="h-24 w-24 rounded-md border object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-md border flex items-center justify-center text-[10px] text-neutral-500">
                    Bez slike
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap">
                    {form.getValues("personInfo")}
                  </p>
                  <div className="prose max-w-none mt-3">
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  </div>
                  <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">
                    Objavio:{" "}
                    <span className="font-medium">
                      {form.getValues("author") || ""}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Pošalji sjećanje
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={form.formState.isSubmitting}
            >
              Natrag
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
