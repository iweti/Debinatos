"use client";
import { useStore } from "../state/store-context";

export function useProductCard(id: string) {
  const { state, favorite, add } = useStore();
  const saved = state.favorites.includes(id);

  return { saved, favorite, add };
}
