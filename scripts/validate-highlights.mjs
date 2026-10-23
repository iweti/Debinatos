import assert from 'node:assert/strict'

import { neon } from '@neondatabase/serverless'

import { migrationStatements } from './migrate.mjs'

const connection = process.env.VALIDATION_DATABASE_URL
if (!connection || connection === process.env.DATABASE_URL || new URL(connection).hostname.includes('-pooler')) {
    throw new Error('Defina VALIDATION_DATABASE_URL com uma conexão direta da branch temporária de testes.')
}
const source = neon(process.env.DATABASE_URL)
const sql = neon(connection)
const [{ modern }] = await source`SELECT to_regclass('public.product_images') IS NOT NULL AS modern`
const products = modern
    ? await source`SELECT p.*, ARRAY(SELECT url FROM product_images i WHERE i.product_id = p.id ORDER BY position) AS img FROM products p ORDER BY p.created_at DESC, p.id`
    : await source`SELECT * FROM products ORDER BY created_at DESC, id`
const heroes = modern
    ? await source`SELECT h.slot, h.product_id, i.url AS image_url FROM hero_products h LEFT JOIN product_images i ON i.id = h.image_id ORDER BY slot`
    : await source`SELECT slot, product_id, image_url FROM hero_products ORDER BY slot`
const baseline = await migrationStatements('002_products.sql')
const expansion = await migrationStatements('003_product_images_highlights.sql')
const cleanup = await migrationStatements('004_remove_legacy_images.sql')
const stamp = Date.now()

for (const existing of [false, true]) {
    const schema = `highlight_${existing ? 'existing' : 'original'}_${stamp}`
    const tx = (queries) => sql.transaction([sql`SELECT set_config('search_path', ${schema + ',public'}, true)`, ...queries])
    await sql.query(`CREATE SCHEMA ${schema}`)
    await tx(baseline.map((statement) => sql.query(statement)))
    await tx([
        sql`
        INSERT INTO products (id, name, description, stock, created_at, category, material, dimensions, active, featured, badge, img)
        SELECT id, name, description, stock, created_at, category, material, dimensions, active, featured, badge, img
        FROM jsonb_to_recordset(${JSON.stringify(products)}::jsonb) AS p(
            id uuid, name text, description text, stock integer, created_at timestamptz, category text,
            material text, dimensions text, active boolean, featured boolean, badge text, img text[])
    `,
    ])
    if (existing) {
        await tx([
            sql`ALTER TABLE products ADD COLUMN featured_order integer`,
            sql`UPDATE products p SET featured_order = d.featured_order FROM jsonb_to_recordset(${JSON.stringify(products)}::jsonb) AS d(id uuid, featured_order integer) WHERE d.id = p.id`,
            sql`ALTER TABLE products ADD CONSTRAINT products_featured_order_check CHECK ((featured AND featured_order IS NOT NULL AND featured_order > 0) OR (NOT featured AND featured_order IS NULL))`,
            sql`ALTER TABLE products ADD CONSTRAINT products_featured_order_unique UNIQUE (featured_order) DEFERRABLE INITIALLY DEFERRED`,
            sql`CREATE TABLE hero_products (slot text PRIMARY KEY CHECK (slot IN ('primary', 'secondary')), product_id uuid REFERENCES products(id) ON DELETE SET NULL, image_url text, CHECK (product_id IS NULL OR image_url IS NOT NULL))`,
            sql`INSERT INTO hero_products SELECT * FROM jsonb_to_recordset(${JSON.stringify(heroes)}::jsonb) AS h(slot text, product_id uuid, image_url text)`,
        ])
    }
    await tx(expansion.map((statement) => sql.query(statement)))
    const [, converted] = await tx([
        sql`SELECT p.id, p.featured_order, jsonb_agg(i.url ORDER BY i.position) AS urls FROM products p JOIN product_images i ON i.product_id = p.id GROUP BY p.id ORDER BY p.created_at DESC, p.id`,
    ])
    assert.equal(converted.length, products.length)
    for (const product of products) assert.deepEqual(converted.find((row) => row.id === product.id).urls, product.img)
    const expectedOrder = products
        .filter((p) => p.featured)
        .sort(existing ? (a, b) => a.featured_order - b.featured_order : () => 0)
        .map((p) => p.id)
    assert.deepEqual(
        converted
            .filter((p) => p.featured_order !== null)
            .sort((a, b) => a.featured_order - b.featured_order)
            .map((p) => p.id),
        expectedOrder
    )
    if (existing) {
        const [, mapped] = await tx([
            sql`SELECT h.slot, h.product_id, i.url FROM hero_products h LEFT JOIN product_images i ON i.id = h.image_id ORDER BY slot`,
        ])
        assert.deepEqual(
            mapped.map((h) => ({ ...h, image_url: h.url, url: undefined })),
            heroes.map((h) => ({ ...h, url: undefined }))
        )
    }
    console.log(`${existing ? 'Schema atual do dev' : 'Schema original'}: imagens, sequência, favoritos e hero preservados.`)

    const data = {
        name: 'Teste de fotos',
        description: 'Fixture de validação',
        stock: 1,
        category: 'Teste',
        material: 'Vidro',
        dimensions: '10 cm',
        active: true,
    }
    const [, created] = await tx([
        sql`SELECT save_store_product(NULL, ${JSON.stringify(data)}::jsonb, ${JSON.stringify([{ url: 'https://example.com/a.webp' }, { url: 'https://example.com/b.webp' }])}::jsonb) AS id`,
    ])
    const id = created[0].id
    const [, originalImages] = await tx([sql`SELECT id, url, position FROM product_images WHERE product_id = ${id} ORDER BY position`])
    const reversed = [...originalImages].reverse().map(({ id, url }) => ({ id, url }))
    await tx([sql`SELECT save_store_product(${id}, ${JSON.stringify(data)}::jsonb, ${JSON.stringify(reversed)}::jsonb)`])
    const [, reordered] = await tx([sql`SELECT id FROM product_images WHERE product_id = ${id} ORDER BY position`])
    assert.deepEqual(
        reordered.map((i) => i.id),
        reversed.map((i) => i.id)
    )
    await tx([
        sql`SELECT save_store_product(${id}, ${JSON.stringify(data)}::jsonb, ${JSON.stringify([...reversed, { url: 'https://example.com/c.webp' }])}::jsonb)`,
    ])
    const [, addedImages] = await tx([sql`SELECT id FROM product_images WHERE product_id = ${id} ORDER BY position`])
    assert.equal(addedImages.length, 3)
    assert.deepEqual(
        addedImages.slice(0, 2).map((image) => image.id),
        reversed.map((image) => image.id)
    )
    await tx([sql`SELECT save_store_product(${id}, ${JSON.stringify(data)}::jsonb, ${JSON.stringify(reversed)}::jsonb)`])
    const hero = { primary: { productId: id, imageId: reversed[0].id }, secondary: { productId: id, imageId: reversed[1].id } }
    const favorites = [
        id,
        ...products
            .filter((p) => p.active)
            .slice(0, 5)
            .map((p) => p.id),
    ]
    await tx([sql`SELECT save_store_highlights(${favorites}::uuid[], ${JSON.stringify(hero)}::jsonb)`])
    const [, favoriteRows] = await tx([sql`SELECT id FROM products WHERE featured ORDER BY featured_order`])
    assert.deepEqual(
        favoriteRows.map((p) => p.id),
        favorites
    )
    await tx([
        sql`SELECT save_store_product(${id}, ${JSON.stringify({ ...data, featured: false, featuredOrder: null })}::jsonb, ${JSON.stringify(reversed)}::jsonb)`,
    ])
    const [, preserved] = await tx([sql`SELECT featured, featured_order FROM products WHERE id = ${id}`])
    assert.equal(preserved[0].featured_order, 1)
    assert.equal(preserved[0].featured, true)

    const expectFailure = async (queries, message) => {
        await assert.rejects(tx(queries), message)
    }
    const otherId = products[0].id
    await expectFailure([sql`UPDATE product_images SET position = 1 WHERE product_id = ${id}`], /duplicate key/)
    await expectFailure([sql`UPDATE products SET featured_order = 0 WHERE id = ${id}`], /check constraint/)
    await expectFailure(
        [sql`SELECT save_store_product(${otherId}, ${JSON.stringify(data)}::jsonb, ${JSON.stringify(reversed)}::jsonb)`],
        /INVALID_IMAGE_REFERENCE/
    )
    await expectFailure([sql`SELECT save_store_product(${id}, ${JSON.stringify(data)}::jsonb, '[]'::jsonb)`], /INVALID_IMAGES/)
    await expectFailure(
        [sql`SELECT save_store_product(${id}, ${JSON.stringify(data)}::jsonb, ${JSON.stringify([reversed[0], reversed[0]])}::jsonb)`],
        /INVALID_IMAGE_REFERENCE/
    )
    const invalidHero = { ...hero, primary: { productId: otherId, imageId: reversed[0].id } }
    await expectFailure([sql`SELECT save_store_highlights(${[...favorites].reverse()}::uuid[], ${JSON.stringify(invalidHero)}::jsonb)`], /INVALID_HERO_IMAGE/)
    await expectFailure([sql`SELECT save_store_highlights(${[id, id]}::uuid[], ${JSON.stringify(hero)}::jsonb)`], /INVALID_FAVORITES/)
    const [, afterFailure] = await tx([sql`SELECT id FROM products WHERE featured ORDER BY featured_order`])
    assert.deepEqual(
        afterFailure.map((p) => p.id),
        favorites
    )

    await tx([sql`SELECT save_store_product(${id}, ${JSON.stringify(data)}::jsonb, ${JSON.stringify([reversed[1]])}::jsonb)`])
    const [, afterRemoval] = await tx([sql`SELECT product_id, image_id FROM hero_products WHERE slot = 'primary'`])
    assert.deepEqual(afterRemoval[0], { product_id: id, image_id: null })
    const fallbackHero = { ...hero, primary: { productId: id, imageId: null } }
    await tx([
        sql`UPDATE products SET active = false WHERE id = ${id}`,
        sql`SELECT save_store_highlights(${favorites}::uuid[], ${JSON.stringify(fallbackHero)}::jsonb)`,
    ])
    const changedInactiveHero = { ...fallbackHero, primary: { productId: id, imageId: reversed[1].id } }
    await expectFailure([sql`SELECT save_store_highlights(${favorites}::uuid[], ${JSON.stringify(changedInactiveHero)}::jsonb)`], /INACTIVE_HERO_PRODUCT/)
    const shortened = favorites.filter((value) => value !== id)
    await tx([sql`SELECT save_store_highlights(${shortened}::uuid[], ${JSON.stringify(fallbackHero)}::jsonb)`])
    await expectFailure([sql`SELECT save_store_highlights(${favorites}::uuid[], ${JSON.stringify(fallbackHero)}::jsonb)`], /INVALID_FAVORITES/)
    await tx([sql`UPDATE products SET active = true WHERE id = ${id}`])
    const orderA = [...favorites].reverse()
    await Promise.all([
        tx([sql`SELECT save_store_highlights(${favorites}::uuid[], ${JSON.stringify(fallbackHero)}::jsonb)`]),
        tx([sql`SELECT save_store_highlights(${orderA}::uuid[], ${JSON.stringify(fallbackHero)}::jsonb)`]),
    ])
    const [, concurrent] = await tx([sql`SELECT id, featured_order FROM products WHERE featured ORDER BY featured_order`])
    assert.ok([JSON.stringify(favorites), JSON.stringify(orderA)].includes(JSON.stringify(concurrent.map((p) => p.id))))
    assert.deepEqual(
        concurrent.map((p) => p.featured_order),
        favorites.map((_, index) => index + 1)
    )
    await expectFailure([sql`SELECT save_store_highlights('{}'::uuid[], '{"primary":null,"secondary":null}'::jsonb)`, sql`SELECT 1 / 0`], /division by zero/)
    const [, rolledBack] = await tx([sql`SELECT id FROM products WHERE featured ORDER BY featured_order`])
    assert.deepEqual(
        rolledBack.map((p) => p.id),
        concurrent.map((p) => p.id)
    )
    await tx([sql`SELECT save_store_highlights('{}'::uuid[], '{"primary":null,"secondary":null}'::jsonb)`])
    await tx(cleanup.map((statement) => sql.query(statement)))
    const [, legacy] = await tx([
        sql`SELECT column_name FROM information_schema.columns WHERE table_schema = ${schema} AND column_name IN ('img', 'image_url')`,
    ])
    assert.equal(legacy.length, 0)
    // The functions must continue working after the legacy columns are removed.
    await tx([sql`SELECT save_store_product(${id}, ${JSON.stringify(data)}::jsonb, ${JSON.stringify([reversed[1]])}::jsonb)`])
    console.log('IDs estáveis, reordenação, inclusão/remoção, vínculos, desativação, concorrência, rollback e limpeza: OK.')
}
