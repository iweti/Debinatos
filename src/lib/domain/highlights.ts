import type { HighlightsInput } from '../types/admin'
import type { HeroPhotos, HeroSelections, Product } from '../types/store'

export const DEFAULT_HERO_PHOTOS: HeroPhotos = {
    primary: {
        url: '/images/products/terrario-ursos-polares.webp',
        alt: 'Terrário decorativo com ursos polares e tampa amadeirada da Debinatos.',
    },
    secondary: { url: '/images/products/mini-aquario-axolote.webp', alt: 'Mini aquário decorativo de axolote da Debinatos.' },
}

export function compareNewest(a: Product, b: Product) {
    return b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id)
}

export function compareFeatured(a: Product, b: Product) {
    if (a.featured !== b.featured) return Number(b.featured) - Number(a.featured)
    if (a.featured && b.featured) return (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity) || compareNewest(a, b)
    return compareNewest(a, b)
}

export function homeFavorites(products: Product[]) {
    return products.filter((product) => product.active && product.featured).sort(compareFeatured)
}

export function moveFavorite(ids: string[], id: string, position: number) {
    if (!ids.includes(id) || !Number.isInteger(position) || position < 1 || position > ids.length) return ids
    const next = ids.filter((value) => value !== id)
    next.splice(position - 1, 0, id)
    return next
}

export function mergePublishedHighlights(draft: HighlightsInput, previous: HighlightsInput, published: HighlightsInput): HighlightsInput {
    return {
        favorites: JSON.stringify(draft.favorites) === JSON.stringify(previous.favorites) ? published.favorites : draft.favorites,
        hero: {
            primary: JSON.stringify(draft.hero.primary) === JSON.stringify(previous.hero.primary) ? published.hero.primary : draft.hero.primary,
            secondary: JSON.stringify(draft.hero.secondary) === JSON.stringify(previous.hero.secondary) ? published.hero.secondary : draft.hero.secondary,
        },
    }
}

export function resolveHeroPhotos(products: Product[], selections: HeroSelections): HeroPhotos {
    const photos = { ...DEFAULT_HERO_PHOTOS }
    for (const slot of ['primary', 'secondary'] as const) {
        const selection = selections[slot]
        const product = products.find((item) => item.id === selection?.productId && item.active)
        const image = product?.images.find((item) => item.id === selection?.imageId) ?? product?.images[0]
        if (product && image) photos[slot] = { url: image.url, alt: `Foto de ${product.name}` }
    }
    return photos
}
