import type { DemoState, Product } from '../types/store'
import type { LegacyState } from './legacy-state'
import { migrateCatalog } from './migrate-catalog'
import { migrateCopy } from './migrate-copy'

export function migrateInterest(legacy: LegacyState): DemoState {
    const state = migrateCopy(migrateCatalog(legacy))
    const products: Product[] = state.products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        material: product.material,
        dimensions: product.dimensions === 'Valor por unidade • consulte a descrição' ? 'Peça artesanal • consulte a descrição' : product.dimensions,
        images: product.images,
        stock: product.stock,
        active: product.active,
        featured: product.featured,
        createdAt: product.createdAt,
        ...(product.badge === undefined ? {} : { badge: product.badge }),
    }))
    return {
        version: 2,
        products,
        cart: state.cart,
        favorites: state.favorites,
        profile: state.profile,
        loggedIn: state.loggedIn,
    }
}
