'use client'
import { unavailableFavoriteIds } from '@/lib/domain/favorites'
import { useStore } from '@/lib/state/store-context'

export function useFavorites() {
    const { state, ready, catalogError, removeUnavailableFavorites } = useStore()
    const products = state.products.filter((p) => p.active && state.favorites.includes(p.id))
    const unavailableCount = unavailableFavoriteIds(state.favorites, state.products, catalogError).length
    return { products, unavailableCount, ready, removeUnavailableFavorites }
}
