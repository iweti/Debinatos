'use client'
import Link from 'next/link'
import { Heart, Plus, Sparkles } from 'lucide-react'
import { money } from '@/lib/utils/format'
import type { Product } from '@/lib/types/store'
import { Photo } from '@/components/product/Photo'
import { useProductCard } from '@/lib/hooks/use-product-card'

export function ProductCard({ product }: { product: Product }) {
    const { saved, favorite, add } = useProductCard(product.id)
    return (
        <article className="group/product-card relative min-w-0">
            <div className="relative aspect-[.91] overflow-hidden rounded-lg bg-[#f5f1ec]">
                <Link className="block h-full" href={`/produto/${product.id}`} aria-label={`Ver ${product.name}`}>
                    <Photo
                        className="size-full object-cover transition-transform duration-500 group-hover/product-card:scale-[1.035]"
                        source={product.images[0]}
                        alt={`Foto de ${product.name}`}
                        loading="lazy"
                    />
                </Link>
                {product.badge && (
                    <span
                        className="absolute top-2.5 left-2 flex items-center gap-1 rounded bg-[#fff7ea] px-1.5 py-1 text-[7px] font-medium text-[#6e391e] md:top-3 md:left-3 md:px-2 md:py-1.5 md:text-[9px] data-[new=true]:bg-[#eef2e6] data-[new=true]:text-[#3e5e22]"
                        data-new={product.badge === 'Novidade'}
                    >
                        {product.badge === 'Queridinho' && <Sparkles size={12} />} {product.badge}
                    </span>
                )}
                {!product.stock && <span className="absolute inset-x-[20%] top-[45%] grid h-9 place-items-center bg-[#fffaf3ee] text-xs">Esgotado</span>}
                <button
                    className="absolute top-2 right-2 grid size-7 place-items-center rounded-full border border-white/50 bg-[#fffef9ef] transition hover:scale-110 md:size-8 aria-pressed:text-brand"
                    onClick={() => favorite(product.id)}
                    aria-label={`${saved ? 'Remover' : 'Salvar'} ${product.name}${saved ? ' dos favoritos' : ' nos favoritos'}`}
                    aria-pressed={saved}
                >
                    <Heart className="size-4" size={18} fill={saved ? 'currentColor' : 'none'} />
                </button>
            </div>
            <div className="pt-3 md:pt-4">
                <span className="text-[8px] text-muted md:text-[9px]">{product.category}</span>
                <Link href={`/produto/${product.id}`}>
                    <h3 className="mt-1 mb-2 font-serif text-[15px] font-medium tracking-tight hover:text-brand md:text-[17px]">{product.name}</h3>
                </Link>
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <strong className="text-xs font-semibold text-brand md:text-sm">{money(product.price)}</strong>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <del className="ml-1.5 text-[8px] text-muted md:text-[10px]">{money(product.originalPrice)}</del>
                        )}
                    </div>
                    <button
                        className="grid size-7 place-items-center rounded-full border border-[#e8d8cc] text-brand transition hover:border-brand hover:bg-brand hover:text-white md:size-7.5"
                        disabled={!product.stock}
                        onClick={() => add(product.id)}
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                    >
                        <Plus size={19} />
                    </button>
                </div>
                <small className="mt-1.5 block text-[7px] text-muted md:text-[9px]">Um detalhe para chamar de seu.</small>
            </div>
        </article>
    )
}
