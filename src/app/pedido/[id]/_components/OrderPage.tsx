"use client";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { Photo } from "@/components/product/Photo";
import { dateLabel, money } from "@/lib/utils/format";
import { PICKUP_ADDRESS, STATUS_LABELS } from "@/lib/constants/store";
import { LoginPanel } from "@/components/account/LoginPanel";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useOrder } from "../_lib/use-order";

export function OrderPage() {
  const { id, loggedIn, order, statuses, currentStep, isNew } = useOrder();
  if (!loggedIn)
    return (
      <div className="page-container">
        <LoginPanel next={`/pedido/${id}`} />
      </div>
    );
  if (!order)
    return (
      <div className="page-container">
        <EmptyState
          icon={<Package size={32} />}
          title="Pedido não encontrado."
          action={
            <Link className="button" href="/perfil">
              Ver meus pedidos
            </Link>
          }
        >
          Este pedido não está salvo neste navegador.
        </EmptyState>
      </div>
    );
  return (
    <div className="page-container">
      <Breadcrumb
        items={[{ label: "Meu perfil", to: "/perfil" }, { label: order.id }]}
      />
      {isNew && (
        <div className="order-success">
          <CheckCircle2 size={42} />
          <div>
            <span className="eyebrow">UM ENCANTO DE EXPERIÊNCIA</span>
            <h2>Seu pedido de demonstração foi criado!</h2>
            <p>
              Obrigada por explorar a Debinatos. Nenhuma cobrança ou entrega
              será realizada.
            </p>
          </div>
        </div>
      )}
      <div className="order-title">
        <div>
          <span className="eyebrow">ESCOLHIDO COM CARINHO</span>
          <h1>Pedido {order.id}</h1>
          <p className="muted">
            Criado em {dateLabel(order.createdAt)} • {order.customerName}
          </p>
        </div>
        <StatusBadge order={order} />
      </div>
      <div className="panel timeline">
        {statuses.map((status, index) => (
          <div className={index <= currentStep ? "done" : ""} key={status}>
            <span>
              {index <= currentStep ? <Check size={17} /> : index + 1}
            </span>
            <strong>{STATUS_LABELS[status]}</strong>
          </div>
        ))}
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-8">
        <section className="panel">
          <h2>Seus encantos</h2>
          {order.items.map((item) => (
            <div className="receipt-item" key={item.productId}>
              <Photo
                source={item.image}
                alt={`Imagem ilustrativa de ${item.name}`}
              />
              <div>
                <strong>{item.name}</strong>
                <small>
                  {item.quantity} × {money(item.price)}
                </small>
              </div>
              <strong>{money(item.quantity * item.price)}</strong>
            </div>
          ))}
          <div className="receipt-delivery">
            <h3>
              {order.delivery === "shipping" ? (
                <Truck size={20} />
              ) : (
                <MapPin size={20} />
              )}
              {order.delivery === "shipping"
                ? "Endereço de entrega fictício"
                : "Retirada na loja fictícia"}
            </h3>
            {order.address ? (
              <p>
                {order.address.street}, {order.address.number}
                {order.address.complement && `, ${order.address.complement}`}
                <br />
                {order.address.district} • {order.address.city}/
                {order.address.state}
                <br />
                CEP {order.address.cep}
              </p>
            ) : (
              <p>{PICKUP_ADDRESS}</p>
            )}
          </div>
        </section>
        <aside className="panel order-summary lg:sticky lg:top-6">
          <h2>Resumo do pedido</h2>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{money(order.subtotal)}</span>
          </div>
          <div className="summary-line">
            <span>
              {order.delivery === "shipping" ? "Envio simulado" : "Retirada"}
            </span>
            <span>{order.shipping ? money(order.shipping) : "Grátis"}</span>
          </div>
          <div className="summary-total">
            <span>Total simulado</span>
            <strong>{money(order.total)}</strong>
          </div>
          <p className="payment-line">
            <CreditCard size={18} />
            {order.payment === "pix" ? "Pix" : "Cartão"} • pagamento ilustrativo
          </p>
          <p className="demo-note">
            <ShieldCheck size={18} /> Pedido de demonstração salvo apenas neste
            navegador.
          </p>
          <Link className="button outline full" href="/perfil?aba=pedidos">
            Meus pedidos <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
