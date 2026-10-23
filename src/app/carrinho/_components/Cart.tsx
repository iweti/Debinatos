'use client'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

import { Photo } from '@/components/product/Photo'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loading } from '@/components/ui/Loading'
import { PageHeading } from '@/components/ui/PageHeading'
import { Quantity } from '@/components/ui/Quantity'

import { useCart } from '../_lib/use-cart'
import { CartContactAction } from './CartContactAction'

export function Cart({ phone }: { phone?: string }) {
    const { quantity, ready, rows, itemCount } = useCart()
    if (!ready) return <Loading />
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Carrinho' }]} />
            <PageHeading eyebrow="SEUS PEQUENOS ACHADOS" title="Um carrinho de encantos">
                Escolha seus produtos e envie sua seleção pelo WhatsApp para combinar os detalhes.
            </PageHeading>
            {!rows.length ? (
                <EmptyState icon={<ShoppingBag size={32} />} title="Seu carrinho está esperando um encanto.">
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
                                    <Link className="h-24 w-19 shrink-0 md:h-28 md:w-24" href={`/produto/${item.productId}`}>
                                        <Photo
                                            className="size-full rounded-lg object-cover"
                                            source={product?.images[0]?.url ?? ''}
                                            alt={`Foto de ${product?.name ?? 'Produto indisponível'}`}
                                        />
                                    </Link>
                                    <div className="min-w-0 flex-1 pb-9 md:pb-0">
                                        <span className="inline-flex items-center gap-2 leading-relaxed font-semibold text-brand uppercase text-[7px] tracking-wider md:text-[8px]">
                                            {product?.category ?? 'Produto indisponível'}
                                        </span>
                                        <Link href={`/produto/${item.productId}`}>
                                            <h3 className="my-1.5 font-serif text-[15px] font-medium md:text-[17px]">{product?.name ?? 'Produto removido'}</h3>
                                        </Link>
                                        {!product?.active && (
                                            <span className="my-3 leading-relaxed block text-[11px] text-muted">
                                                Produto fora do catálogo. Remova o item do carrinho.
                                            </span>
                                        )}
                                        <button
                                            className="pt-2 text-[10px] text-brand underline underline-offset-4"
                                            onClick={() => quantity(item.productId, 0)}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                    <div className="absolute right-0 bottom-4 left-22 flex items-center justify-between gap-3 md:static md:flex-col md:items-end md:gap-5">
                                        <Quantity
                                            compact
                                            value={item.quantity}
                                            disabled={!product?.active}
                                            onChange={(count) => quantity(item.productId, count)}
                                            name={product?.name ?? 'produto'}
                                        />
                                    </div>
                                </article>
                            ))}
                        </div>
                        <Link
                            className="inline-flex items-center gap-2 p-0 text-xs/relaxed  font-semibold text-brand hover:underline hover:underline-offset-4 my-6"
                            href="/catalogo"
                        >
                            <ArrowLeft size={16} /> Continuar escolhendo
                        </Link>
                    </div>
                    <aside className="rounded-xl border border-line p-5 md:p-7 bg-surface lg:sticky lg:top-6">
                        <span className="inline-flex items-center gap-2 leading-relaxed font-semibold tracking-[.18em] text-brand uppercase mb-3 text-[8px]">
                            UM POUCO MAIS PERTO
                        </span>
                        <h2 className="flex items-center gap-3 mb-7 text-[23px]">Resumo do carrinho</h2>
                        <p className="mb-5 text-xs text-muted">
                            {itemCount} {itemCount === 1 ? 'unidade selecionada' : 'unidades selecionadas'}
                        </p>
                        <p className="mb-6 text-xs text-muted">
                            A mensagem incluirá os nomes e as quantidades dos produtos. Disponibilidade, entrega e demais detalhes serão combinados diretamente
                            com a Debinatos.
                        </p>
                        <CartContactAction phone={phone} />
                    </aside>
                </div>
            )}
        </div>
    )
}
