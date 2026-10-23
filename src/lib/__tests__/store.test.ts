import { afterEach, describe, expect, it, vi } from 'vitest'

import { addToCart, setQuantity } from '../domain/cart'
import { emptyVisitor, readVisitor, VISITOR_STORAGE_KEY, writeVisitor } from '../storage/visitor-state'
import { createStoreState } from './fixtures/store'

afterEach(() => vi.unstubAllGlobals())

describe('Carrinho e estoque', () => {
    it('acumula quantidades sem ultrapassar estoque e permite remover um item', () => {
        const original = createStoreState()
        const first = original.products[0]
        const state = addToCart(addToCart(original, first.id, 2), first.id, 1)
        expect(state.cart).toEqual([{ productId: first.id, quantity: 3 }])
        expect(original.cart).toEqual([])
        expect(() => addToCart(state, first.id, first.stock)).toThrow('estoque')
        expect(() => setQuantity(state, first.id, 1.5)).toThrow('Quantidade')
        expect(setQuantity(state, first.id, 0).cart).toEqual([])
    })
    it('bloqueia produto esgotado, desativado e quantidade negativa', () => {
        const state = createStoreState()
        expect(() => addToCart(state, 'produto-3')).toThrow('estoque')
        state.products[0].active = false
        expect(() => addToCart(state, state.products[0].id)).toThrow('disponível')
        expect(() => addToCart(state, state.products[1].id, -1)).toThrow('estoque')
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
