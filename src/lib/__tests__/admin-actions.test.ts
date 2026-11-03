import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
    const transaction = vi.fn(async () => [[]])
    const sql = Object.assign(
        vi.fn((strings: TemplateStringsArray, ...values: unknown[]) => ({ strings, values })),
        { transaction }
    )
    return { requireAdmin: vi.fn(), sql, database: vi.fn(() => sql), revalidatePath: vi.fn(), transaction }
})

vi.mock('@/lib/server/auth', () => ({ requireAdmin: mocks.requireAdmin, createSession: vi.fn(), deleteSession: vi.fn() }))
vi.mock('@/lib/server/db', () => ({ database: mocks.database }))
vi.mock('@/lib/server/login-rate-limit', () => ({ consumeLoginAttempt: vi.fn() }))
vi.mock('@/lib/server/cloudinary', () => ({
    validImageUrl: (url: unknown) => typeof url === 'string' && url.startsWith('https://res.cloudinary.com/'),
    imageService: vi.fn(),
}))
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }))
vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

import { saveHighlights, saveProduct } from '@/app/admin/_lib/actions'
import type { HighlightsInput, ProductInput } from '@/lib/types/admin'

const highlights: HighlightsInput = { favorites: [], hero: { primary: null, secondary: null } }
const product: ProductInput = {
    name: 'Produto',
    category: 'Decoração',
    description: 'Descrição',
    material: 'Vidro',
    dimensions: '10 cm',
    stock: 1,
    priceCents: 1990,
    active: true,
    images: [{ url: 'https://res.cloudinary.com/test/image/upload/a.webp' }],
}

beforeEach(() => {
    vi.clearAllMocks()
    mocks.requireAdmin.mockResolvedValue({ id: 'admin' })
    mocks.transaction.mockResolvedValue([[]])
})

describe('Ações administrativas', () => {
    it('recusa preço inválido antes de acessar o banco', async () => {
        expect((await saveProduct({ ...product, priceCents: 0 })).error).toBeTruthy()
        expect(mocks.database).not.toHaveBeenCalled()
    })

    it('bloqueia destaques e cadastro sem sessão antes de acessar o banco', async () => {
        mocks.requireAdmin.mockRejectedValue(new Error('NEXT_REDIRECT'))
        await expect(saveHighlights(highlights)).rejects.toThrow('NEXT_REDIRECT')
        await expect(saveProduct(product)).rejects.toThrow('NEXT_REDIRECT')
        expect(mocks.database).not.toHaveBeenCalled()
        expect(mocks.revalidatePath).not.toHaveBeenCalled()
    })

    it('salva os destaques em uma transação e revalida somente após sucesso', async () => {
        expect(await saveHighlights(highlights)).toEqual({ success: true })
        expect(mocks.transaction).toHaveBeenCalledTimes(1)
        expect(mocks.revalidatePath).toHaveBeenCalledWith('/', 'layout')
    })

    it('retorna erro recuperável sem alterar o rascunho nem revalidar em falhas', async () => {
        const before = JSON.stringify(highlights)
        mocks.transaction.mockRejectedValue(new Error('Database unavailable'))
        expect((await saveHighlights(highlights)).error).toBeTruthy()
        expect(JSON.stringify(highlights)).toBe(before)
        expect(mocks.revalidatePath).not.toHaveBeenCalled()
    })

    it('recusa payload inválido antes de acessar o banco', async () => {
        expect((await saveHighlights({ ...highlights, favorites: ['invalido'] })).error).toBeTruthy()
        expect(mocks.database).not.toHaveBeenCalled()
    })

    it('envia somente campos do cadastro comum e fotos para a operação atômica', async () => {
        expect(await saveProduct({ ...product, featured: true, featuredOrder: 1 } as ProductInput)).toEqual({ success: true })
        const values = mocks.sql.mock.calls[0].slice(1)
        const data = JSON.parse(values[1] as string)
        expect(data.priceCents).toBe(1990)
        expect(data).not.toHaveProperty('featured')
        expect(data).not.toHaveProperty('featuredOrder')
        expect(mocks.transaction).toHaveBeenCalledTimes(1)
    })
})
