"use client";

import type { UseFormReturn } from "react-hook-form";
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
import { UI_TEXT } from "@/lib/i18n";
import type { ObituaryFormValues } from "@/lib/obituary";

const SIZE_OPTIONS = [
  { value: "sm", label: "A-" },
  { value: "md", label: "A" },
  { value: "lg", label: "A+" },
] as const;

export function ObituaryForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<ObituaryFormValues>;
  onSubmit: (values: ObituaryFormValues) => void;
}) {
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <FormLabel>Djevojačko prezime</FormLabel>
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
                <FormLabel>Godina rođenja</FormLabel>
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
              <FormLabel>Pokop će se obaviti ...</FormLabel>
              <FormControl>
                <RichEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Npr: Pokop će se obaviti u petak, 12.11. u 15:00 na mjesnom groblju..."
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
                  placeholder="Npr: Braca, sestre, djeca i unuci..."
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
        {/* 
        <div className="rounded-xl border bg-muted/30 p-4">
          <h3 className="text-sm font-semibold">
            {UI_TEXT.obituary.previewSettings}
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="settings.fontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{UI_TEXT.obituary.fontFamily}</FormLabel>
                  <FormControl>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="serif">Serif</option>
                      <option value="classic">Klasični</option>
                      <option value="sans">Sans</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings.imageFit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{UI_TEXT.obituary.imageFit}</FormLabel>
                  <FormControl>
                    <select
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="settings.contentSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{UI_TEXT.obituary.contentSize}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {SIZE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`h-9 flex-1 rounded-md border text-sm font-medium ${
                            field.value === opt.value
                              ? "border-amber-400 bg-amber-50"
                              : "border-input"
                          }`}
                          onClick={() => field.onChange(opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="settings.familySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{UI_TEXT.obituary.familySize}</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {SIZE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`h-9 flex-1 rounded-md border text-sm font-medium ${
                            field.value === opt.value
                              ? "border-amber-400 bg-amber-50"
                              : "border-input"
                          }`}
                          onClick={() => field.onChange(opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div> */}

        <Button type="submit">{UI_TEXT.obituary.submit}</Button>
      </form>
    </Form>
  );
}
