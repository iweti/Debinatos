'use client'
import { Check, Plus, ShoppingBag } from 'lucide-react'

import { useStore } from '@/lib/state/store-context'
import type { Product } from '@/lib/types/store'

import styles from './ActionFeedback.module.css'
import { useActionFeedback } from './use-action-feedback'

export function AddToCartButton({ product, quantity = 1, compact = false }: { product: Pick<Product, 'id' | 'name'>; quantity?: number; compact?: boolean }) {
    const { add, ready } = useStore()
    const { feedback, confirm, reset } = useActionFeedback(2000)

    const handleAdd = () => {
        if (!add(product.id, quantity)) {
            reset()
            return
        }
        confirm()
    }
    const added = feedback > 0
    return (
        <button
            type="button"
            className={
                compact
                    ? 'relative grid size-7 shrink-0 self-end place-items-center rounded-full border border-[#e8d8cc] text-brand transition hover:border-brand hover:bg-brand hover:text-white md:size-7.5 data-[added=true]:border-leaf data-[added=true]:bg-leaf data-[added=true]:text-white'
                    : 'relative inline-flex min-h-12 flex-1 basis-full items-center justify-center gap-3 rounded-lg border border-brand bg-brand p-3 text-[11px] leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 sm:basis-auto md:basis-full lg:basis-auto data-[added=true]:border-leaf data-[added=true]:bg-leaf'
            }
            data-added={added}
            disabled={!ready}
            onClick={handleAdd}
            aria-label={added ? `${product.name} adicionado ao carrinho. Adicionar mais` : `Adicionar ${product.name} ao carrinho`}
        >
            {added ? (
                <span key={feedback} className={`${styles.icon} ${styles.cartIcon}`} aria-hidden="true">
                    <Check size={compact ? 19 : 18} />
                </span>
            ) : compact ? (
                <Plus size={19} aria-hidden="true" />
            ) : (
                <ShoppingBag size={18} aria-hidden="true" />
            )}
            {!compact && (added ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho')}
            {added && <span key={`ring-${feedback}`} className={`${styles.ring} ${styles.cartRing}`} aria-hidden="true" />}
        </button>
    )
}
