BEGIN;

-- Reconcile the schema already present on dev with the original product schema.
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured_order integer;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_featured_order_check;
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_featured_order_unique;
WITH ordered AS (
    SELECT id, row_number() OVER (ORDER BY featured_order NULLS LAST, created_at DESC, id)::integer AS position
    FROM products WHERE featured
)
UPDATE products p SET featured_order = o.position FROM ordered o WHERE p.id = o.id;
UPDATE products SET featured_order = NULL WHERE NOT featured;
ALTER TABLE products ADD CONSTRAINT products_featured_order_check CHECK (
    (featured AND featured_order IS NOT NULL AND featured_order > 0)
    OR (NOT featured AND featured_order IS NULL)
);
ALTER TABLE products ADD CONSTRAINT products_featured_order_unique
    UNIQUE (featured_order) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE product_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url text NOT NULL CHECK (length(btrim(url)) > 0),
    position integer NOT NULL CHECK (position > 0),
    UNIQUE (product_id, id),
    UNIQUE (product_id, position) DEFERRABLE INITIALLY DEFERRED
);
INSERT INTO product_images (product_id, url, position)
SELECT p.id, image.url, image.position::integer
FROM products p CROSS JOIN LATERAL unnest(p.img) WITH ORDINALITY AS image(url, position);

CREATE TABLE IF NOT EXISTS hero_products (
    slot text PRIMARY KEY CHECK (slot IN ('primary', 'secondary')),
    product_id uuid REFERENCES products(id) ON DELETE SET NULL,
    image_url text
);
ALTER TABLE hero_products ADD COLUMN image_id uuid;
ALTER TABLE hero_products DROP CONSTRAINT IF EXISTS hero_products_check;
INSERT INTO hero_products (slot) VALUES ('primary'), ('secondary') ON CONFLICT (slot) DO NOTHING;
UPDATE hero_products h SET image_id = (
    SELECT i.id FROM product_images i
    WHERE i.product_id = h.product_id AND i.url = h.image_url ORDER BY i.position LIMIT 1
);
-- Missing photos retain the product, allowing the storefront to use its cover.
UPDATE hero_products SET image_url = NULL WHERE product_id IS NULL;
ALTER TABLE hero_products ADD CONSTRAINT hero_products_image_fkey
    FOREIGN KEY (product_id, image_id) REFERENCES product_images(product_id, id)
    ON DELETE SET NULL (image_id);

-- Old columns are retained only for the deployment transition, never read by the new app.
ALTER TABLE products ALTER COLUMN img DROP NOT NULL;

CREATE FUNCTION save_store_product(p_id uuid, p_data jsonb, p_images jsonb)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
    product_id_value uuid := coalesce(p_id, gen_random_uuid());
    current_image jsonb;
    image_position integer := 0;
BEGIN
    PERFORM pg_advisory_xact_lock(77120001);
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
        INSERT INTO products (id, name, description, stock, category, material, dimensions, active, badge)
        VALUES (product_id_value, p_data->>'name', p_data->>'description', (p_data->>'stock')::integer,
            p_data->>'category', p_data->>'material', p_data->>'dimensions', (p_data->>'active')::boolean, p_data->>'badge');
    ELSE
        UPDATE products SET name = p_data->>'name', description = p_data->>'description', stock = (p_data->>'stock')::integer,
            category = p_data->>'category', material = p_data->>'material', dimensions = p_data->>'dimensions',
            active = (p_data->>'active')::boolean, badge = p_data->>'badge'
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

CREATE FUNCTION save_store_highlights(p_favorites uuid[], p_hero jsonb)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE
    hero_slot text;
    selection jsonb;
    selected_product uuid;
    selected_image uuid;
    previous_product uuid;
    previous_image uuid;
    product_active boolean;
BEGIN
    PERFORM pg_advisory_xact_lock(77120001);
    PERFORM id FROM products ORDER BY id FOR UPDATE;
    PERFORM slot FROM hero_products ORDER BY slot FOR UPDATE;
    IF p_favorites IS NULL OR array_position(p_favorites, NULL) IS NOT NULL
        OR cardinality(p_favorites) <> (SELECT count(DISTINCT id) FROM unnest(p_favorites) id)
        OR EXISTS (
            SELECT 1 FROM unnest(p_favorites) selected(id) LEFT JOIN products p ON p.id = selected.id
            WHERE p.id IS NULL OR (NOT p.active AND NOT p.featured)
        ) THEN RAISE EXCEPTION 'INVALID_FAVORITES'; END IF;
    IF jsonb_typeof(p_hero) IS DISTINCT FROM 'object'
        OR NOT (p_hero ? 'primary' AND p_hero ? 'secondary')
        OR (SELECT count(*) FROM jsonb_object_keys(p_hero)) <> 2 THEN
        RAISE EXCEPTION 'INVALID_HERO';
    END IF;

    FOREACH hero_slot IN ARRAY ARRAY['primary', 'secondary'] LOOP
        selection := p_hero->hero_slot;
        IF selection = 'null'::jsonb THEN CONTINUE; END IF;
        IF jsonb_typeof(selection) IS DISTINCT FROM 'object' OR selection->>'productId' IS NULL THEN
            RAISE EXCEPTION 'INVALID_HERO';
        END IF;
        selected_product := (selection->>'productId')::uuid;
        selected_image := (selection->>'imageId')::uuid;
        SELECT product_id, image_id INTO previous_product, previous_image FROM hero_products WHERE slot = hero_slot;
        SELECT active INTO product_active FROM products WHERE id = selected_product;
        IF NOT FOUND THEN RAISE EXCEPTION 'INVALID_HERO_PRODUCT'; END IF;
        IF NOT product_active AND NOT (
            selected_product IS NOT DISTINCT FROM previous_product AND selected_image IS NOT DISTINCT FROM previous_image
        ) THEN RAISE EXCEPTION 'INACTIVE_HERO_PRODUCT'; END IF;
        IF selected_image IS NULL THEN
            IF selected_product IS DISTINCT FROM previous_product OR previous_image IS NOT NULL THEN
                RAISE EXCEPTION 'INVALID_HERO_IMAGE';
            END IF;
        ELSIF NOT EXISTS (SELECT 1 FROM product_images WHERE id = selected_image AND product_id = selected_product) THEN
            RAISE EXCEPTION 'INVALID_HERO_IMAGE';
        END IF;
    END LOOP;

    UPDATE products p SET featured = f.position IS NOT NULL, featured_order = f.position
    FROM (
        SELECT p2.id, selected.position::integer FROM products p2
        LEFT JOIN unnest(p_favorites) WITH ORDINALITY selected(id, position) ON selected.id = p2.id
    ) f WHERE p.id = f.id;
    FOREACH hero_slot IN ARRAY ARRAY['primary', 'secondary'] LOOP
        selection := p_hero->hero_slot;
        UPDATE hero_products SET product_id = (selection->>'productId')::uuid, image_id = (selection->>'imageId')::uuid
        WHERE slot = hero_slot;
    END LOOP;
END;
$$;

COMMIT;
