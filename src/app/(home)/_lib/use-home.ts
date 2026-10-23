'use client'
import { homeFavorites } from '@/lib/domain/highlights'
import { useStore } from '@/lib/state/store-context'

export function useHome() {
    const { state } = useStore()
    const featured = homeFavorites(state.products)

    return { featured }
}
