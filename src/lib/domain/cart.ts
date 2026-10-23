import type { StoreState } from '../types/store'

export function addToCart(state: StoreState, productId: string, quantity = 1): StoreState {
    const product = state.products.find((p) => p.id === productId && p.active)
    if (!product) throw new Error('Este produto não está mais disponível.')
    const existing = state.cart.find((i) => i.productId === productId)?.quantity ?? 0
    if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isSafeInteger(existing + quantity)) throw new Error('Quantidade inválida.')
    return {
        ...state,
        cart: existing
            ? state.cart.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i))
            : [...state.cart, { productId, quantity }],
    }
}

export function setQuantity(state: StoreState, productId: string, quantity: number): StoreState {
    if (!Number.isSafeInteger(quantity) || quantity < 0) throw new Error('Quantidade inválida.')
    if (quantity === 0)
        return {
            ...state,
            cart: state.cart.filter((i) => i.productId !== productId),
        }
    const product = state.products.find((p) => p.id === productId && p.active)
    if (!product) throw new Error('Este produto não está mais disponível.')
    return {
        ...state,
        cart: state.cart.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    }
}
