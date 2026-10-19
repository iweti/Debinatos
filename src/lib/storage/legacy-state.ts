import type { Address, DemoState, Product } from '../types/store'

// Compatibility only: these fields are never written to the current state.
export type LegacyProduct = Product & { price: number; originalPrice?: number }
export type LegacyState = Omit<DemoState, 'version' | 'products'> & {
    version: 1
    products: LegacyProduct[]
    orders: Array<{ address: Address | null; [key: string]: unknown }>
}
