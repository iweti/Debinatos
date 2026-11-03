BEGIN;

-- Existing products are filled explicitly before migration 006; no fake defaults.
ALTER TABLE products ADD COLUMN price_cents integer CHECK (price_cents > 0);

CREATE OR REPLACE FUNCTION save_store_product(p_id uuid, p_data jsonb, p_images jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
    product_id_value uuid := coalesce(p_id, gen_random_uuid());
    current_image jsonb;
    image_position integer := 0;
BEGIN
    PERFORM pg_advisory_xact_lock(77120001);
    IF jsonb_typeof(p_data->'priceCents') IS DISTINCT FROM 'number'
        OR (p_data->>'priceCents')::numeric <= 0
        OR (p_data->>'priceCents')::numeric > 2147483647
        OR trunc((p_data->>'priceCents')::numeric) <> (p_data->>'priceCents')::numeric THEN
        RAISE EXCEPTION 'INVALID_PRICE';
    END IF;
    IF jsonb_typeof(p_images) IS DISTINCT FROM 'array' OR jsonb_array_length(p_images) NOT BETWEEN 1 AND 5 THEN
        RAISE EXCEPTION 'INVALID_IMAGES';
    END IF;
    IF p_id IS NOT NULL THEN
        PERFORM id FROM products WHERE id = p_id FOR UPDATE;
        IF NOT FOUND THEN RAISE EXCEPTION 'PRODUCT_NOT_FOUND'; END IF;
    END IF;
    IF EXISTS (
        SELECT 1 FROM jsonb_array_elements(p_images) image
        WHERE image->>'id' IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM product_images i
            WHERE i.id = (image->>'id')::uuid AND i.product_id = p_id AND i.url = image->>'url'
        )
    ) OR (
        SELECT count(*) <> count(DISTINCT image->>'id')
        FROM jsonb_array_elements(p_images) image WHERE image->>'id' IS NOT NULL
    ) THEN RAISE EXCEPTION 'INVALID_IMAGE_REFERENCE'; END IF;

    IF p_id IS NULL THEN
        INSERT INTO products (id, name, description, stock, price_cents, category, material, dimensions, active, badge)
        VALUES (product_id_value, p_data->>'name', p_data->>'description', (p_data->>'stock')::integer, (p_data->>'priceCents')::integer,
            p_data->>'category', p_data->>'material', p_data->>'dimensions', (p_data->>'active')::boolean, p_data->>'badge');
    ELSE
        UPDATE products SET name = p_data->>'name', description = p_data->>'description', stock = (p_data->>'stock')::integer,
            category = p_data->>'category', material = p_data->>'material', dimensions = p_data->>'dimensions',
            active = (p_data->>'active')::boolean, badge = p_data->>'badge', price_cents = (p_data->>'priceCents')::integer
        WHERE id = product_id_value;
    END IF;

    DELETE FROM product_images i WHERE i.product_id = product_id_value AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements(p_images) image WHERE image->>'id' = i.id::text
    );
    FOR current_image IN SELECT value FROM jsonb_array_elements(p_images) LOOP
        image_position := image_position + 1;
        IF current_image->>'id' IS NULL THEN
            INSERT INTO product_images (product_id, url, position) VALUES (product_id_value, current_image->>'url', image_position);
        ELSE
            UPDATE product_images SET position = image_position WHERE id = (current_image->>'id')::uuid AND product_id = product_id_value;
        END IF;
    END LOOP;
    RETURN product_id_value;
END;
$$;

COMMIT;
