export type ProductImage = { id: string; url: string; position: number }
export type HeroSlot = 'primary' | 'secondary'
export type HeroSelection = { productId: string; imageId: string | null } | null
export type HeroSelections = Record<HeroSlot, HeroSelection>
export type HeroPhoto = { url: string; alt: string }
export type HeroPhotos = Record<HeroSlot, HeroPhoto>

export type Product = {
    id: string
    name: string
    category: string
    description: string
    material: string
    dimensions: string
    images: ProductImage[]
    stock: number
    priceCents: number
    active: boolean
    featured: boolean
    featuredOrder: number | null
    createdAt: string
    badge?: string
}
export type CartItem = { productId: string; quantity: number }
export type VisitorState = { cart: CartItem[]; favorites: string[] }
export type StoreState = VisitorState & { products: Product[] }
