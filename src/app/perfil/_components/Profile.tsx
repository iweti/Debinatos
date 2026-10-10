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
      <div className="page-container">
        <LoginPanel
          next={`/perfil?aba=${tab === "dados" ? "dados" : "pedidos"}`}
        />
      </div>
    );
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "Meu perfil" }]} />
      <PageHeading
        eyebrow="BEM-VINDA AO SEU CANTINHO"
        title={`Olá, ${profile.name.split(" ")[0]}!`}
      >
        Seus achados, seus pedidos e seus pequenos encantos.
      </PageHeading>
      <div className="grid items-start gap-7 md:grid-cols-[210px_minmax(0,1fr)] md:gap-9">
        <aside className="profile-sidebar">
          <div className="profile-card">
            <span className="avatar large">
              {profile.name.slice(0, 1).toUpperCase()}
            </span>
            <strong>{profile.name}</strong>
            <small>Perfil de demonstração</small>
          </div>
          <nav aria-label="Navegação do perfil">
            <button
              className={tab === "pedidos" ? "selected" : ""}
              onClick={() => changeTab("pedidos")}
            >
              <Package size={19} /> Meus pedidos <span>{orders.length}</span>
            </button>
            <Link href="/favoritos">
              <Heart size={19} /> Itens salvos <span>{favoriteCount}</span>
            </Link>
            <button
              className={tab === "dados" ? "selected" : ""}
              onClick={() => changeTab("dados")}
            >
              <Pencil size={18} /> Meus dados
            </button>
            <button onClick={logout}>
              <LogOut size={18} /> Sair do perfil
            </button>
          </nav>
        </aside>
        <section className="profile-content">
          {tab === "dados" ? (
            <form className="panel profile-form" onSubmit={save}>
              <h2>Meus dados</h2>
              <p className="form-hint">
                Use apenas dados fictícios. As informações ficam neste
                navegador.
              </p>
              <label htmlFor="profile-name">
                Nome
                <input
                  id="profile-name"
                  value={name}
                  required
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <h3>
                <MapPin size={18} /> Endereço de demonstração
              </h3>
              <AddressFields
                address={address}
                setAddress={setAddress}
                prefix="profile"
              />
              {error && (
                <p className="inline-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button" type="submit">
                Salvar meus dados <Check size={16} />
              </button>
            </form>
          ) : (
            <>
              <div className="section-heading compact">
                <h2>Meus pedidos</h2>
                <span className="muted">Compras simuladas</span>
              </div>
              {orders.length ? (
                <div className="flex flex-col gap-5">
                  {orders.map((order) => (
                    <article className="panel order-card" key={order.id}>
                      <div className="order-card-header">
                        <div>
                          <strong>Pedido {order.id}</strong>
                          <small>{dateLabel(order.createdAt)}</small>
                        </div>
                        <StatusBadge order={order} />
                      </div>
                      <div className="order-preview">
                        <div className="order-preview-images">
                          {order.items.slice(0, 3).map((item) => (
                            <Photo
                              key={item.productId}
                              source={item.image}
                              alt={`Imagem ilustrativa de ${item.name}`}
                            />
                          ))}
                        </div>
                        <div>
                          <strong>
                            {order.items.reduce((n, i) => n + i.quantity, 0)}{" "}
                            {order.items.reduce((n, i) => n + i.quantity, 0) ===
                            1
                              ? "item"
                              : "itens"}
                          </strong>
                          <small>
                            {order.delivery === "shipping"
                              ? "Envio por CEP"
                              : "Retirada na loja"}
                          </small>
                        </div>
                        <strong>{money(order.total)}</strong>
                      </div>
                      <div className="order-card-bottom">
                        <span>
                          Pagamento{" "}
                          {order.payment === "pix" ? "Pix" : "com cartão"} •
                          simulado
                        </span>
                        <Link
                          className="text-link"
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
