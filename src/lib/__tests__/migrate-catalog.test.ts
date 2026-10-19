import { afterEach, describe, expect, it, vi } from 'vitest'

import { LEGACY_STORAGE_KEY, readState } from '../storage/local-state'
import { migrateCatalog } from '../storage/migrate-catalog'
import { initialLegacyState } from './fixtures/legacy'

afterEach(() => vi.unstubAllGlobals())

function legacyState() {
    const state = initialLegacyState()
    state.products[0] = {
        ...state.products[0],
        id: 'argolas-aurora',
        name: 'Argolas Aurora',
        price: 3990,
        images: ['/images/earrings.jpg'],
        stock: 3,
        active: false,
    }
    state.favorites = ['argolas-aurora']
    state.cart = [{ productId: 'argolas-aurora', quantity: 2 }]
    return state
}

describe('Atualização do catálogo salvo', () => {
    it('carrega as fotos novas preservando favoritos, carrinho, estoque e perfil', () => {
        const state = legacyState()
        vi.stubGlobal('localStorage', { getItem: (key: string) => (key === LEGACY_STORAGE_KEY ? JSON.stringify(state) : null), setItem: vi.fn() })
        const loaded = readState().state
        expect(loaded.products[0]).toMatchObject({
            id: 'terrario-ursos-polares',
            images: ['/images/products/terrario-ursos-polares.webp'],
            stock: 3,
            active: false,
        })
        expect(loaded.favorites).toEqual(['terrario-ursos-polares'])
        expect(loaded.cart).toEqual([{ productId: 'terrario-ursos-polares', quantity: 2 }])
        expect(loaded.profile).toEqual(state.profile)
        expect(loaded).not.toHaveProperty('orders')
        expect(state.favorites).toEqual(['argolas-aurora'])
        const migrated = migrateCatalog(state)
        expect(migrateCatalog(migrated)).toBe(migrated)
    })

    it('preserva produtos com nome, preço ou fotos personalizados no painel', () => {
        for (const change of [{ name: 'Minha peça' }, { price: 9990 }, { images: ['idb:foto-personalizada'] }]) {
            const state = legacyState()
            Object.assign(state.products[0], change)
            expect(migrateCatalog(state)).toBe(state)
        }
    })

    it('não duplica um produto do novo catálogo que já existe', () => {
        const state = legacyState()
        state.products.push(initialLegacyState().products[0])
        expect(migrateCatalog(state)).toBe(state)
    })
})
