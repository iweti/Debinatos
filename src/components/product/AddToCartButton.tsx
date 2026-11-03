'use client'
import { Check, Plus, ShoppingBag } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useStore } from '@/lib/state/store-context'
import type { Product } from '@/lib/types/store'

export function AddToCartButton({ product, quantity = 1, compact = false }: { product: Pick<Product, 'id' | 'name'>; quantity?: number; compact?: boolean }) {
    const { add, ready } = useStore()
    const [confirmation, setConfirmation] = useState(0)
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    useEffect(
        () => () => {
            if (timeout.current) clearTimeout(timeout.current)
        },
        []
    )

    const handleAdd = () => {
        if (timeout.current) clearTimeout(timeout.current)
        if (!add(product.id, quantity)) {
            setConfirmation(0)
            return
        }
        setConfirmation((previous) => previous + 1)
        timeout.current = setTimeout(() => setConfirmation(0), 2000)
    }
    const added = confirmation > 0
    return (
        <button
            type="button"
            className={
                compact
                    ? 'grid size-7 shrink-0 self-end place-items-center rounded-full border border-[#e8d8cc] text-brand transition hover:border-brand hover:bg-brand hover:text-white md:size-7.5 data-[added=true]:border-leaf data-[added=true]:bg-leaf data-[added=true]:text-white'
                    : 'inline-flex min-h-12 flex-1 basis-full items-center justify-center gap-3 rounded-lg border border-brand bg-brand p-3 text-[11px] leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 sm:basis-auto md:basis-full lg:basis-auto data-[added=true]:border-leaf data-[added=true]:bg-leaf'
            }
            data-added={added}
            disabled={!ready}
            onClick={handleAdd}
            aria-label={added ? `${product.name} adicionado ao carrinho. Adicionar mais` : `Adicionar ${product.name} ao carrinho`}
        >
            {added ? (
                <span key={confirmation} className="motion-safe:animate-[cart-added_0.25s_ease-out]" aria-hidden="true">
                    <Check size={compact ? 19 : 18} />
                </span>
            ) : compact ? (
                <Plus size={19} aria-hidden="true" />
            ) : (
                <ShoppingBag size={18} aria-hidden="true" />
            )}
            {!compact && (added ? 'Adicionado ao carrinho' : 'Adicionar ao carrinho')}
        </button>
    )
}
