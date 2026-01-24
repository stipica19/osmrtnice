"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Share2 } from "lucide-react";

type Props = {
  title?: string; // opcionalno: za WA tekst
};

export default function ShareButtons({ title }: Props) {
  const url = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const waText = title ? `${title}\n${url}` : url;

  const fbShareUrl = url
    ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    : "#";

  const waShareUrl = url
    ? `https://wa.me/?text=${encodeURIComponent(waText)}`
    : "#";

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          if (!url) return;
          window.open(fbShareUrl, "_blank", "noopener,noreferrer");
        }}
      >
        <Facebook className="mr-2 h-4 w-4" />
        Podijeli na Facebook
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => {
          if (!url) return;
          window.open(waShareUrl, "_blank", "noopener,noreferrer");
        }}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Podijeli na WhatsApp
      </Button>
    </div>
  );
}
