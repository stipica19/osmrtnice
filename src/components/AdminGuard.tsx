"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminKeyFromStorage, setAdminKeyInStorage } from "@/lib/admin";
import { UI_TEXT } from "@/lib/i18n";

type Props = {
  children: ReactNode;
};

export function AdminGuard({ children }: Props) {
  const initialKey = useMemo(() => getAdminKeyFromStorage() ?? "", []);
  const [key, setKey] = useState(initialKey);
  const [saved, setSaved] = useState(Boolean(initialKey));

  function save() {
    setAdminKeyInStorage(key.trim());
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <h2 className="font-serif text-lg font-semibold text-amber-900">
          {UI_TEXT.admin.guardTitle}
        </h2>
        <p className="mt-1 text-sm text-amber-900">{UI_TEXT.admin.guardHelp}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin kljuc"
            className="max-w-xs"
          />
          <Button type="button" variant="secondary" onClick={save}>
            {UI_TEXT.admin.guardSave}
          </Button>
          {saved && (
            <span className="text-xs text-amber-800">Kljuc spremljen.</span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
