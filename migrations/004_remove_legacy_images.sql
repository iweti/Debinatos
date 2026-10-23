-- Apply only after deploying and validating the app that reads product_images.
BEGIN;
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM products p LEFT JOIN product_images i ON i.product_id = p.id
        GROUP BY p.id HAVING count(i.id) NOT BETWEEN 1 AND 5
            OR min(i.position) <> 1 OR max(i.position) <> count(i.id)
    ) THEN RAISE EXCEPTION 'Confira as imagens e posições antes de remover as colunas antigas.'; END IF;
    IF (SELECT count(*) FROM hero_products WHERE slot IN ('primary', 'secondary')) <> 2 THEN
        RAISE EXCEPTION 'Confira as duas posições do hero antes de continuar.';
    END IF;
END;
$$;
ALTER TABLE products DROP COLUMN img;
ALTER TABLE hero_products DROP COLUMN image_url;
COMMIT;
