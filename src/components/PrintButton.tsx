"use client";

import type { RefObject } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";

type Props = {
  contentRef: RefObject<HTMLElement | null>;
  label?: string;
  documentTitle?: string;
  className?: string;
};

export function PrintButton({
  contentRef,
  label = "Ispiši / PDF",
  documentTitle = "osmrtnica",
  className,
}: Props) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
    preserveAfterPrint: true,
  });

  return (
    <Button type="button" onClick={handlePrint} className={className}>
      {label}
    </Button>
  );
}
