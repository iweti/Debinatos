import 'server-only'

import { cache } from 'react'

import type { HeroSelections, Product } from '@/lib/types/store'

import { database } from './db'

export const getProducts = cache(async (): Promise<Product[]> => {
    const rows = await database()`
        SELECT p.id, p.name, p.description, p.price_cents, p.created_at, p.category, p.material, p.dimensions,
            p.active, p.featured, p.featured_order, p.badge,
            coalesce((SELECT jsonb_agg(jsonb_build_object('id', i.id, 'url', i.url, 'position', i.position) ORDER BY i.position)
                FROM product_images i WHERE i.product_id = p.id), '[]'::jsonb) AS images
        FROM products p WHERE p.active = true
        ORDER BY p.created_at DESC, p.id
    `
    // Only public fields may cross the StoreProvider's server/client boundary.
    return rows.map((row) => ({
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
    }))
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
