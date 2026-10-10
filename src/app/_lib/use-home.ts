"use client";
import { useStore } from "@/lib/state/store-context";

export function useHome() {
  const { state } = useStore();
  const featured = state.products
    .filter((p) => p.active && p.featured)
    .slice(0, 4);

  return { featured };
}
