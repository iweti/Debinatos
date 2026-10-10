"use client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/state/store-context";
import { validAddress } from "@/lib/domain/address";

export function useCheckout() {
  const { state, checkout, ready } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [delivery, setDelivery] = useState<"shipping" | "pickup">(
    params.get("entrega") === "pickup" ? "pickup" : "shipping",
  );
  const [payment, setPayment] = useState<"pix" | "card">("pix");
  const [address, setAddress] = useState(state.profile.address);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    setAddress(state.profile.address);
  }, [state.profile.address]);
  const subtotal = state.cart.reduce(
    (sum, item) =>
      sum +
      (state.products.find((p) => p.id === item.productId)?.price ?? 0) *
        item.quantity,
    0,
  );
  function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;
    if (delivery === "shipping" && !validAddress(address)) {
      setError("Preencha todos os campos obrigatórios do endereço.");
      return;
    }
    setError("");
    setSubmitting(true);
    const id = checkout({ delivery, payment, address });
    if (id) router.replace(`/pedido/${id}?novo=1`);
    else setSubmitting(false);
  }
  const loggedIn = state.loggedIn;
  const customerName = state.profile.name;
  const rows = state.cart.map((item) => ({
    item,
    product: state.products.find((p) => p.id === item.productId),
  }));
  return {
    ready,
    loggedIn,
    customerName,
    rows,
    delivery,
    setDelivery,
    payment,
    setPayment,
    address,
    setAddress,
    error,
    submitting,
    subtotal,
    submit,
  };
}
