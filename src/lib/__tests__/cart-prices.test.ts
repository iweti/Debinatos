import { afterEach, describe, expect, it, vi } from 'vitest'

import { addToCart, getCartTotals, reconcileVisitor, setQuantity } from '../domain/cart'
import { getContactSelection } from '../domain/contact'
import { readVisitorForCatalog, VISITOR_STORAGE_KEY } from '../storage/visitor-state'
import { createStoreState } from './fixtures/store'

afterEach(() => vi.unstubAllGlobals())

describe('Totais do carrinho', () => {
    it('multiplica quantidades, soma e recalcula ao alterar ou remover itens', () => {
        const state = addToCart(addToCart(createStoreState(), 'produto-1', 2), 'produto-2')
        expect(getCartTotals(state.products, state.cart)).toMatchObject({
            rows: [{ subtotalCents: 3980n }, { subtotalCents: 2990n }],
            totalCents: 6970n,
        })
        const changed = setQuantity(state, 'produto-1', 1)
        expect(getCartTotals(changed.products, changed.cart).totalCents).toBe(4980n)
        const removed = setQuantity(changed, 'produto-2', 0)
        expect(getCartTotals(removed.products, removed.cart).totalCents).toBe(1990n)
        expect(getCartTotals(state.products, []).totalCents).toBe(0n)
    })

    it('usa o preço atual do catálogo sem alterar a mensagem do WhatsApp', () => {
        const state = addToCart(createStoreState(), 'produto-1', 3)
        const before = getContactSelection(state.products, state.cart).message
        state.products[0].priceCents = 10
        expect(getCartTotals(state.products, state.cart).totalCents).toBe(30n)
        expect(getContactSelection(state.products, state.cart).message).toBe(before)
        const raw = JSON.stringify(state.cart)
        expect(raw).not.toContain('price')
    })

    it('calcula com precisão mesmo quando a quantidade gera total maior que o limite seguro de number', () => {
        const state = addToCart(createStoreState(), 'produto-1', Number.MAX_SAFE_INTEGER)
        expect(getCartTotals(state.products, state.cart).totalCents).toBe(1990n * BigInt(Number.MAX_SAFE_INTEGER))
    })
})

describe('Reconciliação do carrinho com o catálogo', () => {
    it('remove produtos ausentes ou inativos, preservando favoritos e produtos ativos sem informação de estoque', () => {
        const state = createStoreState()
        state.products[0].active = false
        state.cart = [
            { productId: 'produto-1', quantity: 1 },
            { productId: 'removido', quantity: 2 },
            { productId: 'produto-3', quantity: 10 },
        ]
        state.favorites = ['produto-1', 'removido']
        const next = reconcileVisitor(state, state.products, false)
        expect(next.cart).toEqual([{ productId: 'produto-3', quantity: 10 }])
        expect(next.favorites).toEqual(state.favorites)
        expect(state.cart).toHaveLength(3)
        expect(getCartTotals(state.products, state.cart).totalCents).toBe(49900n)
        expect(reconcileVisitor(next, state.products, false)).toBe(next)
    })

    it('preserva o carrinho na falha do catálogo e limpa quando o catálogo vazio é válido', () => {
        const state = addToCart(createStoreState(), 'produto-1')
        expect(reconcileVisitor(state, [], true)).toBe(state)
        expect(reconcileVisitor(state, [], false).cart).toEqual([])
    })

    it('persiste a limpeza e aplica o mesmo fluxo ao receber dados de outra aba', () => {
        const state = addToCart(createStoreState(), 'produto-1')
        state.favorites = ['produto-1']
        const data = new Map([[VISITOR_STORAGE_KEY, JSON.stringify(state)]])
        vi.stubGlobal('localStorage', {
            getItem: (key: string) => data.get(key),
            setItem: (key: string, value: string) => data.set(key, value),
        })
        expect(readVisitorForCatalog([], true).state.cart).toEqual(state.cart)
        const loaded = readVisitorForCatalog([], false)
        expect(loaded.state).toEqual({ cart: [], favorites: ['produto-1'] })
        expect(JSON.parse(data.get(VISITOR_STORAGE_KEY) ?? 'null')).toEqual(loaded.state)
        data.set(VISITOR_STORAGE_KEY, JSON.stringify({ cart: [{ productId: 'removido', quantity: 1 }], favorites: [] }))
        expect(readVisitorForCatalog(state.products, false).state.cart).toEqual([])
    })

    it('mantém a limpeza em memória com aviso quando o navegador não permite salvar', () => {
        const state = addToCart(createStoreState(), 'produto-1')
        vi.stubGlobal('localStorage', {
            getItem: () => JSON.stringify(state),
            setItem: () => {
                throw new Error('QuotaExceededError')
            },
        })
        const loaded = readVisitorForCatalog([], false)
        expect(loaded.state.cart).toEqual([])
        expect(loaded.warning).toContain('Não foi possível salvar')
    })
})
