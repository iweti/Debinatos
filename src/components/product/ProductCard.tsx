'use client'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'

import { AddToCartButton } from '@/components/product/AddToCartButton'
import { FavoriteButton } from '@/components/product/FavoriteButton'
import { Photo } from '@/components/product/Photo'
import { formatMoney } from '@/lib/domain/money'
import type { Product } from '@/lib/types/store'

import styles from './ProductCard.module.css'

export function ProductCard({ product }: { product: Product }) {
    return (
        <article className={`group/product-card relative min-w-0 ${styles.card}`}>
            <div className="relative aspect-[.91] overflow-hidden rounded-lg bg-[#f5f1ec]">
                <Link className="block h-full" href={`/produto/${product.id}`} aria-label={`Ver ${product.name}`}>
                    <Photo
                        className="size-full object-cover transition-transform duration-500 group-hover/product-card:scale-[1.035]"
                        source={product.images[0]?.url ?? ''}
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
                <FavoriteButton key={product.id} product={product} compact />
            </div>
            <div className="pt-3 md:pt-4">
                <span className={`${styles.category} text-muted`} title={product.category}>
                    {product.category}
                </span>
                <Link className="block" href={`/produto/${product.id}`} aria-label={`Ver ${product.name}`} title={product.name}>
                    <h3 className={`${styles.name} mt-1 mb-2 font-serif font-medium tracking-tight hover:text-brand`}>{product.name}</h3>
                </Link>
                <div className={styles.purchase}>
                    <p className={`${styles.price} font-semibold text-brand`}>{formatMoney(product.priceCents)}</p>
                    <AddToCartButton key={product.id} product={product} compact />
                </div>
                <small className={`${styles.tagline} mt-1.5 block text-muted`}>Um detalhe para chamar de seu.</small>
            </div>
        </article>
    )
}
