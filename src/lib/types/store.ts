export type Product = {
    id: string
    name: string
    category: string
    price: number
    originalPrice?: number
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
export type OrderStatus = 'received' | 'preparing' | 'sent' | 'ready' | 'completed'
export type OrderItem = {
    productId: string
    name: string
    image: string
    price: number
    quantity: number
}
export type Order = {
    id: string
    createdAt: string
    items: OrderItem[]
    subtotal: number
    shipping: number
    total: number
    delivery: 'shipping' | 'pickup'
    payment: 'pix' | 'card'
    status: OrderStatus
    customerName: string
    address: Address | null
}
export type DemoState = {
    version: 1
    products: Product[]
    cart: CartItem[]
    favorites: string[]
    profile: Profile
    loggedIn: boolean
    orders: Order[]
}
export type CheckoutInput = {
    delivery: Order['delivery']
    payment: Order['payment']
    address: Address
}
