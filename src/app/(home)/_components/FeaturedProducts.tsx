'use client'

import { useMemo } from 'react'

import { homeFavorites } from '@/lib/domain/highlights'
import { useStore } from '@/lib/state/store-context'

import { FavoritesCarousel } from './FavoritesCarousel'

export function FeaturedProducts() {
    const { state } = useStore()
    const featured = useMemo(() => homeFavorites(state.products), [state.products])
    return featured.length ? <FavoritesCarousel products={featured} /> : <p className="text-xs text-muted">Novos encantos em breve. Explore nosso catálogo.</p>
}
