import { afterEach, describe, expect, it, vi } from 'vitest'

import { initialState } from '../data/demo'
import { addToCart, setQuantity } from '../domain/cart'
import { readState, STORAGE_KEY, writeState } from '../storage/local-state'

afterEach(() => vi.unstubAllGlobals())

describe('Carrinho e estoque', () => {
    it('acumula quantidades sem ultrapassar estoque e permite remover um item', () => {
        const original = initialState()
        const first = original.products[0]
        const state = addToCart(addToCart(original, first.id, 2), first.id, 1)
        expect(state.cart).toEqual([{ productId: first.id, quantity: 3 }])
        expect(original.cart).toEqual([])
        expect(() => addToCart(state, first.id, first.stock)).toThrow('estoque')
        expect(() => setQuantity(state, first.id, 1.5)).toThrow('Quantidade')
        expect(setQuantity(state, first.id, 0).cart).toEqual([])
    })
    it('bloqueia produto esgotado, desativado e quantidade negativa', () => {
        const state = initialState()
        expect(() => addToCart(state, 'axolote-acrilico')).toThrow('estoque')
        state.products[0].active = false
        expect(() => addToCart(state, state.products[0].id)).toThrow('disponível')
        expect(() => addToCart(state, state.products[1].id, -1)).toThrow('estoque')
    })
})

describe('Persistência local', () => {
    it('recupera favoritos, carrinho e perfil salvos', () => {
        const state = {
            ...addToCart(initialState(), 'terrario-ursos-polares'),
            favorites: ['terrario-ursos-polares'],
            loggedIn: true,
        }
        const data = new Map<string, string>()
        vi.stubGlobal('localStorage', {
            getItem: (key: string) => data.get(key),
            setItem: (key: string, value: string) => data.set(key, value),
        })
        writeState(state)
        expect(readState().state).toEqual(state)
        expect(data.has(STORAGE_KEY)).toBe(true)
    })
    it.each([
        '{invalid',
        JSON.stringify({ ...initialState(), products: [null] }),
        JSON.stringify({ ...initialState(), products: [{ ...initialState().products[0], stock: -1 }] }),
    ])('recupera o catálogo inicial se os dados estiverem corrompidos', (raw) => {
        vi.stubGlobal('localStorage', { getItem: () => raw })
        expect(readState().warning).toBeTruthy()
        expect(readState().state.products).toHaveLength(12)
    })
    it('explica falha ao gravar e não altera os dados anteriores', () => {
        const state = initialState()
        vi.stubGlobal('localStorage', {
            getItem: () => null,
            setItem: () => {
                throw new Error('QuotaExceededError')
            },
        })
        expect(() => writeState(state)).toThrow('Não foi possível salvar')
        expect(state).toEqual(initialState())
    })
})
