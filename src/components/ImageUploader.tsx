"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "../lib/cloudinary-client";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePick(file: File | null) {
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const res = await uploadToCloudinary(file);
      onChange(res.secure_url);
    } catch (e: any) {
      setError(e?.message ?? "Upload nije uspio.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <img
          src={value}
          alt="preview"
          className="h-40 w-40 rounded-md border object-cover"
        />
      ) : (
        <div className="h-40 w-40 rounded-md border flex items-center justify-center text-sm text-muted-foreground">
          Nema slike
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
        />
        {value && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => onChange(null)}
            disabled={isUploading}
          >
            Ukloni
          </Button>
        )}
      </div>

      {isUploading && (
        <p className="text-sm text-muted-foreground">Uploadam...</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
