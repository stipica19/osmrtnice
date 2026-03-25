"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

type Props = {
  measurementId?: string;
};

export default function GoogleAnalytics({ measurementId }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || !window.gtag) return;

    window.gtag("config", measurementId, {
      page_path: pathname,
    });
  }, [measurementId, pathname]);

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
