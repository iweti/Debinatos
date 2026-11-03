'use client'
import { useStore } from '@/lib/state/store-context'

export function useFavorites() {
    const { state } = useStore()
    const products = state.products.filter((p) => p.active && state.favorites.includes(p.id))
    const hasUnavailable = state.favorites.some((id) => !state.products.some((p) => p.id === id && p.active))
    return { products, hasUnavailable }
}
