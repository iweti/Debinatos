export type Product = {
    id: string
    name: string
    category: string
    description: string
    material: string
    dimensions: string
    images: string[]
    stock: number
    active: boolean
    featured: boolean
    createdAt: string
    badge?: string
}
export type CartItem = { productId: string; quantity: number }
export type VisitorState = { cart: CartItem[]; favorites: string[] }
export type StoreState = VisitorState & { products: Product[] }
