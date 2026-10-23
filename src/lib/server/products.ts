import 'server-only'

import type { Product } from '@/lib/types/store'

import { database } from './db'

export async function getProducts(includeInactive = false): Promise<Product[]> {
    const rows = await database()`
        SELECT id, name, description, stock, created_at, category, material, dimensions, active, featured, badge, img
        FROM products WHERE active = true OR ${includeInactive} = true
        ORDER BY created_at DESC, id
    `
    return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        stock: row.stock,
        createdAt: new Date(row.created_at).toISOString(),
        category: row.category,
        material: row.material,
        dimensions: row.dimensions,
        active: row.active,
        featured: row.featured,
        images: row.img,
        ...(row.badge ? { badge: row.badge } : {}),
    }))
}
