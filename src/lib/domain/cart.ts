import type { CartItem, Product, StoreState, VisitorState } from '../types/store'

export function reconcileVisitor(state: VisitorState, products: Product[], catalogError: boolean): VisitorState {
    if (catalogError) return state
    const active = new Set(products.filter((product) => product.active).map((product) => product.id))
    const cart = state.cart.filter((item) => active.has(item.productId))
    return cart.length === state.cart.length ? state : { ...state, cart }
}

export function getCartTotals(products: Product[], cart: CartItem[]) {
    const available = new Map(products.filter((product) => product.active).map((product) => [product.id, product]))
    const rows = cart.flatMap((item) => {
        const product = available.get(item.productId)
        if (!product || !Number.isSafeInteger(item.quantity) || item.quantity < 1) return []
        return [{ item, product, subtotalCents: BigInt(product.priceCents) * BigInt(item.quantity) }]
    })
    return { rows, totalCents: rows.reduce((total, row) => total + row.subtotalCents, 0n) }
}

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
