"use client";

import type { DragEvent } from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "../lib/cloudinary-client";
import { toCloudinaryAvif } from "@/lib/cloudinary";

export function ImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handlePick(file: File | null) {
    if (!file) return;
    setError(null);
    setIsUploading(true);
    try {
      const res = await uploadToCloudinary(file);
      onChange(toCloudinaryAvif(res.secure_url));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Upload nije uspio.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  }

  function openPicker() {
    inputRef.current?.click();
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handlePick(file);
  }

  return (
    <div className="space-y-2">
      <div
        className={`relative flex h-40 w-40 cursor-pointer items-center justify-center rounded-md border text-sm transition ${
          isDragging ? "border-amber-400 bg-amber-50" : "bg-white"
        }`}
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        aria-label="Upload slike"
      >
        {value ? (
            <div className="relative h-full w-full overflow-hidden rounded-md">
              <Image src={toCloudinaryAvif(value)} alt="preview" fill sizes="160px" className="object-cover" />
            </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>Drag & drop</p>
            <p className="text-xs">ili klikni za upload</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={isUploading}
          className="hidden"
          onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={openPicker}
          disabled={isUploading}
        >
          Odaberi sliku
        </Button>
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
