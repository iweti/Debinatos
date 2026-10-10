"use client";
import type { ReactNode } from "react";
import { StoreProvider } from "@/components/providers/StoreProvider";

export function Providers({ children }: { children: ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
