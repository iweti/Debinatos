import assert from 'node:assert/strict'

import { neon } from '@neondatabase/serverless'

import { devDatabaseConnection } from './dev-database.mjs'
import { seedPricesSql } from './seed-dev-prices.mjs'

const sql = neon(await devDatabaseConnection())
const snapshot = () => sql`
    SELECT
        (SELECT jsonb_agg(to_jsonb(p) ORDER BY id) FROM products p) AS products,
        (SELECT jsonb_agg(to_jsonb(i) ORDER BY id) FROM product_images i) AS images,
        (SELECT jsonb_agg(to_jsonb(h) ORDER BY slot) FROM hero_products h) AS hero
`
const before = await snapshot()
const [{ missing, valid }] = await sql`
    SELECT count(*) FILTER (WHERE price_cents IS NULL) AS missing,
        coalesce(bool_and(price_cents > 0), true) AS valid FROM products
`
assert.equal(Number(missing), 0)
assert.equal(valid, true)
const [{ is_nullable }] = await sql`
    SELECT is_nullable FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'price_cents'
`
assert.equal(is_nullable, 'NO')

// Every test write lives inside a subtransaction explicitly rolled back at the end.
await sql.query(`
DO $validation$
DECLARE
    product_id_value uuid;
    image_id_value uuid;
    product_data jsonb := '{"name":"Validação temporária de preço","description":"Teste revertido","category":"Teste","material":"Vidro","dimensions":"10 cm","stock":0,"active":true,"priceCents":1990}';
    invalid_price jsonb;
BEGIN
    BEGIN
        product_id_value := save_store_product(NULL, product_data,
            '[{"url":"https://res.cloudinary.com/test/image/upload/validation.webp"}]');
        IF (SELECT price_cents FROM products WHERE id = product_id_value) <> 1990 THEN
            RAISE EXCEPTION 'Preço não persistido na criação';
        END IF;
        SELECT id INTO STRICT image_id_value FROM product_images WHERE product_id = product_id_value;
        PERFORM save_store_product(product_id_value, product_data || '{"priceCents":2990}',
            jsonb_build_array(jsonb_build_object('id', image_id_value, 'url', 'https://res.cloudinary.com/test/image/upload/validation.webp')));
        IF (SELECT price_cents FROM products WHERE id = product_id_value) <> 2990
            OR NOT EXISTS (SELECT 1 FROM product_images WHERE id = image_id_value AND product_id = product_id_value) THEN
            RAISE EXCEPTION 'Edição não preservou preço ou referência da foto';
        END IF;
        FOR invalid_price IN SELECT value FROM jsonb_array_elements('[null,0,-1,19.9,2147483648,"1990",true]') LOOP
            BEGIN
                PERFORM save_store_product(product_id_value, product_data || jsonb_build_object('priceCents', invalid_price),
                    jsonb_build_array(jsonb_build_object('id', image_id_value, 'url', 'https://res.cloudinary.com/test/image/upload/validation.webp')));
                RAISE EXCEPTION 'ACCEPTED_INVALID_PRICE';
            EXCEPTION WHEN OTHERS THEN
                IF SQLERRM <> 'INVALID_PRICE' THEN RAISE; END IF;
            END;
        END LOOP;
        BEGIN
            PERFORM save_store_product(NULL, product_data - 'priceCents', '[{"url":"https://example.com/test.webp"}]');
            RAISE EXCEPTION 'ACCEPTED_MISSING_PRICE';
        EXCEPTION WHEN OTHERS THEN
            IF SQLERRM <> 'INVALID_PRICE' THEN RAISE; END IF;
        END;
        BEGIN
            UPDATE products SET price_cents = 0 WHERE id = product_id_value;
            RAISE EXCEPTION 'ACCEPTED_ZERO_PRICE';
        EXCEPTION WHEN check_violation THEN NULL;
        END;
        BEGIN
            UPDATE products SET price_cents = NULL WHERE id = product_id_value;
            RAISE EXCEPTION 'ACCEPTED_NULL_PRICE';
        EXCEPTION WHEN not_null_violation THEN NULL;
        END;
        RAISE EXCEPTION USING ERRCODE = 'P0002', MESSAGE = 'VALIDATION_ROLLBACK';
    EXCEPTION WHEN no_data_found THEN
        IF SQLERRM <> 'VALIDATION_ROLLBACK' THEN RAISE; END IF;
    END;
END;
$validation$;
`)
assert.deepEqual(await snapshot(), before, 'Os testes devem reverter todas as alterações.')
assert.deepEqual(await sql.query(seedPricesSql), [], 'O preenchimento não deve substituir preços existentes.')
assert.deepEqual(await snapshot(), before)
console.log('Dev validada: preço obrigatório, criação, edição, fotos preservadas, rejeições, rollback e seed idempotente.')
