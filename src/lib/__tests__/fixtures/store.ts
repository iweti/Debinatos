import type { StoreState } from '../../types/store'

export function createStoreState(): StoreState {
    return {
        products: [6, 7, 0].map((stock, index) => ({
            id: `produto-${index + 1}`,
            name: `Produto ${index + 1}`,
            category: 'Decoração',
            description: 'Descrição do produto',
            material: 'Vidro',
            dimensions: '10 cm',
            images: [{ id: `foto-${index + 1}`, url: 'https://res.cloudinary.com/test/image/upload/produto.webp', position: 1 }],
            stock,
            priceCents: [1990, 2990, 4990][index],
            active: true,
            featured: false,
            featuredOrder: null,
            createdAt: '2026-01-01T00:00:00.000Z',
        })),
        cart: [],
        favorites: [],
    }
}
