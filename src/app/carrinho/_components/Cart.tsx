"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/ui/PageHeading";
import { Photo } from "@/components/product/Photo";
import { Quantity } from "@/components/ui/Quantity";
import { money } from "@/lib/utils/format";
import { PICKUP_ADDRESS, SHIPPING_FEE } from "@/lib/constants/store";
import { useCart } from "../_lib/use-cart";

export function Cart() {
  const {
    quantity,
    delivery,
    setDelivery,
    cep,
    calculatedCep,
    cepError,
    rows,
    subtotal,
    invalid,
    fee,
    itemCount,
    calculateShipping,
    changeCep,
  } = useCart();
  return (
    <div className="mx-auto min-h-[500px] w-[calc(100%-36px)] max-w-[1240px] pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
      <Breadcrumb items={[{ label: "Carrinho" }]} />
      <PageHeading
        eyebrow="SEUS PEQUENOS ACHADOS"
        title="Um carrinho de encantos"
      >
        Cada escolha, um carinho a mais no seu dia.
      </PageHeading>
      {!rows.length ? (
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Seu carrinho está esperando um encanto."
        >
          Explore a coleção e encontre um detalhe que combine com você.
        </EmptyState>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-8">
          <div>
            <div className="border-t border-line">
              {rows.map(({ item, product }) => (
                <article
                  className="relative flex items-start gap-3 border-b border-line py-5 md:items-center md:gap-5 md:py-6"
                  key={item.productId}
                >
                  <Link
                    className="h-24 w-19 shrink-0 md:h-28 md:w-24"
                    href={`/produto/${item.productId}`}
                  >
                    <Photo
                      className="size-full rounded-lg object-cover"
                      source={product?.images[0] ?? ""}
                      alt={`Imagem ilustrativa de ${product?.name ?? "Produto indisponível"}`}
                    />
                  </Link>
                  <div className="min-w-0 flex-1 pb-9 md:pb-0">
                    <span className="inline-flex items-center gap-2 leading-relaxed font-semibold text-brand uppercase text-[7px] tracking-wider md:text-[8px]">
                      {product?.category ?? "Produto indisponível"}
                    </span>
                    <Link href={`/produto/${item.productId}`}>
                      <h3 className="my-1.5 font-serif text-[15px] font-medium md:text-[17px]">
                        {product?.name ?? "Produto removido"}
                      </h3>
                    </Link>
                    <span className="block text-[11px] text-muted">
                      {money(product?.price ?? 0)}
                    </span>
                    {(!product?.active || item.quantity > product.stock) && (
                      <span className="my-3 leading-relaxed block text-[11px] text-muted">
                        Indisponível ou estoque insuficiente. Remova ou ajuste o
                        item.
                      </span>
                    )}
                    <button
                      className="pt-2 text-[10px] text-brand underline underline-offset-4"
                      onClick={() => quantity(item.productId, 0)}
                    >
                      Remover
                    </button>
                  </div>
                  <div className="absolute right-0 bottom-4 left-[88px] flex items-center justify-between gap-3 md:static md:flex-col md:items-end md:gap-5">
                    <Quantity
                      compact
                      value={item.quantity}
                      max={product?.active ? product.stock : 0}
                      onChange={(count) => quantity(item.productId, count)}
                      name={product?.name ?? "produto"}
                    />
                    <strong className="text-xs md:text-[13px]">
                      {money((product?.price ?? 0) * item.quantity)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
            <Link
              className="inline-flex items-center gap-2 p-0 text-xs leading-relaxed font-semibold text-brand hover:underline hover:underline-offset-4 my-6"
              href="/catalogo"
            >
              <ArrowLeft size={16} /> Continuar escolhendo
            </Link>
            <section className="rounded-xl border border-line bg-white p-5 md:p-7">
              <h2 className="mb-6 flex items-center gap-3 text-lg">
                <Truck className="text-brand" size={22} /> Como seu encanto
                chega até você?
              </h2>
              <div className="mb-5 flex flex-col gap-3 xl:flex-row">
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg border border-[#ded3c8] px-3 py-3.5 font-normal has-checked:border-brand has-checked:bg-[#fdf5ed]">
                  <input
                    className="m-0 size-3.5"
                    type="radio"
                    name="cart-delivery"
                    checked={delivery === "shipping"}
                    onChange={() => setDelivery("shipping")}
                  />
                  <Truck className="text-brand" size={20} />
                  <span>
                    <strong className="block text-[11px] leading-normal font-medium">
                      Receber em casa
                    </strong>
                    <small className="mt-1 block text-[9px] leading-normal text-muted">
                      Frete demonstrativo: {money(SHIPPING_FEE)}
                    </small>
                  </span>
                </label>
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-lg border border-[#ded3c8] px-3 py-3.5 font-normal has-checked:border-brand has-checked:bg-[#fdf5ed]">
                  <input
                    className="m-0 size-3.5"
                    type="radio"
                    name="cart-delivery"
                    checked={delivery === "pickup"}
                    onChange={() => setDelivery("pickup")}
                  />
                  <MapPin className="text-brand" size={20} />
                  <span>
                    <strong className="block text-[11px] leading-normal font-medium">
                      Retirar na loja
                    </strong>
                    <small className="mt-1 block text-[9px] leading-normal text-muted">
                      Grátis • endereço fictício
                    </small>
                  </span>
                </label>
              </div>
              {delivery === "shipping" ? (
                <form onSubmit={calculateShipping}>
                  <label
                    className="mb-2.5 block text-[11px]"
                    htmlFor="cart-cep"
                  >
                    Simular entrega por CEP
                  </label>
                  <div className="flex max-w-80 gap-2.5">
                    <input
                      className="min-w-0 flex-1 text-xs"
                      id="cart-cep"
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => changeCep(e.target.value)}
                    />
                    <button
                      className="inline-flex items-center justify-center gap-3 rounded-lg border leading-snug font-semibold transition hover:-translate-y-px disabled:translate-y-0 border-[#d7bbb0] bg-transparent text-brand hover:border-brand hover:bg-[#fff4ec] min-h-10 px-4 py-2.5 text-[11px]"
                      type="submit"
                    >
                      Calcular
                    </button>
                  </div>
                  {cepError && (
                    <p
                      className="my-3 text-[11px] leading-relaxed text-[#b32217]"
                      role="alert"
                    >
                      {cepError}
                    </p>
                  )}
                  {calculatedCep && (
                    <p className="flex items-center gap-1.5 text-[11px] text-leaf">
                      <Check size={15} /> Para {calculatedCep}:{" "}
                      {money(SHIPPING_FEE)} • 5 a 8 dias úteis (simulação)
                    </p>
                  )}
                  <small className="mt-3 block text-[9px] text-muted">
                    Valor fixo ilustrativo. Não há consulta a transportadoras.
                  </small>
                </form>
              ) : (
                <p className="text-xs text-muted">{PICKUP_ADDRESS}</p>
              )}
            </section>
          </div>
          <aside className="rounded-xl border border-line p-5 md:p-7 bg-surface lg:sticky lg:top-6">
            <span className="inline-flex items-center gap-2 leading-relaxed font-semibold tracking-[.18em] text-brand uppercase mb-3 text-[8px]">
              UM POUCO MAIS PERTO
            </span>
            <h2 className="flex items-center gap-3 mb-7 text-[23px]">
              Resumo do carrinho
            </h2>
            <div className="my-4 flex justify-between gap-4 text-xs text-muted">
              <span className="last:text-ink">
                Subtotal ({itemCount} itens)
              </span>
              <span className="last:text-ink">{money(subtotal)}</span>
            </div>
            <div className="my-4 flex justify-between gap-4 text-xs text-muted">
              <span className="last:text-ink">
                {delivery === "shipping"
                  ? "Envio demonstrativo"
                  : "Retirada na loja"}
              </span>
              <span className="last:text-ink">
                {fee ? money(fee) : "Grátis"}
              </span>
            </div>
            <div className="mt-5 mb-1 flex items-center justify-between gap-4 border-t border-[#e3d6c8] py-5 text-[13px] font-medium">
              <span>Total</span>
              <strong className="text-2xl font-semibold text-brand">
                {money(subtotal + fee)}
              </strong>
            </div>
            {invalid ? (
              <p
                className="my-3 text-[11px] leading-relaxed text-[#b32217]"
                role="alert"
              >
                Revise os itens indisponíveis antes de continuar.
              </p>
            ) : (
              <Link
                className="min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand py-3 leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 flex w-full px-3 text-[11px]"
                href={`/checkout?entrega=${delivery}`}
              >
                Continuar para a compra <ArrowRight size={16} />
              </Link>
            )}
            <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-[#856e5f]">
              <ShieldCheck className="mt-px text-brand" size={18} /> Compra
              demonstrativa. Nenhum valor será cobrado.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3 border-t border-line pt-5 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">Pix</span>
              <span className="flex items-center gap-1.5">
                <CreditCard size={16} /> Cartão
              </span>
              <small className="text-[9px]">simulados</small>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
