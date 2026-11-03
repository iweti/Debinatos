import type { HeroSelections, Product } from './store'

export type ProductImageInput = { id?: string; url: string }
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'featured' | 'featuredOrder' | 'images'> & {
    id?: string
    images: ProductImageInput[]
}
export type HighlightsInput = { favorites: string[]; hero: HeroSelections }
export type ActionResult = { error?: string; success?: boolean }
