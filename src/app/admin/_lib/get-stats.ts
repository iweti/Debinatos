import type { DemoState } from '@/lib/types/store'

export function getStats(state: DemoState) {
    return {
        activeProducts: state.products.filter((p) => p.active).length,
        lowStock: state.products.filter((p) => p.active && p.stock <= 3).length,
    }
}
