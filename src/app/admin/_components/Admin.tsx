'use client'
import { ArrowLeft, LayoutDashboard, Pencil, Plus, RotateCcw, Search, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Photo } from '@/components/product/Photo'

import { useAdmin } from '../_lib/use-admin'
import { Modal } from './Modal'
import { ProductEditor } from './ProductEditor'
import { StatsCard } from './StatsCard'

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
        products,
        stats,
        totalProducts,
        changeTab,
        toggleProduct,
        closeReset,
        restoreDemo,
    } = useAdmin()
    return (
        <div className="bg-surface">
            <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-5 pt-3 md:pt-5">
                    <div>
                        <span className="inline-flex items-center gap-2 text-[9px] leading-relaxed font-semibold tracking-[.18em] text-brand uppercase">
                            <Sparkles size={14} /> ESPAÇO DA DEBINATOS
                        </span>
                        <h1 className="mt-3 mb-2.5 text-[28px] md:text-[34px]">Olá, vamos cuidar da loja?</h1>
                        <p className="text-xs text-muted">Seu painel de administração.</p>
                    </div>
                    <Link
                        className="inline-flex items-center justify-center gap-3 rounded-lg border leading-snug font-semibold transition hover:-translate-y-px disabled:translate-y-0 border-[#d7bbb0] bg-transparent text-brand hover:border-brand hover:bg-[#fff4ec] min-h-10 px-4 py-2.5 text-[11px]"
                        href="/"
                    >
                        <ArrowLeft size={16} /> Ver a loja
                    </Link>
                </div>
                <div className="mb-7 flex items-start gap-3 rounded-lg border border-[#edddcb] bg-[#f5ebdf] px-4 py-3.5 text-[#77563e] md:items-center">
                    <ShieldCheck size={21} />
                    <p className="text-[10px] leading-relaxed md:text-[11px]">
                        <strong className="font-medium">Armazenamento local.</strong> Produtos e fotos ficam salvos neste navegador.
                    </p>
                </div>
                <nav className="mb-7 flex flex-wrap items-center gap-1 border-b border-[#e3d6c8] md:gap-2" aria-label="Painel administrativo">
                    <button
                        className="flex items-center gap-2 border-b-2 border-transparent px-3 py-3.5 text-[11px] text-muted md:px-4 md:text-xs data-[selected=true]:border-brand data-[selected=true]:text-brand"
                        data-selected={tab === 'visao'}
                        onClick={() => changeTab('visao')}
                    >
                        <LayoutDashboard size={18} /> Visão geral
                    </button>
                    <button
                        className="flex items-center gap-2 border-b-2 border-transparent px-3 py-3.5 text-[11px] text-muted md:px-4 md:text-xs data-[selected=true]:border-brand data-[selected=true]:text-brand"
                        data-selected={tab === 'produtos'}
                        onClick={() => changeTab('produtos')}
                    >
                        <ShoppingBag size={18} /> Produtos
                    </button>
                    <button
                        className="flex items-center gap-2 border-b-2 border-transparent py-3.5 text-muted md:text-xs ml-auto px-0 text-[10px] md:text-[10px] max-md:basis-full max-md:justify-end max-md:[border-top:1px_solid_var(--color-line)]"
                        onClick={() => setResetOpen(true)}
                    >
                        <RotateCcw size={16} /> Restaurar dados iniciais
                    </button>
                </nav>
                {tab === 'visao' ? (
                    <>
                        <div className="mb-7 grid grid-cols-2 gap-3.5 lg:gap-5">
                            <StatsCard
                                icon={<ShoppingBag size={22} />}
                                label="Produtos ativos"
                                value={stats.activeProducts}
                                hint="Encantos disponíveis na vitrine"
                            />
                            <StatsCard icon={<ShieldCheck size={22} />} label="Estoque baixo" value={stats.lowStock} hint="Produtos com até 3 unidades" />
                        </div>
                        <div className="grid items-start gap-6">
                            <section className="rounded-xl border border-line bg-white p-8 text-center">
                                <img className="mx-auto mb-5 size-25 rounded-full" src="/images/marca-debinatos.jpg" alt="Mascote Debinatos" />
                                <h2 className="mb-6 items-center gap-3 text-xl block">Mais um encanto na vitrine?</h2>
                                <p className="text-[11px] text-muted">Adicione produtos, escolha fotos e deixe a loja com a sua cara.</p>
                                <button
                                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 mt-4 "
                                    onClick={() => setEditor(null)}
                                >
                                    <Plus size={17} /> Cadastrar produto
                                </button>
                            </section>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h2 className="mb-2 text-[27px]">Seus produtos</h2>
                                <span className="text-xs text-muted text-[11px]">{totalProducts} produtos no catálogo local</span>
                            </div>
                            <button
                                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug  font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0"
                                onClick={() => setEditor(null)}
                            >
                                <Plus size={18} /> Novo produto
                            </button>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1 focus-within:ring-2 focus-within:ring-brand/20 mb-6 max-w-125">
                            <Search className="size-5 text-muted" size={19} />
                            <input
                                className="min-w-0 flex-1 border-0 bg-transparent px-2 text-xs focus:ring-0"
                                aria-label="Buscar produtos no painel"
                                placeholder="Buscar produto por nome…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="rounded-xl border border-line bg-white overflow-x-auto p-0">
                            <table className="w-full border-collapse text-left text-[11px] whitespace-nowrap">
                                <thead>
                                    <tr>
                                        <th className="border-b border-line bg-[#fdfbf7] px-5 py-4 text-[10px] font-medium text-muted">Produto</th>
                                        <th className="border-b border-line bg-[#fdfbf7] px-5 py-4 text-[10px] font-medium text-muted">Categoria</th>
                                        <th className="border-b border-line bg-[#fdfbf7] px-5 py-4 text-[10px] font-medium text-muted">Estoque</th>
                                        <th className="border-b border-line bg-[#fdfbf7] px-5 py-4 text-[10px] font-medium text-muted">Visibilidade</th>
                                        <th className="border-b border-line bg-[#fdfbf7] px-5 py-4 text-[10px] font-medium text-muted">
                                            <span className="sr-only">Ações</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p) => (
                                        <tr className="group/tr" key={p.id}>
                                            <td className="border-b border-[#f0e8de] px-5 py-4 last:px-2.5 group-last/tr:border-0">
                                                <div className="flex items-center gap-3">
                                                    <Photo className="h-12 w-10 rounded object-cover" source={p.images[0]} alt="" />
                                                    <strong className="text-[11px] font-medium">{p.name}</strong>
                                                </div>
                                            </td>
                                            <td className="border-b border-[#f0e8de] px-5 py-4 last:px-2.5 group-last/tr:border-0">{p.category}</td>
                                            <td className="border-b border-[#f0e8de] px-5 py-4 last:px-2.5 group-last/tr:border-0">
                                                <span className={p.stock <= 3 ? 'text-brand' : undefined}>{p.stock} un.</span>
                                            </td>
                                            <td className="border-b border-[#f0e8de] px-5 py-4 last:px-2.5 group-last/tr:border-0">
                                                <button
                                                    className="group/status-toggle inline-flex items-center gap-2 rounded-full bg-[#f3efea] px-2.5 py-1.5 text-[10px] text-muted aria-pressed:bg-[#edf2e6] aria-pressed:text-leaf"
                                                    aria-label={`${p.active ? 'Desativar' : 'Ativar'} ${p.name}`}
                                                    aria-pressed={p.active}
                                                    onClick={() => toggleProduct(p)}
                                                >
                                                    <span className="size-1 rounded-full bg-muted group-aria-pressed/status-toggle:bg-leaf" />
                                                    {p.active ? 'Ativo' : 'Inativo'}
                                                </button>
                                            </td>
                                            <td className="border-b border-[#f0e8de] px-5 py-4 last:px-2.5 group-last/tr:border-0">
                                                <button
                                                    className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full transition hover:bg-cream"
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
                            {!products.length && <p className="p-8 text-center text-xs text-muted">Nenhum produto encontrado.</p>}
                        </div>
                    </>
                )}
            </div>
            {editor !== undefined && <ProductEditor product={editor} close={() => setEditor(undefined)} />}
            {resetOpen && (
                <Modal title="Restaurar os dados iniciais?" close={closeReset}>
                    <div className="p-6 md:p-8">
                        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-cream text-brand">
                            <RotateCcw size={28} />
                        </div>
                        <p className="mb-4 text-xs text-muted">
                            Isso remove suas alterações de produtos, fotos, estoque, perfil, favoritos e carrinho deste navegador.
                        </p>
                        <p className="mb-4 text-xs text-muted">O catálogo inicial será recuperado. Esta ação não pode ser desfeita.</p>
                        <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
                            <button
                                className="inline-flex items-center justify-center gap-3 rounded-lg border p-3 leading-snug font-semibold transition hover:-translate-y-px disabled:translate-y-0 border-[#d7bbb0] bg-transparent text-brand hover:border-brand hover:bg-[#fff4ec] min-h-11  text-[10px] md:px-4 md:text-[11px]"
                                disabled={resetting}
                                onClick={() => setResetOpen(false)}
                            >
                                Manter meus dados
                            </button>
                            <button
                                className="inline-flex items-center justify-center gap-3 rounded-lg border border-brand bg-brand p-3 leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 min-h-11  text-[10px] md:px-4 md:text-[11px]"
                                disabled={resetting}
                                onClick={restoreDemo}
                            >
                                {resetting ? 'Restaurando…' : 'Restaurar dados iniciais'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
