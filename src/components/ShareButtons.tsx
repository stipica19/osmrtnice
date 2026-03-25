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

  async function shareOnFacebook() {
    const url = getCurrentUrl();
    if (!url) return;

    const quote = title ? `&quote=${encodeURIComponent(title)}` : "";
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}${quote}`;

    if (isMobileDevice()) {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isAndroid = /Android/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);

      if (isAndroid) {
        const intentUrl = `intent://facewebmodal/f?href=${encodeURIComponent(fbShareUrl)}#Intent;scheme=fb;package=com.facebook.katana;end`;
        window.location.href = intentUrl;
        setTimeout(() => {
          window.location.href = fbShareUrl;
        }, 900);
        return;
      }

      if (isIOS) {
        const iosDeepLink = `fb://facewebmodal/f?href=${encodeURIComponent(fbShareUrl)}`;
        window.location.href = iosDeepLink;
        setTimeout(() => {
          window.location.href = fbShareUrl;
        }, 900);
        return;
      }

      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: title || "Osmrtnice",
            text: title || "Pogledaj objavu",
            url,
          });
          return;
        } catch {
          // User cancelled or sharing failed; continue with fallback below.
        }
      }

      window.location.href = fbShareUrl;
      return;
    }

    window.open(fbShareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          void shareOnFacebook();
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
