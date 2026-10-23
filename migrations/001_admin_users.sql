CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE admin_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL CHECK (email = btrim(email) AND length(email) BETWEEN 3 AND 254),
    password_hash text NOT NULL CHECK (password_hash ~ '^\$2[aby]\$[0-9]{2}\$[./A-Za-z0-9]{53}$')
);

CREATE UNIQUE INDEX admin_users_email_unique ON admin_users (lower(email));
