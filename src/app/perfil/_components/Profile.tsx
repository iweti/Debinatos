"use client";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Heart,
  LogOut,
  MapPin,
  Package,
  Pencil,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/ui/PageHeading";
import { Photo } from "@/components/product/Photo";
import { dateLabel, money } from "@/lib/utils/format";
import Loading from "@/components/ui/Loading";
import { LoginPanel } from "@/components/account/LoginPanel";
import { AddressFields } from "@/components/forms/AddressFields";
import { StatusBadge } from "@/components/orders/StatusBadge";
import { useProfile } from "../_lib/use-profile";

export function Profile() {
  const {
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
  } = useProfile();
  if (!ready) return <Loading />;
  if (!loggedIn)
    return (
      <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
        <LoginPanel
          next={`/perfil?aba=${tab === "dados" ? "dados" : "pedidos"}`}
        />
      </div>
    );
  return (
    <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
      <Breadcrumb items={[{ label: "Meu perfil" }]} />
      <PageHeading
        eyebrow="BEM-VINDA AO SEU CANTINHO"
        title={`Olá, ${profile.name.split(" ")[0]}!`}
      >
        Seus achados, seus pedidos e seus pequenos encantos.
      </PageHeading>
      <div className="grid items-start gap-7 md:grid-cols-[210px_minmax(0,1fr)] md:gap-9">
        <aside className="h-fit overflow-hidden rounded-xl border border-line">
          <div className="border-b border-line bg-[#fcf8f1] px-4 py-6 text-center">
            <span className="grid place-items-center rounded-full bg-[#f5e5d5] font-serif text-xl text-brand mx-auto mb-3 size-14 text-[27px]">
              {profile.name.slice(0, 1).toUpperCase()}
            </span>
            <strong className="block text-[13px]">{profile.name}</strong>
            <small className="mt-2 block text-[10px] text-muted">
              Perfil de demonstração
            </small>
          </div>
          <nav
            className="grid grid-cols-2 gap-1 p-3 md:block"
            aria-label="Navegação do perfil"
          >
            <button
              className="mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-3.5 text-left text-[11px] hover:bg-surface data-[selected=true]:bg-[#f9eee3] data-[selected=true]:text-brand"
              data-selected={tab === "pedidos"}
              onClick={() => changeTab("pedidos")}
            >
              <Package size={19} /> Meus pedidos{" "}
              <span className="ml-auto grid size-5 place-items-center rounded-full bg-[#f7ede3] text-[9px]">
                {orders.length}
              </span>
            </button>
            <Link
              className="mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-3.5 text-left text-[11px] hover:bg-surface"
              href="/favoritos"
            >
              <Heart size={19} /> Itens salvos{" "}
              <span className="ml-auto grid size-5 place-items-center rounded-full bg-[#f7ede3] text-[9px]">
                {favoriteCount}
              </span>
            </Link>
            <button
              className="mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-3.5 text-left text-[11px] hover:bg-surface data-[selected=true]:bg-[#f9eee3] data-[selected=true]:text-brand"
              data-selected={tab === "dados"}
              onClick={() => changeTab("dados")}
            >
              <Pencil size={18} /> Meus dados
            </button>
            <button
              className="mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-3.5 text-left text-[11px] hover:bg-surface"
              onClick={logout}
            >
              <LogOut size={18} /> Sair do perfil
            </button>
          </nav>
        </aside>
        <section>
          {tab === "dados" ? (
            <form
              className="rounded-xl border border-line bg-white p-5 md:p-7"
              onSubmit={save}
            >
              <h2 className="mb-6 flex items-center gap-3 text-[22px]">
                Meus dados
              </h2>
              <p className="mb-6 text-[11px] text-muted">
                Use apenas dados fictícios. As informações ficam neste
                navegador.
              </p>
              <label
                className="block max-w-112.5 text-[11px]"
                htmlFor="profile-name"
              >
                Nome
                <input
                  className="text-xs"
                  id="profile-name"
                  value={name}
                  required
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <h3 className="mt-7 mb-6 flex items-center gap-2 text-sm">
                <MapPin size={18} /> Endereço de demonstração
              </h3>
              <AddressFields
                address={address}
                setAddress={setAddress}
                prefix="profile"
              />
              {error && (
                <p
                  className="my-3 text-[11px] leading-relaxed text-[#b32217]"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <button
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug  font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 mt-6"
                type="submit"
              >
                Salvar meus dados <Check size={16} />
              </button>
            </form>
          ) : (
            <>
              <div className="mb-6 flex justify-between gap-4 md:mb-8 items-center">
                <h2 className="text-2xl">Meus pedidos</h2>
                <span className="text-xs text-muted">Compras simuladas</span>
              </div>
              {orders.length ? (
                <div className="flex flex-col gap-5">
                  {orders.map((order) => (
                    <article
                      className="rounded-xl border border-line bg-white p-5 md:p-6"
                      key={order.id}
                    >
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div>
                          <strong className="text-[11px] md:text-xs">
                            Pedido {order.id}
                          </strong>
                          <small className="mt-1.5 block text-[9px] text-muted md:text-[10px]">
                            {dateLabel(order.createdAt)}
                          </small>
                        </div>
                        <StatusBadge order={order} />
                      </div>
                      <div className="mt-2.5 mb-5 flex items-center gap-3 md:gap-5">
                        <div className="flex gap-2">
                          {order.items.slice(0, 3).map((item) => (
                            <Photo
                              className="h-14 w-12 rounded object-cover md:h-16 md:w-14 nth-[n+3]:hidden nth-[n+3]:sm:block"
                              key={item.productId}
                              source={item.image}
                              alt={`Imagem ilustrativa de ${item.name}`}
                            />
                          ))}
                        </div>
                        <div>
                          <strong className="block text-xs">
                            {order.items.reduce((n, i) => n + i.quantity, 0)}{" "}
                            {order.items.reduce((n, i) => n + i.quantity, 0) ===
                            1
                              ? "item"
                              : "itens"}
                          </strong>
                          <small className="mt-2 block text-[10px] text-muted">
                            {order.delivery === "shipping"
                              ? "Envio por CEP"
                              : "Retirada na loja"}
                          </small>
                        </div>
                        <strong className="ml-auto text-base text-brand">
                          {money(order.total)}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-line pt-4 text-[9px] text-muted md:text-[10px]">
                        <span>
                          Pagamento{" "}
                          {order.payment === "pix" ? "Pix" : "com cartão"} •
                          simulado
                        </span>
                        <Link
                          className="inline-flex items-center gap-2 p-0 leading-relaxed font-semibold text-brand hover:underline hover:underline-offset-4 text-[11px]"
                          href={`/pedido/${order.id}`}
                        >
                          Ver pedido <ArrowRight size={15} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Package size={30} />}
                  title="Sua história de encantos começa aqui."
                >
                  Ao concluir uma compra simulada, o pedido aparecerá neste
                  cantinho.
                </EmptyState>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
