import React, { useLayoutEffect, useRef } from "react";
import { ObituaryPreviewClassic } from "./ObituaryPreviewClassic";
import { PrintButton } from "@/components/PrintButton";
import type { ObituaryPreviewSettings } from "@/lib/obituary";

type UploadedImage = { secureUrl: string };

export function PrintableObituaryClassic({
  templateLeftUrl = "/templates/cross.jpg",
  portrait,
  announcementDate,
  firstName,
  lastName,
  djevojackoPrezime,
  spol,
  birthDate,
  deathDate,
  funeralDate,
  funeralTime,
  cemetery,
  familyText,
  contentJson,
  contentJson1,
  footerText = "Počivala u miru Božjem!",
  settings,
}: {
  templateLeftUrl?: string;
  portrait?: UploadedImage | null;
  announcementDate?: string;
  firstName?: string;
  djevojackoPrezime?: string;
  spol?: "M" | "Z";
  lastName?: string;
  birthDate?: string;
  deathDate?: string;
  funeralDate?: string;
  funeralTime?: string;
  cemetery?: string;
  familyText?: string;
  contentJson?: any;
  contentJson1?: any;
  footerText?: string;
  settings?: ObituaryPreviewSettings;
}) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const applyScale = () => {
    const pageEl = printRef.current;
    const innerEl = innerRef.current;
    if (!pageEl || !innerEl) return;

    // reset
    innerEl.style.transform = "none";
    innerEl.style.width = "auto";
    innerEl.style.height = "auto";

    const pageW = pageEl.clientWidth;
    const pageH = pageEl.clientHeight;

    // prirodna veličina sadržaja (bez skale)
    const contentW = innerEl.scrollWidth;
    const contentH = innerEl.scrollHeight;

    if (!pageW || !pageH || !contentW || !contentH) return;

    const nextScale = Math.min(1, pageW / contentW, pageH / contentH);
    innerEl.style.transformOrigin = "top left";
    innerEl.style.transform = `scale(${nextScale})`;

    // proširi “virtualnu” širinu/visinu da nakon skale bude tačno kao container
    if (nextScale < 1) {
      innerEl.style.width = `${(1 / nextScale) * 100}%`;
      innerEl.style.height = `${(1 / nextScale) * 100}%`;
    }
  };

  // useLayoutEffect da ne “treperi” mjerenje + radi nakon layouta
  useLayoutEffect(() => {
    applyScale();

    // opcionalno: reaguj kad se promijeni veličina (npr. fontovi, slike)
    const ro = new ResizeObserver(() => applyScale());
    if (printRef.current) ro.observe(printRef.current);
    if (innerRef.current) ro.observe(innerRef.current);

    // slušaj i promjene prozora (promjena širine pregleda)
    const onResize = () => applyScale();
    window.addEventListener("resize", onResize);

    // promjene u DOM-u (unos teksta, ubacivanje slika)
    const mo = new MutationObserver(() => applyScale());
    if (innerRef.current) {
      mo.observe(innerRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    // ponovna skala kad se slike učitaju
    const imgs: HTMLImageElement[] = Array.from(
      innerRef.current?.querySelectorAll("img") ?? [],
    );
    imgs.forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", applyScale, { once: true });
      }
    });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstName,
    lastName,
    djevojackoPrezime,
    spol,
    birthDate,
    deathDate,
    funeralDate,
    funeralTime,
    cemetery,
    familyText,
    contentJson,
    contentJson1,
    templateLeftUrl,
    footerText,
    portrait?.secureUrl,
    announcementDate,
    settings?.fontFamily,
    settings?.contentSize,
    settings?.familySize,
    settings?.imageFit,
  ]);

  return (
    <div className="mx-auto print-container preview-a4-landscape">
      <div ref={printRef} className="preview-page">
        <div ref={innerRef} className="h-full w-full print-scale-target">
          <div className="h-full w-full">
            <ObituaryPreviewClassic
              templateLeftUrl={templateLeftUrl}
              portrait={portrait}
              announcementDate={announcementDate}
              firstName={firstName}
              lastName={lastName}
              djevojackoPrezime={djevojackoPrezime}
              spol={spol}
              birthDate={birthDate}
              deathDate={deathDate}
              funeralDate={funeralDate}
              funeralTime={funeralTime}
              cemetery={cemetery}
              familyText={familyText}
              contentJson={contentJson}
              contentJson1={contentJson1}
              footerText={footerText}
              settings={settings}
            />
          </div>
        </div>{" "}
      </div>

      <div className="no-print mt-4 flex items-center gap-2">
        <PrintButton
          contentRef={printRef}
          documentTitle={`${firstName ?? "Ime"} ${lastName ?? "Prezime"} - osmrtnica`}
        />
      </div>
    </div>
  );
}
