"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/state/store-context";
import { validAddress } from "@/lib/domain/address";

export function useProfile() {
  const { state, update, ready } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const tab = params.get("aba") ?? "pedidos";
  const [name, setName] = useState(state.profile.name);
  const [address, setAddress] = useState(state.profile.address);
  const [error, setError] = useState("");
  useEffect(() => {
    setName(state.profile.name);
    setAddress(state.profile.address);
  }, [state.profile]);
  function save(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !validAddress(address)) {
      setError("Informe seu nome e um endereço completo.");
      return;
    }
    setError("");
    update(
      (s) => ({ ...s, profile: { name: name.trim(), address } }),
      "Seu perfil foi atualizado.",
    );
  }
  const loggedIn = state.loggedIn;
  const profile = state.profile;
  const orders = state.orders;
  const favoriteCount = state.favorites.length;
  function changeTab(value: string) {
    router.replace(`/perfil?aba=${value}`, { scroll: false });
  }
  function logout() {
    update(
      (s) => ({ ...s, loggedIn: false }),
      "Você saiu do perfil. Seu carrinho e favoritos continuam salvos.",
    );
  }
  return {
    ready,
    loggedIn,
    profile,
    orders,
    favoriteCount,
    tab,
    name,
    setName,
    address,
    setAddress,
    error,
    save,
    changeTab,
    logout,
  };
}
