import { initialState } from '../../data/demo'
import type { LegacyState } from '../../storage/legacy-state'

export function initialLegacyState(): LegacyState {
    const state = initialState()
    return {
        ...state,
        version: 1,
        products: state.products.map((product, index) => ({
            ...product,
            price: 3990 + index * 100,
            dimensions: product.category === 'Decoração' ? product.dimensions : 'Valor por unidade • consulte a descrição',
            ...(index === 0 ? { originalPrice: 4990 } : {}),
        })),
        orders: [{ id: 'DEB-1001', address: null, total: 3990, payment: 'pix' }],
    }
}
