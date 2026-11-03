import type { AdminProduct } from '@/lib/types/admin'

export function getStats(products: AdminProduct[]) {
    return {
        activeProducts: products.filter((p) => p.active).length,
        lowStock: products.filter((p) => p.active && p.stock <= 3).length,
    }
}
