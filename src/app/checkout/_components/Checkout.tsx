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
      <div className="page-container">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Primeiro, escolha seus encantos."
        >
          Adicione produtos ao carrinho para experimentar uma compra.
        </EmptyState>
      </div>
    );
  if (!loggedIn)
    return (
      <div className="page-container">
        <Breadcrumb
          items={[
            { label: "Carrinho", to: "/carrinho" },
            { label: "Compra simulada" },
          ]}
        />
        <LoginPanel next={`/checkout?entrega=${delivery}`} />
      </div>
    );
  return (
    <div className="page-container">
      <Breadcrumb
        items={[
          { label: "Carrinho", to: "/carrinho" },
          { label: "Compra simulada" },
        ]}
      />
      <PageHeading
        eyebrow="SÓ MAIS ALGUNS DETALHES"
        title="Finalize seu pedido de demonstração"
      >
        Use informações fictícias. Esta experiência não gera uma compra real.
      </PageHeading>
      <form
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-8"
        onSubmit={submit}
      >
        <div className="flex flex-col gap-5">
          <section className="panel">
            <h2>
              <span className="step-number">1</span> Seus dados
            </h2>
            <p className="customer-line">
              <UserRound size={20} />
              <strong>{customerName}</strong>
              <Link className="text-link" href="/perfil?aba=dados">
                Editar perfil
              </Link>
            </p>
          </section>
          <section className="panel">
            <h2>
              <span className="step-number">2</span> Entrega ou retirada
            </h2>
            <div className="choice-row">
              <label
                className={`choice ${delivery === "shipping" ? "chosen" : ""}`}
              >
                <input
                  type="radio"
                  name="checkout-delivery"
                  checked={delivery === "shipping"}
                  onChange={() => setDelivery("shipping")}
                />
                <Truck size={20} />
                <span>
                  <strong>Envio por CEP</strong>
                  <small>{money(SHIPPING_FEE)} • 5 a 8 dias úteis</small>
                </span>
              </label>
              <label
                className={`choice ${delivery === "pickup" ? "chosen" : ""}`}
              >
                <input
                  type="radio"
                  name="checkout-delivery"
                  checked={delivery === "pickup"}
                  onChange={() => setDelivery("pickup")}
                />
                <MapPin size={20} />
                <span>
                  <strong>Retirada gratuita</strong>
                  <small>Em nossa loja fictícia</small>
                </span>
              </label>
            </div>
            {delivery === "shipping" ? (
              <>
                <p className="form-hint">
                  Endereço de demonstração • campos obrigatórios, exceto
                  complemento.
                </p>
                <AddressFields
                  address={address}
                  setAddress={setAddress}
                  prefix="checkout"
                />
              </>
            ) : (
              <div className="pickup-info">
                <MapPin size={22} />
                <div>
                  <strong>Seu encanto espera por você aqui:</strong>
                  <p>{PICKUP_ADDRESS}</p>
                  <small>
                    Retirada simulada em até 2 dias úteis após a preparação.
                  </small>
                </div>
              </div>
            )}
          </section>
          <section className="panel">
            <h2>
              <span className="step-number">3</span> Pagamento ilustrativo
            </h2>
            <div className="choice-row">
              <label className={`choice ${payment === "pix" ? "chosen" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "pix"}
                  onChange={() => setPayment("pix")}
                />
                <Sparkles size={20} />
                <span>
                  <strong>Pix</strong>
                  <small>Sem QR code ou cobrança</small>
                </span>
              </label>
              <label className={`choice ${payment === "card" ? "chosen" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                <CreditCard size={20} />
                <span>
                  <strong>Cartão</strong>
                  <small>Sem dados bancários</small>
                </span>
              </label>
            </div>
            <p className="demo-note">
              <ShieldCheck size={18} /> A escolha registra apenas a forma de
              pagamento na simulação.
            </p>
          </section>
        </div>
        <aside className="panel order-summary lg:sticky lg:top-6">
          <span className="eyebrow">ESCOLHIDO COM CARINHO</span>
          <h2>Seu pedido</h2>
          <div className="mini-cart">
            {rows.map(({ item, product: p }) => {
              return (
                <div key={item.productId}>
                  <Photo source={p?.images[0] ?? ""} alt="" />
                  <span>
                    <strong>{p?.name ?? "Indisponível"}</strong>
                    <small>Quantidade: {item.quantity}</small>
                  </span>
                  <strong>{money((p?.price ?? 0) * item.quantity)}</strong>
                </div>
              );
            })}
          </div>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>
              {delivery === "shipping" ? "Envio demonstrativo" : "Retirada"}
            </span>
            <span>
              {delivery === "shipping" ? money(SHIPPING_FEE) : "Grátis"}
            </span>
          </div>
          <div className="summary-total">
            <span>Total simulado</span>
            <strong>
              {money(subtotal + (delivery === "shipping" ? SHIPPING_FEE : 0))}
            </strong>
          </div>
          {error && (
            <p className="inline-error" role="alert">
              {error}
            </p>
          )}
          <button className="button full" type="submit" disabled={submitting}>
            {submitting ? "Criando pedido…" : "Criar pedido de demonstração"}
            <ArrowRight size={16} />
          </button>
          <p className="demo-note">
            <ShieldCheck size={18} /> Nenhuma cobrança. Nenhuma entrega real.
          </p>
        </aside>
      </form>
    </div>
  );
}
