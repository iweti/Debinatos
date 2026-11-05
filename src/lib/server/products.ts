import 'server-only'

import { cache } from 'react'

import type { HeroSelections, Product } from '@/lib/types/store'

import { database } from './db'
import { type ProductRow, toPublicProduct } from './product-mapper'

export const getProducts = cache(async (): Promise<Product[]> => {
    const rows = await database()`
        SELECT p.id, p.name, p.description, p.price_cents, p.created_at, p.category, p.material, p.dimensions,
            p.active, p.featured, p.featured_order, p.badge,
            coalesce((SELECT jsonb_agg(jsonb_build_object('id', i.id, 'url', i.url, 'position', i.position) ORDER BY i.position)
                FROM product_images i WHERE i.product_id = p.id), '[]'::jsonb) AS images
        FROM products p WHERE p.active = true
        ORDER BY p.created_at DESC, p.id
    `
    return (rows as ProductRow[]).map(toPublicProduct)
})

export async function getHeroSelections(): Promise<HeroSelections> {
    const rows = await database()`SELECT slot, product_id, image_id FROM hero_products ORDER BY slot`
    const hero: HeroSelections = { primary: null, secondary: null }
    for (const row of rows) {
        const slot: unknown = row.slot
        if (slot === 'primary' || slot === 'secondary') {
            hero[slot] = row.product_id ? { productId: row.product_id, imageId: row.image_id } : null
        }
    }
    return hero
}
