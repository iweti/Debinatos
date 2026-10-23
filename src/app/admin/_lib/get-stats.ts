import type { Product } from '@/lib/types/store'

export function getStats(products: Product[]) {
    return {
        activeProducts: products.filter((p) => p.active).length,
        lowStock: products.filter((p) => p.active && p.stock <= 3).length,
    }
}
