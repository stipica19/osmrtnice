"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function AdminGuard({ children }: Props) {
  return <>{children}</>;
}
