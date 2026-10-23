import { describe, expect, it } from 'vitest'

import {
    compareFeatured,
    compareNewest,
    DEFAULT_HERO_PHOTOS,
    homeFavorites,
    mergePublishedHighlights,
    moveFavorite,
    resolveHeroPhotos,
} from '../domain/highlights'
import type { Product } from '../types/store'
import { createStoreState } from './fixtures/store'

function products(): Product[] {
    return [0, 1, 2, 3, 4, 5, 6].map((index) => ({
        ...createStoreState().products[0],
        id: `produto-${index + 1}`,
        name: `Produto ${index + 1}`,
        category: index % 2 ? 'Decoração' : 'Papelaria',
        createdAt: `2026-10-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
        featured: index < 5,
        featuredOrder: index < 5 ? 5 - index : null,
        images: [{ id: `foto-${index + 1}`, url: `https://example.com/${index}.webp`, position: 1 }],
    }))
}

describe('Ordem dos Favoritos da Debinatos', () => {
    it('move nos dois sentidos, sem duplicar e sem modificar o rascunho original', () => {
        const original = ['a', 'b', 'c', 'd']
        expect(moveFavorite(original, 'd', 1)).toEqual(['d', 'a', 'b', 'c'])
        expect(moveFavorite(original, 'a', 3)).toEqual(['b', 'c', 'a', 'd'])
        expect(moveFavorite(original, 'b', 2)).toEqual(original)
        expect(original).toEqual(['a', 'b', 'c', 'd'])
        expect(moveFavorite(original, 'x', 1)).toBe(original)
        expect(moveFavorite(original, 'a', 0)).toBe(original)
    })

    it('ordena favoritos pela posição, depois os demais pela data', () => {
        expect(
            products()
                .sort(compareFeatured)
                .map((p) => p.id)
        ).toEqual(['produto-5', 'produto-4', 'produto-3', 'produto-2', 'produto-1', 'produto-7', 'produto-6'])
    })

    it('limita a home a quatro ativos e preenche a vaga de um favorito desativado', () => {
        const items = products()
        items[4].active = false
        expect(homeFavorites(items).map((p) => p.id)).toEqual(['produto-4', 'produto-3', 'produto-2', 'produto-1'])
        expect(homeFavorites([])).toEqual([])
    })

    it('mantém a ordem entre resultados filtrados e ignora destaque em novidades', () => {
        const filtered = products().filter((p) => p.category === 'Decoração' && p.name.includes('Produto'))
        expect(filtered.sort(compareFeatured).map((p) => p.id)).toEqual(['produto-4', 'produto-2', 'produto-6'])
        expect(
            products()
                .sort(compareNewest)
                .map((p) => p.id)
        ).toEqual(['produto-7', 'produto-6', 'produto-5', 'produto-4', 'produto-3', 'produto-2', 'produto-1'])
    })
})

describe('Fotos do hero', () => {
    it('atualiza uma foto removida ao editar o produto sem perder favoritos ainda não salvos', () => {
        const previous = { favorites: ['a', 'b'], hero: { primary: { productId: 'a', imageId: 'foto' }, secondary: null } }
        const draft = { ...previous, favorites: ['b', 'a'] }
        const published = { ...previous, hero: { primary: { productId: 'a', imageId: null }, secondary: null } }
        expect(mergePublishedHighlights(draft, previous, published)).toEqual({ ...published, favorites: ['b', 'a'] })
    })

    it('resolve pelo ID, preserva a escolha após reordenar e aceita duas fotos do mesmo produto', () => {
        const items = products()
        const product = items[0]
        product.images.push({ id: 'outra-foto', url: 'https://example.com/outra.webp', position: 2 })
        const selection = { primary: { productId: product.id, imageId: 'outra-foto' }, secondary: { productId: product.id, imageId: product.images[0].id } }
        const before = resolveHeroPhotos(items, selection)
        product.images.reverse()
        expect(resolveHeroPhotos(items, selection)).toEqual(before)
        expect(before.primary.url).toBe('https://example.com/outra.webp')
        expect(before.secondary.url).toBe('https://example.com/0.webp')
        expect(product.featuredOrder).toBe(5)
    })

    it('usa a capa quando a foto foi removida e a imagem padrão para produto desativado', () => {
        const items = products()
        const selected = { primary: { productId: items[0].id, imageId: 'foto-removida' }, secondary: null }
        expect(resolveHeroPhotos(items, selected).primary.url).toBe(items[0].images[0].url)
        items[0].active = false
        expect(resolveHeroPhotos(items, selected)).toEqual(DEFAULT_HERO_PHOTOS)
        expect(resolveHeroPhotos([], selected)).toEqual(DEFAULT_HERO_PHOTOS)
        expect(resolveHeroPhotos(items, { primary: null, secondary: null })).toEqual(DEFAULT_HERO_PHOTOS)
    })
})
