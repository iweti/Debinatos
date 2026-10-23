import { afterEach, describe, expect, it, vi } from 'vitest'

import { addToCart, setQuantity } from '../domain/cart'
import { emptyVisitor, readVisitor, VISITOR_STORAGE_KEY, writeVisitor } from '../storage/visitor-state'
import { createStoreState } from './fixtures/store'

afterEach(() => vi.unstubAllGlobals())

describe('Carrinho de interesse', () => {
    it('acumula e altera quantidades acima do estoque cadastrado e permite remover um item', () => {
        const original = createStoreState()
        const first = original.products[0]
        const state = addToCart(addToCart(original, first.id, 2), first.id, first.stock + 1)
        expect(state.cart).toEqual([{ productId: first.id, quantity: first.stock + 3 }])
        expect(original.cart).toEqual([])
        expect(setQuantity(state, first.id, first.stock + 10).cart).toEqual([{ productId: first.id, quantity: first.stock + 10 }])
        expect(() => setQuantity(state, first.id, 1.5)).toThrow('Quantidade')
        expect(setQuantity(state, first.id, 0).cart).toEqual([])
    })
    it('permite produto sem estoque e bloqueia produto desativado e quantidades inválidas', () => {
        const state = createStoreState()
        expect(addToCart(state, 'produto-3', 10).cart).toEqual([{ productId: 'produto-3', quantity: 10 }])
        state.products[0].active = false
        expect(() => addToCart(state, state.products[0].id)).toThrow('disponível')
        expect(() => addToCart(state, state.products[1].id, -1)).toThrow('Quantidade')
        expect(() => addToCart(state, state.products[1].id, Infinity)).toThrow('Quantidade')
    })
})

describe('Persistência local', () => {
    it('persiste apenas favoritos e carrinho', () => {
        const state = {
            ...addToCart(createStoreState(), 'produto-1'),
            favorites: ['produto-1'],
        }
        const data = new Map<string, string>()
        vi.stubGlobal('localStorage', {
            getItem: (key: string) => data.get(key),
            setItem: (key: string, value: string) => data.set(key, value),
        })
        writeVisitor(state)
        expect(readVisitor().state).toEqual({ cart: state.cart, favorites: state.favorites })
        expect(data.has(VISITOR_STORAGE_KEY)).toBe(true)
    })
    it.each(['{invalid', JSON.stringify({ cart: null, favorites: [] }), JSON.stringify({ cart: [], favorites: null })])(
        'recupera carrinho e favoritos vazios se os dados estiverem corrompidos',
        (raw) => {
            vi.stubGlobal('localStorage', { getItem: () => raw })
            expect(readVisitor().warning).toBeTruthy()
            expect(readVisitor().state).toEqual(emptyVisitor())
        }
    )
    it('explica falha ao gravar e não altera os dados anteriores', () => {
        const state = createStoreState()
        vi.stubGlobal('localStorage', {
            getItem: () => null,
            setItem: () => {
                throw new Error('QuotaExceededError')
            },
        })
        expect(() => writeVisitor(state)).toThrow('Não foi possível salvar')
        expect(state).toEqual(createStoreState())
    })
})
