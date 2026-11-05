import 'server-only'

import { cache } from 'react'

import type { AdminProduct } from '@/lib/types/admin'

import { requireAdmin } from './auth'
import { database } from './db'
import { type ProductRow, toPublicProduct } from './product-mapper'

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
    return (rows as (ProductRow & { stock: number })[]).map((row) => ({ ...toPublicProduct(row), stock: row.stock }))
})
