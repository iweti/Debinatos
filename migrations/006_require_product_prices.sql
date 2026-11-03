BEGIN;

-- Refuse to finalize until every existing product has a price.
ALTER TABLE products ALTER COLUMN price_cents SET NOT NULL;

COMMIT;
