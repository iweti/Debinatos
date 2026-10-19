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
export type Address = {
    cep: string
    street: string
    number: string
    complement: string
    district: string
    city: string
    state: string
}
export type Profile = { name: string; address: Address }
export type DemoState = {
    version: 2
    products: Product[]
    cart: CartItem[]
    favorites: string[]
    profile: Profile
    loggedIn: boolean
}
