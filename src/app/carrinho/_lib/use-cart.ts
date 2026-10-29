'use client'
import { getCartTotals } from '@/lib/domain/cart'
import { getContactSelection } from '@/lib/domain/contact'
import { useStore } from '@/lib/state/store-context'

export function useCart() {
    const { state, quantity, ready } = useStore()
    return { quantity, ready, ...getContactSelection(state.products, state.cart), ...getCartTotals(state.products, state.cart) }
}
