import { describe, expect, it } from 'vitest'

import { catalogFilterUrl, catalogProducts, parseCatalogSort } from '../domain/catalog'
import type { Product } from '../types/store'
import { createStoreState } from './fixtures/store'

function product(id: string, overrides: Partial<Product> = {}): Product {
    return { ...createStoreState().products[0], id, ...overrides }
}

function ids(products: Product[]) {
    return products.map((item) => item.id)
}

describe('Ordenação do catálogo', () => {
    const items = [
        product('empate-b', { priceCents: 1200 }),
        product('caro', { priceCents: Number.MAX_SAFE_INTEGER }),
        product('barato', { priceCents: 0 }),
        product('recente', { priceCents: 1200, createdAt: '2026-10-30T00:00:00.000Z' }),
        product('empate-a', { priceCents: 1200 }),
    ]

    it.each([
        ['preco-crescente', ['barato', 'recente', 'empate-a', 'empate-b', 'caro']],
        ['preco-decrescente', ['caro', 'recente', 'empate-a', 'empate-b', 'barato']],
    ] as const)('ordena por %s e desempata pela data e pelo ID sem alterar a origem', (sort, expected) => {
        const original = items.map((item) => ({ ...item }))
        expect(ids(catalogProducts(items, { query: '', category: '', sort }))).toEqual(expected)
        expect(items).toEqual(original)
    })

    it('ordena novidades pela data e pelo ID, independente de preço ou destaque', () => {
        const items = [product('b', { featured: true, featuredOrder: 1 }), product('c', { createdAt: '2026-10-30T00:00:00.000Z' }), product('a')]
        expect(ids(catalogProducts(items, { query: '', category: '', sort: 'novidade' }))).toEqual(['c', 'a', 'b'])
    })

    it('mantém Favoritos da Debinatos e sua posição antes dos demais produtos na relevância', () => {
        const items = [
            product('novo', { createdAt: '2026-10-30T00:00:00.000Z' }),
            product('destaque-2', { featured: true, featuredOrder: 2 }),
            product('antigo'),
            product('destaque-1', { featured: true, featuredOrder: 1 }),
        ]
        expect(ids(catalogProducts(items, { query: '', category: '', sort: 'relevantes' }))).toEqual(['destaque-1', 'destaque-2', 'novo', 'antigo'])
    })

    it.each(['preco-crescente', 'preco-decrescente', 'novidade', 'relevantes'] as const)('combina busca e categoria, escondendo inativos em %s', (sort) => {
        const items = [
            product('selecionado', { name: 'Colar de Coração', category: 'Bijuterias' }),
            product('inativo', { name: 'Colar de Coração', category: 'Bijuterias', active: false }),
            product('outra-categoria', { name: 'Coração de vidro', category: 'Decoração' }),
            product('outro-nome', { name: 'Colar de estrela', category: 'Bijuterias' }),
        ]
        expect(ids(catalogProducts(items, { query: 'COracao', category: 'Bijuterias', sort }))).toEqual(['selecionado'])
        expect(catalogProducts(items, { query: 'inexistente', category: '', sort })).toEqual([])
    })
})

describe('Ordenação e filtros na URL', () => {
    it.each([
        [null, 'relevantes'],
        ['', 'relevantes'],
        ['desconhecida', 'relevantes'],
        ['destaques', 'relevantes'],
        ['relevantes', 'relevantes'],
        ['novidades', 'novidade'],
        ['novidade', 'novidade'],
        ['preco-crescente', 'preco-crescente'],
        ['preco-decrescente', 'preco-decrescente'],
    ])('interpreta ordem=%s como %s', (value, expected) => {
        expect(parseCatalogSort(value)).toBe(expected)
    })

    it('preserva busca, categoria e parâmetros não relacionados ao mudar a ordem', () => {
        const url = catalogFilterUrl('?q=cora%C3%A7%C3%A3o&categoria=Bijuterias&campanha=presente', { ordem: 'preco-decrescente' })
        const params = new URL(url, 'https://example.com').searchParams
        expect(Object.fromEntries(params)).toEqual({ q: 'coração', categoria: 'Bijuterias', campanha: 'presente', ordem: 'preco-decrescente' })
    })

    it('mantém a ordenação ao buscar ou limpar busca e categoria', () => {
        const searched = catalogFilterUrl('?ordem=preco-crescente&campanha=presente', { q: 'vidro', categoria: 'Decoração' })
        expect(new URL(searched, 'https://example.com').searchParams.get('ordem')).toBe('preco-crescente')
        expect(catalogFilterUrl(searched.split('?')[1], { q: '', categoria: '' })).toBe('/catalogo?ordem=preco-crescente&campanha=presente')
    })

    it('canonicaliza links antigos e remove ordem inválida ou padrão sem deixar interrogação vazia', () => {
        expect(catalogFilterUrl('?ordem=novidades', { q: 'vidro' })).toBe('/catalogo?ordem=novidade&q=vidro')
        expect(catalogFilterUrl('?ordem=destaques', {})).toBe('/catalogo')
        expect(catalogFilterUrl('?ordem=qualquer', {})).toBe('/catalogo')
        expect(catalogFilterUrl('?ordem=preco-crescente', { ordem: 'relevantes' })).toBe('/catalogo')
        expect(catalogFilterUrl('?q=vidro', { q: '' })).toBe('/catalogo')
    })
})
