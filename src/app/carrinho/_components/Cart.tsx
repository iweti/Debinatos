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
    <div className="page-container">
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
            <div className="cart-list">
              {rows.map(({ item, product }) => (
                <article className="cart-row" key={item.productId}>
                  <Link href={`/produto/${item.productId}`}>
                    <Photo
                      source={product?.images[0] ?? ""}
                      alt={`Imagem ilustrativa de ${product?.name ?? "Produto indisponível"}`}
                    />
                  </Link>
                  <div className="cart-product-info">
                    <span className="eyebrow">
                      {product?.category ?? "Produto indisponível"}
                    </span>
                    <Link href={`/produto/${item.productId}`}>
                      <h3>{product?.name ?? "Produto removido"}</h3>
                    </Link>
                    <span>{money(product?.price ?? 0)}</span>
                    {(!product?.active || item.quantity > product.stock) && (
                      <span className="inline-error">
                        Indisponível ou estoque insuficiente. Remova ou ajuste o
                        item.
                      </span>
                    )}
                    <button
                      className="text-button"
                      onClick={() => quantity(item.productId, 0)}
                    >
                      Remover
                    </button>
                  </div>
                  <div className="cart-row-end">
                    <Quantity
                      value={item.quantity}
                      max={product?.active ? product.stock : 0}
                      onChange={(count) => quantity(item.productId, count)}
                      name={product?.name ?? "produto"}
                    />
                    <strong>
                      {money((product?.price ?? 0) * item.quantity)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
            <Link className="text-link back-shop" href="/catalogo">
              <ArrowLeft size={16} /> Continuar escolhendo
            </Link>
            <section className="panel shipping-panel">
              <h2>
                <Truck size={22} /> Como seu encanto chega até você?
              </h2>
              <div className="choice-row">
                <label
                  className={`choice ${delivery === "shipping" ? "chosen" : ""}`}
                >
                  <input
                    type="radio"
                    name="cart-delivery"
                    checked={delivery === "shipping"}
                    onChange={() => setDelivery("shipping")}
                  />
                  <Truck size={20} />
                  <span>
                    <strong>Receber em casa</strong>
                    <small>Frete demonstrativo: {money(SHIPPING_FEE)}</small>
                  </span>
                </label>
                <label
                  className={`choice ${delivery === "pickup" ? "chosen" : ""}`}
                >
                  <input
                    type="radio"
                    name="cart-delivery"
                    checked={delivery === "pickup"}
                    onChange={() => setDelivery("pickup")}
                  />
                  <MapPin size={20} />
                  <span>
                    <strong>Retirar na loja</strong>
                    <small>Grátis • endereço fictício</small>
                  </span>
                </label>
              </div>
              {delivery === "shipping" ? (
                <form className="cep-form" onSubmit={calculateShipping}>
                  <label htmlFor="cart-cep">Simular entrega por CEP</label>
                  <div>
                    <input
                      id="cart-cep"
                      inputMode="numeric"
                      maxLength={9}
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => changeCep(e.target.value)}
                    />
                    <button className="button outline small" type="submit">
                      Calcular
                    </button>
                  </div>
                  {cepError && (
                    <p className="inline-error" role="alert">
                      {cepError}
                    </p>
                  )}
                  {calculatedCep && (
                    <p className="success-text">
                      <Check size={15} /> Para {calculatedCep}:{" "}
                      {money(SHIPPING_FEE)} • 5 a 8 dias úteis (simulação)
                    </p>
                  )}
                  <small>
                    Valor fixo ilustrativo. Não há consulta a transportadoras.
                  </small>
                </form>
              ) : (
                <p className="muted">{PICKUP_ADDRESS}</p>
              )}
            </section>
          </div>
          <aside className="panel order-summary lg:sticky lg:top-6">
            <span className="eyebrow">UM POUCO MAIS PERTO</span>
            <h2>Resumo do carrinho</h2>
            <div className="summary-line">
              <span>Subtotal ({itemCount} itens)</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="summary-line">
              <span>
                {delivery === "shipping"
                  ? "Envio demonstrativo"
                  : "Retirada na loja"}
              </span>
              <span>{fee ? money(fee) : "Grátis"}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <strong>{money(subtotal + fee)}</strong>
            </div>
            {invalid ? (
              <p className="inline-error" role="alert">
                Revise os itens indisponíveis antes de continuar.
              </p>
            ) : (
              <Link
                className="button full"
                href={`/checkout?entrega=${delivery}`}
              >
                Continuar para a compra <ArrowRight size={16} />
              </Link>
            )}
            <p className="demo-note">
              <ShieldCheck size={18} /> Compra demonstrativa. Nenhum valor será
              cobrado.
            </p>
            <div className="payment-icons">
              <span>Pix</span>
              <span>
                <CreditCard size={16} /> Cartão
              </span>
              <small>simulados</small>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
