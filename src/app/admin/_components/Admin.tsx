"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Photo } from "@/components/product/Photo";
import { dateLabel, money } from "@/lib/utils/format";
import { STATUS_LABELS } from "@/lib/constants/store";
import { StatusBadge } from "@/components/orders/StatusBadge";
import type { OrderStatus } from "@/lib/types/store";
import { Modal } from "./Modal";
import { ProductEditor } from "./ProductEditor";
import { useAdmin } from "../_lib/use-admin";
import { StatsCard } from "./StatsCard";

export function Admin() {
  const {
    tab,
    editor,
    setEditor,
    resetOpen,
    setResetOpen,
    resetting,
    search,
    setSearch,
    orderFilter,
    setOrderFilter,
    products,
    orders,
    stats,
    latestOrders,
    totalProducts,
    changeTab,
    toggleProduct,
    changeOrderStatus,
    closeReset,
    restoreDemo,
  } = useAdmin();
  return (
    <div className="bg-surface">
      <div className="page-container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">
              <Sparkles size={14} /> ESPAÇO DA DEBINATOS
            </span>
            <h1>Olá, vamos cuidar da loja?</h1>
            <p>Seu painel de administração demonstrativo.</p>
          </div>
          <Link className="button outline small" href="/">
            <ArrowLeft size={16} /> Ver a loja
          </Link>
        </div>
        <div className="admin-demo">
          <ShieldCheck size={21} />
          <p>
            <strong>Painel aberto para demonstração.</strong> Produtos, fotos e
            pedidos ficam apenas neste navegador. Não há autenticação
            administrativa real.
          </p>
        </div>
        <div
          className="admin-tabs"
          role="navigation"
          aria-label="Painel administrativo"
        >
          <button
            className={tab === "visao" ? "selected" : ""}
            onClick={() => changeTab("visao")}
          >
            <LayoutDashboard size={18} /> Visão geral
          </button>
          <button
            className={tab === "produtos" ? "selected" : ""}
            onClick={() => changeTab("produtos")}
          >
            <ShoppingBag size={18} /> Produtos
          </button>
          <button
            className={tab === "pedidos" ? "selected" : ""}
            onClick={() => changeTab("pedidos")}
          >
            <Package size={18} /> Pedidos
          </button>
          <button className="reset-button" onClick={() => setResetOpen(true)}>
            <RotateCcw size={16} /> Restaurar demonstração
          </button>
        </div>
        {tab === "visao" ? (
          <>
            <div className="stats-grid mb-7 grid grid-cols-2 gap-3.5 lg:grid-cols-4 lg:gap-5">
              <StatsCard
                icon={<ShoppingBag size={22} />}
                label="Produtos ativos"
                value={stats.activeProducts}
                hint="Encantos disponíveis na vitrine"
              />
              <StatsCard
                icon={<Package size={22} />}
                label="Pedidos simulados"
                value={stats.totalOrders}
                hint={<>{stats.pendingOrders} aguardando conclusão</>}
              />
              <StatsCard
                icon={<Sparkles size={22} />}
                label="Total de vendas simuladas"
                value={money(stats.revenue)}
                hint="Valores fictícios, sem cobranças"
              />
              <StatsCard
                icon={<ShieldCheck size={22} />}
                label="Estoque baixo"
                value={stats.lowStock}
                hint="Produtos com até 3 unidades"
              />
            </div>
            <div className="admin-overview grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
              <section className="panel">
                <div className="section-heading compact">
                  <h2>Últimos pedidos</h2>
                  <button
                    className="text-link"
                    onClick={() => changeTab("pedidos")}
                  >
                    Ver todos <ArrowRight size={15} />
                  </button>
                </div>
                {latestOrders.map((order) => (
                  <div className="overview-order" key={order.id}>
                    <div>
                      <strong>{order.id}</strong>
                      <small>
                        {order.customerName} • {dateLabel(order.createdAt)}
                      </small>
                    </div>
                    <StatusBadge order={order} />
                    <strong>{money(order.total)}</strong>
                  </div>
                ))}
              </section>
              <section className="panel overview-note hidden lg:block">
                <img
                  src="/images/marca-debinatos.jpg"
                  alt="Mascote Debinatos"
                />
                <h2>Mais um encanto na vitrine?</h2>
                <p>
                  Adicione produtos, escolha fotos e deixe a loja com a sua
                  cara.
                </p>
                <button className="button" onClick={() => setEditor(null)}>
                  <Plus size={17} /> Cadastrar produto
                </button>
              </section>
            </div>
          </>
        ) : tab === "produtos" ? (
          <>
            <div className="admin-toolbar">
              <div>
                <h2>Seus produtos</h2>
                <span className="muted">
                  {totalProducts} produtos no catálogo local
                </span>
              </div>
              <button className="button" onClick={() => setEditor(null)}>
                <Plus size={18} /> Novo produto
              </button>
            </div>
            <div className="catalog-search admin-search">
              <Search size={19} />
              <input
                aria-label="Buscar produtos no painel"
                placeholder="Buscar produto por nome…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="table-wrap panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Visibilidade</th>
                    <th>
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="table-product">
                          <Photo source={p.images[0]} alt="" />
                          <strong>{p.name}</strong>
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>{money(p.price)}</td>
                      <td>
                        <span className={p.stock <= 3 ? "low-stock" : ""}>
                          {p.stock} un.
                        </span>
                      </td>
                      <td>
                        <button
                          className={`status-toggle ${p.active ? "is-active" : ""}`}
                          aria-label={`${p.active ? "Desativar" : "Ativar"} ${p.name}`}
                          aria-pressed={p.active}
                          onClick={() => toggleProduct(p)}
                        >
                          <span />
                          {p.active ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td>
                        <button
                          className="icon-button"
                          aria-label={`Editar ${p.name}`}
                          onClick={() => setEditor(p)}
                        >
                          <Pencil size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!products.length && (
                <p className="table-empty">Nenhum produto encontrado.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="admin-toolbar">
              <div>
                <h2>Pedidos da loja</h2>
                <p className="muted">
                  Atualize o andamento e acompanhe a mudança no perfil.
                </p>
              </div>
              <label className="admin-order-filter">
                <span className="sr-only">Filtrar pedidos por andamento</span>
                <select
                  aria-label="Filtrar pedidos por andamento"
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                >
                  <option value="">Todos os andamentos</option>
                  {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <option key={status} value={status}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {orders.length ? (
              <div className="grid items-start gap-5 md:grid-cols-2">
                {orders.map((order) => (
                  <article className="panel" key={order.id}>
                    <div className="order-card-header">
                      <div>
                        <strong>{order.id}</strong>
                        <small>
                          {dateLabel(order.createdAt)} • {order.customerName}
                        </small>
                      </div>
                      <StatusBadge order={order} />
                    </div>
                    <div className="admin-order-items">
                      {order.items.map((item) => (
                        <div key={item.productId}>
                          <Photo source={item.image} alt="" />
                          <span>
                            {item.quantity} × {item.name}
                          </span>
                          <strong>{money(item.quantity * item.price)}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="admin-order-address">
                      <strong>
                        {order.delivery === "shipping"
                          ? "Envio por CEP"
                          : "Retirada na loja"}
                      </strong>
                      <span>
                        {order.address
                          ? `${order.address.street}, ${order.address.number} • ${order.address.city}/${order.address.state} • ${order.address.cep}`
                          : "Endereço fictício da demonstração"}
                      </span>
                    </div>
                    <div className="admin-order-bottom">
                      <span>
                        Total simulado <strong>{money(order.total)}</strong>
                      </span>
                      <label>
                        Andamento{" "}
                        <select
                          aria-label={`Andamento do pedido ${order.id}`}
                          value={order.status}
                          onChange={(e) =>
                            changeOrderStatus(
                              order.id,
                              e.target.value as OrderStatus,
                            )
                          }
                        >
                          <option value="received">Recebido</option>
                          <option value="preparing">Em preparação</option>
                          {order.delivery === "shipping" ? (
                            <option value="sent">Enviado</option>
                          ) : (
                            <option value="ready">Pronto para retirada</option>
                          )}
                          <option value="completed">Concluído</option>
                        </select>
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Package size={30} />}
                title="Nenhum pedido por aqui."
                action={
                  <button
                    className="button outline"
                    onClick={() => setOrderFilter("")}
                  >
                    Mostrar todos os pedidos
                  </button>
                }
              >
                Experimente outro andamento ou crie um pedido na loja.
              </EmptyState>
            )}
          </>
        )}
      </div>
      {editor !== undefined && (
        <ProductEditor product={editor} close={() => setEditor(undefined)} />
      )}
      {resetOpen && (
        <Modal title="Restaurar a demonstração?" close={closeReset}>
          <div className="reset-content">
            <div className="empty-icon">
              <RotateCcw size={28} />
            </div>
            <p>
              Isso remove suas alterações de produtos, fotos, estoque, perfil,
              favoritos, carrinho e pedidos deste navegador.
            </p>
            <p>
              O catálogo e o pedido de exemplo serão recuperados. Esta ação não
              pode ser desfeita.
            </p>
            <div className="modal-actions">
              <button
                className="button outline"
                disabled={resetting}
                onClick={() => setResetOpen(false)}
              >
                Manter meus dados
              </button>
              <button
                className="button"
                disabled={resetting}
                onClick={restoreDemo}
              >
                {resetting ? "Restaurando…" : "Restaurar demonstração"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
