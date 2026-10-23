import { describe, expect, it } from 'vitest'

import { parseHighlightsInput, parseProductInput } from '../domain/admin-input'

const productId = '11111111-1111-4111-8111-111111111111'
const imageId = '22222222-2222-4222-8222-222222222222'
const imageUrl = 'https://res.cloudinary.com/test/image/upload/photo.webp'
const input = {
    name: ' Produto ',
    description: 'Descrição',
    category: 'Categoria',
    material: 'Vidro',
    dimensions: '10 cm',
    stock: 1,
    active: true,
    images: [{ id: imageId, url: imageUrl }],
}

describe('Contrato do cadastro comum', () => {
    it('preserva referências de fotos, aceita novas URLs e ignora configurações de destaque recebidas', () => {
        const parsed = parseProductInput({ ...input, featured: true, featuredOrder: 1 }, () => true)
        expect(parsed?.name).toBe('Produto')
        expect(parsed?.images).toEqual(input.images)
        expect(parsed).not.toHaveProperty('featured')
        expect(parsed).not.toHaveProperty('featuredOrder')
        expect(parseProductInput({ ...input, images: [{ url: imageUrl }] }, () => true)?.images).toEqual([{ url: imageUrl }])
    })

    it.each([[], Array(6).fill({ url: imageUrl }), [{ id: 'invalido', url: imageUrl }], [input.images[0], input.images[0]], [null]])(
        'rejeita fotos inválidas: %j',
        (images) => {
            expect(parseProductInput({ ...input, images }, () => true)).toBeUndefined()
        }
    )

    it('rejeita URLs externas e quantidade fracionada', () => {
        expect(parseProductInput(input, () => false)).toBeUndefined()
        expect(parseProductInput({ ...input, stock: 1.5 }, () => true)).toBeUndefined()
    })
})

describe('Contrato dos destaques', () => {
    it('aceita limpeza, lista vazia e seleção com imagem removida', () => {
        expect(parseHighlightsInput({ favorites: [], hero: { primary: null, secondary: null } })).toBeDefined()
        expect(parseHighlightsInput({ favorites: [productId], hero: { primary: { productId, imageId: null }, secondary: null } })).toBeDefined()
    })

    it('rejeita IDs inválidos, produtos repetidos e posições do hero ausentes', () => {
        expect(parseHighlightsInput({ favorites: [productId, productId], hero: { primary: null, secondary: null } })).toBeUndefined()
        expect(parseHighlightsInput({ favorites: ['invalido'], hero: { primary: null, secondary: null } })).toBeUndefined()
        expect(parseHighlightsInput({ favorites: [], hero: { primary: { productId, imageId: 'invalido' }, secondary: null } })).toBeUndefined()
        expect(parseHighlightsInput({ favorites: [], hero: {} })).toBeUndefined()
    })
})
