import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
    const sql = vi.fn()
    return { sql, database: vi.fn(() => sql), requireAdmin: vi.fn() }
})

vi.mock('server-only', () => ({}))
vi.mock('@/lib/server/db', () => ({ database: mocks.database }))
vi.mock('@/lib/server/auth', () => ({ requireAdmin: mocks.requireAdmin }))
vi.mock('next/server', () => ({ connection: vi.fn() }))

import RootLayout from '@/app/layout'
import { addToCart, setQuantity } from '@/lib/domain/cart'
import { getContactSelection } from '@/lib/domain/contact'
import { getAdminProducts } from '@/lib/server/admin-products'
import { getProducts } from '@/lib/server/products'
import type { AdminProduct } from '@/lib/types/admin'
import type { Product } from '@/lib/types/store'

const row = {
    id: 'produto-1',
    name: 'Terrário',
    description: 'Descrição do produto',
    stock: 193347,
    price_cents: 1990,
    created_at: '2026-01-01T00:00:00.000Z',
    category: 'Decoração',
    material: 'Vidro',
    dimensions: '10 cm',
    active: true,
    featured: true,
    featured_order: 1,
    badge: null,
    images: [{ id: 'foto-1', url: 'https://example.com/foto.webp', position: 1 }],
}

beforeEach(() => {
    vi.clearAllMocks()
    mocks.sql.mockResolvedValue([row])
    mocks.requireAdmin.mockResolvedValue({ id: 'admin' })
})

describe('Produtos públicos e administrativos', () => {
    it('exclui estoque do contrato, da consulta e dos objetos públicos, mesmo se o banco retornar esse campo', async () => {
        expectTypeOf<Product>().not.toHaveProperty('stock')
        expectTypeOf<AdminProduct>().toHaveProperty('stock').toEqualTypeOf<number>()

        const products = await getProducts()
        const query = mocks.sql.mock.calls[0][0].join('')
        expect(query).not.toMatch(/\bstock\b/i)
        expect(query).toContain('WHERE p.active = true')
        expect(products[0]).toMatchObject({ id: row.id, priceCents: 1990, images: row.images })
        expect(products[0]).not.toHaveProperty('stock')
        expect(JSON.stringify(products)).not.toContain(String(row.stock))
        expect(mocks.requireAdmin).not.toHaveBeenCalled()
    })

    it('envia ao StoreProvider do layout somente produtos sem estoque interno', async () => {
        const layout = await RootLayout({ children: null })
        const provider = layout.props.children.props.children
        expect(provider.props.catalogError).toBe(false)
        expect(provider.props.products).toHaveLength(1)
        expect(provider.props.products[0]).not.toHaveProperty('stock')
        const serialized = JSON.stringify(provider.props.products)
        expect(serialized).not.toContain('stock')
        expect(serialized).not.toContain(String(row.stock))
    })

    it('preserva estoque e produtos inativos apenas na consulta administrativa autenticada', async () => {
        mocks.sql.mockResolvedValue([{ ...row, active: false }])
        mocks.requireAdmin.mockImplementationOnce(async () => {
            expect(mocks.database).not.toHaveBeenCalled()
            return { id: 'admin' }
        })
        const products = await getAdminProducts()
        const query = mocks.sql.mock.calls[0][0].join('')
        expect(mocks.requireAdmin).toHaveBeenCalledOnce()
        expect(query).toContain('p.stock')
        expect(query).not.toContain('WHERE p.active')
        expect(products[0]).toMatchObject({ id: row.id, active: false, stock: row.stock })
    })

    it('impede a consulta de estoque quando a sessão administrativa é recusada', async () => {
        mocks.requireAdmin.mockRejectedValueOnce(new Error('NEXT_REDIRECT'))
        await expect(getAdminProducts()).rejects.toThrow('NEXT_REDIRECT')
        expect(mocks.database).not.toHaveBeenCalled()
        expect(mocks.sql).not.toHaveBeenCalled()
    })

    it.each([0, 1])('mantém carrinho e contato independentes do estoque interno (%i)', async (stock) => {
        mocks.sql.mockResolvedValue([{ ...row, stock }])
        const products = await getProducts()
        const state = addToCart({ products, cart: [], favorites: [] }, row.id, 12)
        expect(state.cart).toEqual([{ productId: row.id, quantity: 12 }])
        expect(getContactSelection(state.products, state.cart)).toMatchObject({ invalid: false, itemCount: 12 })
        const changed = setQuantity(state, row.id, 50)
        expect(getContactSelection(changed.products, changed.cart)).toMatchObject({ invalid: false, itemCount: 50 })
        expect(products[0]).not.toHaveProperty('stock')
    })
})
