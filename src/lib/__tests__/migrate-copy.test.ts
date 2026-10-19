import { afterEach, describe, expect, it, vi } from 'vitest'

import { LEGACY_STORAGE_KEY, readState } from '../storage/local-state'
import { migrateCopy } from '../storage/migrate-copy'
import { initialLegacyState } from './fixtures/legacy'

afterEach(() => vi.unstubAllGlobals())

describe('Atualização dos textos salvos', () => {
    it('atualiza o conteúdo antigo preservando favoritos, carrinho e o registro antigo', () => {
        const state = initialLegacyState()
        const product = state.products[4]
        const description = product.description
        product.description += ' Valor fictício por unidade.'
        state.profile.address.street = 'Rua das Flores (fictícia)'
        state.favorites = [product.id]
        state.cart = [{ productId: product.id, quantity: 2 }]
        state.orders[0].address = { ...state.profile.address }
        vi.stubGlobal('localStorage', { getItem: (key: string) => (key === LEGACY_STORAGE_KEY ? JSON.stringify(state) : null), setItem: vi.fn() })

        const loaded = readState().state
        expect(loaded.products[4].description).toBe(description)
        expect(loaded.profile.address.street).toBe('Rua das Flores')
        expect(loaded.favorites).toEqual(state.favorites)
        expect(loaded.cart).toEqual(state.cart)
        expect(loaded.products[4].stock).toBe(product.stock)
        expect(loaded).not.toHaveProperty('orders')
        expect(state.orders[0].total).toBe(3990)
        expect(state.profile.address.street).toBe('Rua das Flores (fictícia)')
        const migrated = migrateCopy(state)
        expect(migrateCopy(migrated)).toBe(migrated)
    })

    it('preserva descrições e endereços personalizados', () => {
        const state = initialLegacyState()
        state.products[4].description = 'Minha descrição personalizada.'
        state.profile.address.street = 'Rua das Palmeiras'
        expect(migrateCopy(state)).toBe(state)
    })
})
