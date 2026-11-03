'use client'
import { Heart } from 'lucide-react'

import { useStore } from '@/lib/state/store-context'
import type { Product } from '@/lib/types/store'

import styles from './ActionFeedback.module.css'
import { useActionFeedback } from './use-action-feedback'

export function FavoriteButton({ product, compact = false }: { product: Pick<Product, 'id' | 'name'>; compact?: boolean }) {
    const { state, ready, favorite } = useStore()
    const saved = state.favorites.includes(product.id)
    const { feedback, confirm, reset } = useActionFeedback(600)
    const handleFavorite = () => {
        if (favorite(product.id) && !saved) confirm()
        else reset()
    }

    return (
        <button
            type="button"
            className={
                compact
                    ? 'absolute top-2 right-2 grid size-7 place-items-center rounded-full border border-white/50 bg-[#fffef9ef] transition hover:scale-110 md:size-8 aria-pressed:text-brand'
                    : 'relative ml-auto inline-flex h-11 w-10 shrink-0 items-center justify-center rounded-lg border border-[#dfd4c8] transition hover:bg-cream aria-pressed:text-brand'
            }
            disabled={!ready}
            onClick={handleFavorite}
            aria-label={`${saved ? 'Remover' : 'Salvar'} ${product.name}${saved ? ' dos favoritos' : ' nos favoritos'}`}
            aria-pressed={saved}
        >
            <span key={feedback} className={`${styles.icon} ${feedback && saved ? styles.favoriteIcon : ''}`} aria-hidden="true">
                <Heart className={compact ? 'size-4' : undefined} size={compact ? 18 : 21} fill={saved ? 'currentColor' : 'none'} />
            </span>
            {!!feedback && saved && <span key={`ring-${feedback}`} className={`${styles.ring} ${styles.favoriteRing}`} aria-hidden="true" />}
        </button>
    )
}
