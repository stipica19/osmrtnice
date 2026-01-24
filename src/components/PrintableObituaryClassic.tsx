"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { ObituaryPreviewClassic } from "./ObituaryPreviewClassic";

type UploadedImage = {
  secureUrl: string;
};

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
}) {
  const printRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${firstName ?? "Ime"} ${lastName ?? "Prezime"} - osmrtnica`,
    preserveAfterPrint: true,
  });

  // Auto-scale content to ensure it fits exactly one A4 landscape page
  useEffect(() => {
    const pageEl = printRef.current;
    const innerEl = contentRef.current;
    if (!pageEl || !innerEl) return;

    // Reset scale to measure natural size
    innerEl.style.transform = "";
    innerEl.style.width = "";

    const pageHeight = pageEl.getBoundingClientRect().height; // target height
    const contentHeight = innerEl.scrollHeight; // natural content height

    if (contentHeight === 0 || pageHeight === 0) {
      setScale(1);
      return;
    }

    const nextScale = Math.min(1, pageHeight / contentHeight);
    setScale(nextScale);

    // Apply transform via inline style
    // width is expanded inversely so that scaled width equals container width
    innerEl.style.transformOrigin = "top left";
    innerEl.style.transform = `scale(${nextScale})`;
    innerEl.style.width = nextScale < 1 ? `${(1 / nextScale) * 100}%` : "";
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
  ]);

  return (
    <div className="mx-auto print-container preview-a4-landscape">
      {/* Kontrole koje se ne printaju */}

      {/* Sadržaj koji se printa */}
      <div ref={printRef} className="preview-page">
        <div ref={contentRef}>
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
          />
        </div>
      </div>
      <div className="no-print mt-4 flex items-center gap-2">
        <Button onClick={handlePrint}>Ispiši / PDF</Button>
      </div>
    </div>
  );
}
