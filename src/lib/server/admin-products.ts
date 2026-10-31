import 'server-only'

import { cache } from 'react'

import type { AdminProduct } from '@/lib/types/admin'

import { requireAdmin } from './auth'
import { database } from './db'

export const getAdminProducts = cache(async (): Promise<AdminProduct[]> => {
    await requireAdmin()
    const rows = await database()`
        SELECT p.id, p.name, p.description, p.stock, p.price_cents, p.created_at, p.category, p.material, p.dimensions,
            p.active, p.featured, p.featured_order, p.badge,
            coalesce((SELECT jsonb_agg(jsonb_build_object('id', i.id, 'url', i.url, 'position', i.position) ORDER BY i.position)
                FROM product_images i WHERE i.product_id = p.id), '[]'::jsonb) AS images
        FROM products p
        ORDER BY p.created_at DESC, p.id
    `
    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        stock: row.stock,
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
