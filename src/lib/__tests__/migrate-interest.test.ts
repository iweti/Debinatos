import { afterEach, describe, expect, it, vi } from 'vitest'

import { initialState } from '../data/demo'
import { LEGACY_STORAGE_KEY, readState, STORAGE_KEY } from '../storage/local-state'
import { migrateInterest } from '../storage/migrate-interest'
import { initialLegacyState } from './fixtures/legacy'

afterEach(() => vi.unstubAllGlobals())

function storage(entries: [string, string][]) {
    const data = new Map(entries)
    vi.stubGlobal('localStorage', {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => data.set(key, value),
    })
    return data
}

describe('Migração para catálogo de interesse', () => {
    it('migra personalizados e fotos sem regravar os dados antigos', () => {
        const legacy = initialLegacyState()
        legacy.products[0].name = 'Minha peça personalizada'
        legacy.products[0].images = ['idb:minha-foto']
        legacy.products[0].stock = 2
        legacy.favorites = [legacy.products[0].id]
        legacy.cart = [{ productId: legacy.products[0].id, quantity: 2 }]
        legacy.loggedIn = true
        const raw = JSON.stringify(legacy)
        const data = storage([[LEGACY_STORAGE_KEY, raw]])
        const result = readState()
        expect(result.warning).toBeUndefined()
        expect(result.state).toMatchObject({ version: 2, favorites: legacy.favorites, cart: legacy.cart, profile: legacy.profile, loggedIn: true })
        expect(result.state.products[0]).toMatchObject({ name: legacy.products[0].name, images: legacy.products[0].images, stock: 2 })
        expect(result.state).not.toHaveProperty('orders')
        for (const product of result.state.products) {
            expect(product).not.toHaveProperty('price')
            expect(product).not.toHaveProperty('originalPrice')
        }
        expect(result.state.products[4].dimensions).toBe('Peça artesanal • consulte a descrição')
        expect(data.get(LEGACY_STORAGE_KEY)).toBe(raw)
        expect(JSON.parse(data.get(STORAGE_KEY) ?? '')).toEqual(result.state)
        expect(readState().state).toEqual(result.state)
    })

    it('prefere a versão atual mesmo quando o registro antigo ainda existe', () => {
        const current = initialState()
        current.products[0].name = 'Edição atual'
        storage([
            [LEGACY_STORAGE_KEY, JSON.stringify(initialLegacyState())],
            [STORAGE_KEY, JSON.stringify(current)],
        ])
        expect(readState().state).toEqual(current)
    })

    it('preserva dados migrados em memória quando não consegue gravar a versão nova', () => {
        const legacy = initialLegacyState()
        legacy.products[0].name = 'Não perder esta peça'
        vi.stubGlobal('localStorage', {
            getItem: (key: string) => (key === LEGACY_STORAGE_KEY ? JSON.stringify(legacy) : null),
            setItem: () => {
                throw new Error('QuotaExceededError')
            },
        })
        const result = readState()
        expect(result.warning).toContain('não foi possível salvar')
        expect(result.state.products[0].name).toBe('Não perder esta peça')
    })

    it('preserva medidas personalizadas e não modifica o objeto antigo', () => {
        const legacy = initialLegacyState()
        legacy.products[4].dimensions = '10 cm'
        const before = structuredClone(legacy)
        expect(migrateInterest(legacy).products[4].dimensions).toBe('10 cm')
        expect(legacy).toEqual(before)
    })

    it('avisa sobre versão antiga corrompida sem sobrescrevê-la', () => {
        const data = storage([[LEGACY_STORAGE_KEY, '{invalid']])
        expect(readState().warning).toBeTruthy()
        expect(data.has(STORAGE_KEY)).toBe(false)
        expect(data.get(LEGACY_STORAGE_KEY)).toBe('{invalid')
    })
})
