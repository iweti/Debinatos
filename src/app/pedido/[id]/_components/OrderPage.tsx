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
      <div className="mx-auto min-h-[500px] w-[calc(100%-36px)] max-w-[1240px] pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
        <LoginPanel next={`/pedido/${id}`} />
      </div>
    );
  if (!order)
    return (
      <div className="mx-auto min-h-[500px] w-[calc(100%-36px)] max-w-[1240px] pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
        <EmptyState
          icon={<Package size={32} />}
          title="Pedido não encontrado."
          action={
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0"
              href="/perfil"
            >
              Ver meus pedidos
            </Link>
          }
        >
          Este pedido não está salvo neste navegador.
        </EmptyState>
      </div>
    );
  return (
    <div className="mx-auto min-h-[500px] w-[calc(100%-36px)] max-w-[1240px] pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
      <Breadcrumb
        items={[{ label: "Meu perfil", to: "/perfil" }, { label: order.id }]}
      />
      {isNew && (
        <div className="mb-8 flex items-start gap-4 rounded-xl border border-[#e1ebd6] bg-[#f0f5e9] p-5 md:items-center md:gap-6 md:p-8">
          <CheckCircle2 className="size-8 text-leaf md:size-11" size={42} />
          <div>
            <span className="inline-flex items-center gap-2 leading-relaxed font-semibold tracking-[.18em] uppercase text-[8px] text-leaf">
              UM ENCANTO DE EXPERIÊNCIA
            </span>
            <h2 className="mt-2 mb-3 text-2xl">
              Seu pedido de demonstração foi criado!
            </h2>
            <p className="text-[11px] text-muted">
              Obrigada por explorar a Debinatos. Nenhuma cobrança ou entrega
              será realizada.
            </p>
          </div>
        </div>
      )}
      <div className="mb-7 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-[9px] leading-relaxed font-semibold tracking-[.18em] text-brand uppercase">
            ESCOLHIDO COM CARINHO
          </span>
          <h1 className="my-3 text-[29px] md:text-[32px]">Pedido {order.id}</h1>
          <p className="text-xs text-muted text-[11px]">
            Criado em {dateLabel(order.createdAt)} • {order.customerName}
          </p>
        </div>
        <StatusBadge order={order} />
      </div>
      <div className="rounded-xl border border-line bg-white relative mb-8 flex justify-between px-2 py-7 md:px-2 md:py-7">
        {statuses.map((status, index) => (
          <div
            className="group/step relative flex-1 text-center before:absolute before:top-4 before:-left-1/2 before:right-1/2 before:h-px before:bg-[#e5dbd0] before:content-[''] first:before:hidden before:data-[done=true]:bg-brand"
            data-done={index <= currentStep}
            key={status}
          >
            <span className="relative mx-auto mb-3 grid size-8 place-items-center rounded-full border border-[#e5dbd0] bg-[#f6f1eb] text-[11px] text-muted group-data-[done=true]/step:border-brand group-data-[done=true]/step:bg-brand group-data-[done=true]/step:text-white">
              {index <= currentStep ? <Check size={17} /> : index + 1}
            </span>
            <strong className="block px-1 text-[8px] leading-relaxed font-normal text-muted md:text-[11px] group-data-[done=true]/step:text-brand">
              {STATUS_LABELS[status]}
            </strong>
          </div>
        ))}
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-8">
        <section className="rounded-xl border border-line bg-white p-5 md:p-7">
          <h2 className="mb-6 flex items-center gap-3 text-[22px]">
            Seus encantos
          </h2>
          {order.items.map((item) => (
            <div
              className="flex items-center gap-3 border-b border-line py-5 md:gap-4"
              key={item.productId}
            >
              <Photo
                className="h-18 w-15 rounded object-cover md:h-20 md:w-18"
                source={item.image}
                alt={`Imagem ilustrativa de ${item.name}`}
              />
              <div>
                <strong className="text-xs">{item.name}</strong>
                <small className="mt-2.5 block text-[11px] text-muted">
                  {item.quantity} × {money(item.price)}
                </small>
              </div>
              <strong className="ml-auto text-xs">
                {money(item.quantity * item.price)}
              </strong>
            </div>
          ))}
          <div className="mt-6">
            <h3 className="mb-4 flex items-center gap-2.5 text-[13px]">
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
              <p className="text-xs text-muted">
                {order.address.street}, {order.address.number}
                {order.address.complement && `, ${order.address.complement}`}
                <br />
                {order.address.district} • {order.address.city}/
                {order.address.state}
                <br />
                CEP {order.address.cep}
              </p>
            ) : (
              <p className="text-xs text-muted">{PICKUP_ADDRESS}</p>
            )}
          </div>
        </section>
        <aside className="rounded-xl border border-line p-5 md:p-7 bg-surface lg:sticky lg:top-6">
          <h2 className="flex items-center gap-3 mb-7 text-[23px]">
            Resumo do pedido
          </h2>
          <div className="my-4 flex justify-between gap-4 text-xs text-muted">
            <span className="last:text-ink">Subtotal</span>
            <span className="last:text-ink">{money(order.subtotal)}</span>
          </div>
          <div className="my-4 flex justify-between gap-4 text-xs text-muted">
            <span className="last:text-ink">
              {order.delivery === "shipping" ? "Envio simulado" : "Retirada"}
            </span>
            <span className="last:text-ink">
              {order.shipping ? money(order.shipping) : "Grátis"}
            </span>
          </div>
          <div className="mt-5 mb-1 flex items-center justify-between gap-4 border-t border-[#e3d6c8] py-5 text-[13px] font-medium">
            <span>Total simulado</span>
            <strong className="text-2xl font-semibold text-brand">
              {money(order.total)}
            </strong>
          </div>
          <p className="flex items-center gap-2.5 text-[11px] text-muted">
            <CreditCard size={18} />
            {order.payment === "pix" ? "Pix" : "Cartão"} • pagamento ilustrativo
          </p>
          <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-[#856e5f]">
            <ShieldCheck className="mt-px text-brand" size={18} /> Pedido de
            demonstração salvo apenas neste navegador.
          </p>
          <Link
            className="min-h-12 items-center justify-center gap-3 rounded-lg border py-3 leading-snug font-semibold transition hover:-translate-y-px disabled:translate-y-0 border-[#d7bbb0] bg-transparent text-brand hover:border-brand hover:bg-[#fff4ec] flex w-full px-3 text-[11px] mt-6"
            href="/perfil?aba=pedidos"
          >
            Meus pedidos <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
