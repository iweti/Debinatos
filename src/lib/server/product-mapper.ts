import 'server-only'

import type { Product, ProductImage } from '@/lib/types/store'

export type ProductRow = {
    id: string
    name: string
    description: string
    price_cents: number
    created_at: string | Date
    category: string
    material: string
    dimensions: string
    active: boolean
    featured: boolean
    featured_order: number | null
    badge: string | null
    images: ProductImage[]
}

// Lista explícita: campos administrativos nunca passam para o contrato público.
export function toPublicProduct(row: ProductRow): Product {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        priceCents: row.price_cents,
        createdAt: new Date(row.created_at).toISOString(),
        category: row.category,
        material: row.material,
        dimensions: row.dimensions,
        active: row.active,
        featured: row.featured,
        featuredOrder: row.featured_order,
        images: row.images,
        ...(row.badge ? { badge: row.badge } : {}),
    }
}
