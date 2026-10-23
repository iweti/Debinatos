import type { Product } from './store'

export type ProductInput = Omit<Product, 'id' | 'createdAt'> & { id?: string }
export type ActionResult = { error?: string; success?: boolean }
