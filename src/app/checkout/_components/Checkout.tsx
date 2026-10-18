"use client";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/ui/PageHeading";
import { Photo } from "@/components/product/Photo";
import { money } from "@/lib/utils/format";
import { PICKUP_ADDRESS, SHIPPING_FEE } from "@/lib/constants/store";
import Loading from "@/components/ui/Loading";
import { LoginPanel } from "@/components/account/LoginPanel";
import { AddressFields } from "@/components/forms/AddressFields";
import { useCheckout } from "../_lib/use-checkout";

export function Checkout() {
  const {
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
  } = useCheckout();
  if (!ready) return <Loading />;
  if (!rows.length)
    return (
      <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Primeiro, escolha seus encantos."
        >
          Adicione produtos ao carrinho para criar seu pedido.
        </EmptyState>
      </div>
    );
  if (!loggedIn)
    return (
      <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
        <Breadcrumb
          items={[
            { label: "Carrinho", to: "/carrinho" },
            { label: "Finalizar pedido" },
          ]}
        />
        <LoginPanel next={`/checkout?entrega=${delivery}`} />
      </div>
    );
  return (
    <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
      <Breadcrumb
        items={[
          { label: "Carrinho", to: "/carrinho" },
          { label: "Finalizar pedido" },
        ]}
      />
      <PageHeading
        eyebrow="SÓ MAIS ALGUNS DETALHES"
        title="Finalize seu pedido"
      >
        Confira seus dados e escolha como deseja receber seus encantos.
      </PageHeading>
      <form
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-8"
        onSubmit={submit}
      >
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border border-line bg-white p-5 md:p-7">
            <h2 className="mb-6 flex items-center gap-3 text-[22px]">
              <span className="grid size-7 place-items-center rounded-full border border-[#e9cfc0] bg-[#fbf1e6] font-sans text-[11px] text-brand">
                1
              </span>{" "}
              Seus dados
            </h2>
            <p className="flex flex-wrap items-center gap-3 text-xs">
              <UserRound className="text-brand" size={20} />
              <strong>{customerName}</strong>
              <Link
                className="inline-flex items-center gap-2 p-0 leading-relaxed font-semibold text-brand hover:underline hover:underline-offset-4 ml-auto text-[11px]"
                href="/perfil?aba=dados"
              >
                Editar perfil
              </Link>
            </p>
          </section>
          <section className="rounded-xl border border-line bg-white p-5 md:p-7">
            <h2 className="mb-6 flex items-center gap-3 text-[22px]">
              <span className="grid size-7 place-items-center rounded-full border border-[#e9cfc0] bg-[#fbf1e6] font-sans text-[11px] text-brand">
                2
              </span>{" "}
              Entrega ou retirada
            </h2>
            <div className="mb-5 flex flex-col gap-3 xl:flex-row">
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg border border-[#ded3c8] px-3 py-3.5 font-normal has-checked:border-brand has-checked:bg-[#fdf5ed]">
                <input
                  className="m-0 size-3.5"
                  type="radio"
                  name="checkout-delivery"
                  checked={delivery === "shipping"}
                  onChange={() => setDelivery("shipping")}
                />
                <Truck className="text-brand" size={20} />
                <span>
                  <strong className="block text-[11px] leading-normal font-medium">
                    Envio por CEP
                  </strong>
                  <small className="mt-1 block text-[9px] leading-normal text-muted">
                    {money(SHIPPING_FEE)} • 5 a 8 dias úteis
                  </small>
                </span>
              </label>
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg border border-[#ded3c8] px-3 py-3.5 font-normal has-checked:border-brand has-checked:bg-[#fdf5ed]">
                <input
                  className="m-0 size-3.5"
                  type="radio"
                  name="checkout-delivery"
                  checked={delivery === "pickup"}
                  onChange={() => setDelivery("pickup")}
                />
                <MapPin className="text-brand" size={20} />
                <span>
                  <strong className="block text-[11px] leading-normal font-medium">
                    Retirada gratuita
                  </strong>
                  <small className="mt-1 block text-[9px] leading-normal text-muted">
                    Local a combinar
                  </small>
                </span>
              </label>
            </div>
            {delivery === "shipping" ? (
              <>
                <p className="mb-6 text-[11px] text-muted">
                  Endereço de entrega • campos obrigatórios, exceto complemento.
                </p>
                <AddressFields
                  address={address}
                  setAddress={setAddress}
                  prefix="checkout"
                />
              </>
            ) : (
              <div className="flex gap-4 rounded-lg bg-[#f9f5ec] p-5">
                <MapPin className="text-brand" size={22} />
                <div>
                  <strong className="text-xs">
                    Seu encanto espera por você aqui:
                  </strong>
                  <p className="my-2 text-[11px] text-muted">
                    {PICKUP_ADDRESS}
                  </p>
                  <small className="text-[10px] text-muted">
                    Combine os detalhes da retirada com a Debinatos.
                  </small>
                </div>
              </div>
            )}
          </section>
          <section className="rounded-xl border border-line bg-white p-5 md:p-7">
            <h2 className="mb-6 flex items-center gap-3 text-[22px]">
              <span className="grid size-7 place-items-center rounded-full border border-[#e9cfc0] bg-[#fbf1e6] font-sans text-[11px] text-brand">
                3
              </span>{" "}
              Forma de pagamento
            </h2>
            <div className="mb-5 flex flex-col gap-3 xl:flex-row">
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg border border-[#ded3c8] px-3 py-3.5 font-normal has-checked:border-brand has-checked:bg-[#fdf5ed]">
                <input
                  className="m-0 size-3.5"
                  type="radio"
                  name="payment"
                  checked={payment === "pix"}
                  onChange={() => setPayment("pix")}
                />
                <Sparkles className="text-brand" size={20} />
                <span>
                  <strong className="block text-[11px] leading-normal font-medium">
                    Pix
                  </strong>
                  <small className="mt-1 block text-[9px] leading-normal text-muted">
                    Preferência por Pix
                  </small>
                </span>
              </label>
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg border border-[#ded3c8] px-3 py-3.5 font-normal has-checked:border-brand has-checked:bg-[#fdf5ed]">
                <input
                  className="m-0 size-3.5"
                  type="radio"
                  name="payment"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                <CreditCard className="text-brand" size={20} />
                <span>
                  <strong className="block text-[11px] leading-normal font-medium">
                    Cartão
                  </strong>
                  <small className="mt-1 block text-[9px] leading-normal text-muted">
                    Preferência por cartão
                  </small>
                </span>
              </label>
            </div>
            <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-[#856e5f]">
              <ShieldCheck className="mt-px text-brand" size={18} /> A escolha
              registra sua preferência de pagamento no pedido.
            </p>
          </section>
        </div>
        <aside className="rounded-xl border border-line p-5 md:p-7 bg-surface lg:sticky lg:top-6">
          <span className="inline-flex items-center gap-2 leading-relaxed font-semibold tracking-[.18em] text-brand uppercase mb-3 text-[8px]">
            ESCOLHIDO COM CARINHO
          </span>
          <h2 className="flex items-center gap-3 mb-7 text-[23px]">
            Seu pedido
          </h2>
          <div className="mb-6 border-b border-line pb-2.5">
            {rows.map(({ item, product: p }) => {
              return (
                <div
                  className="mb-4 flex items-center gap-2.5"
                  key={item.productId}
                >
                  <Photo
                    className="h-13.25 w-11.5 rounded object-cover"
                    source={p?.images[0] ?? ""}
                    alt=""
                  />
                  <span className="flex-1 text-[11px]">
                    <strong>{p?.name ?? "Indisponível"}</strong>
                    <small className="mt-1 block text-[9px] text-muted">
                      Quantidade: {item.quantity}
                    </small>
                  </span>
                  <strong className="text-[10px] font-medium">
                    {money((p?.price ?? 0) * item.quantity)}
                  </strong>
                </div>
              );
            })}
          </div>
          <div className="my-4 flex justify-between gap-4 text-xs text-muted">
            <span className="last:text-ink">Subtotal</span>
            <span className="last:text-ink">{money(subtotal)}</span>
          </div>
          <div className="my-4 flex justify-between gap-4 text-xs text-muted">
            <span className="last:text-ink">
              {delivery === "shipping" ? "Envio" : "Retirada"}
            </span>
            <span className="last:text-ink">
              {delivery === "shipping" ? money(SHIPPING_FEE) : "Grátis"}
            </span>
          </div>
          <div className="mt-5 mb-1 flex items-center justify-between gap-4 border-t border-[#e3d6c8] py-5 text-[13px] font-medium">
            <span>Total</span>
            <strong className="text-2xl font-semibold text-brand">
              {money(subtotal + (delivery === "shipping" ? SHIPPING_FEE : 0))}
            </strong>
          </div>
          {error && (
            <p
              className="my-3 text-[11px] leading-relaxed text-[#b32217]"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            className="min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand p-3 leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 flex w-full  text-[11px]"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Criando pedido…" : "Criar pedido"}
            <ArrowRight size={16} />
          </button>
          <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-[#856e5f]">
            <ShieldCheck className="mt-px text-brand" size={18} /> Confira os
            dados do pedido antes de continuar.
          </p>
        </aside>
      </form>
    </div>
  );
}
