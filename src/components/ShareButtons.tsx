"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Share2 } from "lucide-react";

type Props = {
  title?: string; // opcionalno: za WA tekst
};

export default function ShareButtons({ title }: Props) {
  function getCurrentUrl() {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }

  function isMobileDevice() {
    if (typeof navigator === "undefined") return false;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const url = getCurrentUrl();
          if (!url) return;
          const quote = title ? `&quote=${encodeURIComponent(title)}` : "";
          const base = isMobileDevice()
            ? "https://m.facebook.com/sharer/sharer.php"
            : "https://www.facebook.com/sharer/sharer.php";
          const fbShareUrl = `${base}?u=${encodeURIComponent(url)}${quote}`;

          if (isMobileDevice()) {
            window.location.href = fbShareUrl;
            return;
          }

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
          const url = getCurrentUrl();
          if (!url) return;
          const waText = title ? `${title}\n${url}` : url;
          const waShareUrl = `https://wa.me/?text=${encodeURIComponent(waText)}`;
          window.open(waShareUrl, "_blank", "noopener,noreferrer");
        }}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Podijeli na WhatsApp
      </Button>
    </div>
  );
}
