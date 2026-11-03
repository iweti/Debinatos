import { reconcileVisitor } from '../domain/cart'
import type { Product, VisitorState } from '../types/store'

export const VISITOR_STORAGE_KEY = 'debinatos-visitor-v1'
export const VISITOR_LEGACY_KEYS = ['debinatos-demo-v2', 'debinatos-demo-v1']

export function emptyVisitor(): VisitorState {
    return { cart: [], favorites: [] }
}

export function readVisitor(): { state: VisitorState; warning?: string } {
    try {
        const current = localStorage.getItem(VISITOR_STORAGE_KEY)
        const raw = current ?? localStorage.getItem(VISITOR_LEGACY_KEYS[0]) ?? localStorage.getItem(VISITOR_LEGACY_KEYS[1])
        if (!raw) return { state: emptyVisitor() }
        const value: unknown = JSON.parse(raw)
        if (!value || typeof value !== 'object') throw new Error('Formato inválido')
        const { cart, favorites } = value as Record<string, unknown>
        if (!Array.isArray(cart) || !Array.isArray(favorites)) throw new Error('Formato inválido')
        const state: VisitorState = {
            cart: cart
                .filter(
                    (item) => item && typeof item === 'object' && typeof item.productId === 'string' && Number.isSafeInteger(item.quantity) && item.quantity > 0
                )
                .map((item) => ({ productId: item.productId, quantity: item.quantity })),
            favorites: favorites.filter((id): id is string => typeof id === 'string'),
        }
        if (current !== null) return { state }
        try {
            writeVisitor(state)
            return { state }
        } catch {
            return { state, warning: 'Seu carrinho e favoritos estão disponíveis, mas não foi possível salvá-los neste navegador.' }
        }
    } catch {
        return { state: emptyVisitor(), warning: 'Não foi possível recuperar seu carrinho e favoritos. Você pode continuar navegando.' }
    }
}

export function writeVisitor(state: VisitorState) {
    try {
        localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify({ cart: state.cart, favorites: state.favorites }))
    } catch {
        throw new Error('Não foi possível salvar no navegador. Verifique o espaço disponível e permita o armazenamento local.')
    }
}

export function readVisitorForCatalog(products: Product[], catalogError: boolean): { state: VisitorState; warning?: string } {
    const loaded = readVisitor()
    const state = reconcileVisitor(loaded.state, products, catalogError)
    if (state === loaded.state) return loaded
    try {
        writeVisitor(state)
        return { state, warning: loaded.warning }
    } catch (error) {
        return { state, warning: error instanceof Error ? error.message : 'Não foi possível salvar no navegador.' }
    }
}
