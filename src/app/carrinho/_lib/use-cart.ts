'use client'
import { getContactSelection } from '@/lib/domain/contact'
import { useStore } from '@/lib/state/store-context'

export function useCart() {
    const { state, quantity, ready } = useStore()
    return { quantity, ready, ...getContactSelection(state.products, state.cart) }
}
