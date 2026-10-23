CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 100),
    description text NOT NULL CHECK (length(btrim(description)) BETWEEN 1 AND 2000),
    stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    category text NOT NULL CHECK (length(btrim(category)) BETWEEN 1 AND 40),
    material text NOT NULL CHECK (length(btrim(material)) BETWEEN 1 AND 150),
    dimensions text NOT NULL CHECK (length(btrim(dimensions)) BETWEEN 1 AND 150),
    active boolean NOT NULL DEFAULT true,
    featured boolean NOT NULL DEFAULT false,
    badge text CHECK (badge IS NULL OR length(badge) BETWEEN 1 AND 40),
    img text[] NOT NULL CHECK (cardinality(img) BETWEEN 1 AND 5 AND array_position(img, NULL) IS NULL)
);
