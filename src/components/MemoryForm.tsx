"use client";

import type { UseFormReturn } from "react-hook-form";
import { generateHTML } from "@tiptap/html";
import { TIPTAP_EXTENSIONS } from "@/lib/tiptapExtensions";
import { useDebouncedValue } from "@/lib/hooks";
import type { MemoryFormValues } from "@/lib/memory";
import { UI_TEXT } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { RichEditor } from "@/components/RichEditor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MAX_WORDS = 100;

export function MemoryForm({
  form,
  onSubmit,
  onBack,
}: {
  form: UseFormReturn<MemoryFormValues>;
  onSubmit: (values: MemoryFormValues) => void;
  onBack: () => void;
}) {
  const watched = form.watch();
  const debounced = useDebouncedValue(watched, 200);
  const contentJson = debounced.content || null;
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

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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

        <section className="mb-2">
          <h2 className="text-lg font-semibold">PODACI ZA OBJAVU *</h2>
          <p className="text-sm text-muted-foreground">
            Unesite podatke o osobi za koju predajete oglas: ime, prezime i
            datume.
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

        <section className="mb-2">
          <h2 className="text-lg font-semibold">
            SADRŽAJ OBJAVE ZA SJEĆANJE *
          </h2>
          <p className="text-sm text-muted-foreground">
            Upišite tekst sjećanja. Ako trebate pomoć, pogledajte neke od
            primjera.
          </p>
          <div className="mt-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichEditor value={field.value} onChange={field.onChange} />
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

        <section className="mb-2">
          <h2 className="text-lg font-semibold">VAŠI PODACI *</h2>
          <p className="text-sm text-muted-foreground">
            Molimo vas upišite vaše ime i adresu. Na primjer: Marko Marković,
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

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem className="hidden" aria-hidden>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                />
              </FormControl>
            </FormItem>
          )}
        />

        <section className="mb-4">
          <h2 className="text-lg font-semibold">PODACI ZA UPLATU</h2>
          <div className="mt-2 rounded-xl border bg-white p-4 dark:bg-neutral-900">
            <p className="text-sm">Molimo izvršiti uplatu na sljedeći IBAN:</p>
            <p className="mt-2 text-xl font-bold tracking-wide">
              HR12 3456 7890 1234 5678 9
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Primatelj: Osmrtnice d.o.o.
            </p>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {UI_TEXT.memories.submit}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={form.formState.isSubmitting}
          >
            {UI_TEXT.memories.back}
          </Button>
        </div>
      </form>
    </Form>
  );
}
