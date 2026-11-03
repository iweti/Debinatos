import type { HeroSelections, Product } from './store'

export type ProductImageInput = { id?: string; url: string }
export type AdminProduct = Product & { stock: number }
export type ProductInput = Omit<AdminProduct, 'id' | 'createdAt' | 'featured' | 'featuredOrder' | 'images'> & {
    id?: string
    images: ProductImageInput[]
}
export type HighlightsInput = { favorites: string[]; hero: HeroSelections }
export type ActionResult = { error?: string; success?: boolean }
