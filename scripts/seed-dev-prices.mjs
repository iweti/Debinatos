import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { neon } from '@neondatabase/serverless'

import { devDatabaseConnection } from './dev-database.mjs'

export const seedPricesSql = `
    WITH ordered AS (
        SELECT id, row_number() OVER (ORDER BY created_at, id) AS position FROM products
    )
    UPDATE products p
    SET price_cents = (ARRAY[1990, 2990, 4990])[((o.position - 1) % 3 + 1)::integer]
    FROM ordered o
    WHERE p.id = o.id AND p.price_cents IS NULL
    RETURNING p.id, p.name, p.price_cents
`

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    const sql = neon(await devDatabaseConnection())
    const rows = await sql.query(seedPricesSql)
    console.log(`Preços fictícios preenchidos somente em dev: ${rows.length} produtos.`)
}
