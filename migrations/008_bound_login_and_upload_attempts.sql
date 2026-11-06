-- Reserva antes de crypt: ON CONFLICT serializa tentativas entre instâncias.
-- A origem é reservada primeiro. Uma origem bloqueada nunca cria buckets de conta.
CREATE OR REPLACE FUNCTION consume_admin_login_attempt(p_account_key text, p_origin_key text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
    bucket record;
    reserved_attempts integer;
    request_time timestamptz := statement_timestamp();
BEGIN
    IF p_account_key IS NULL OR p_account_key !~ '^account:[a-f0-9]{64}$'
       OR p_origin_key IS NULL OR p_origin_key !~ '^origin:[a-f0-9]{64}$' THEN
        RAISE EXCEPTION 'Invalid login rate limit keys';
    END IF;

    -- Limpeza também ocorre nas tentativas bloqueadas.
    DELETE FROM admin_login_attempts
    WHERE bucket_key IN (
        SELECT bucket_key FROM admin_login_attempts
        WHERE expires_at < request_time - interval '1 day'
        ORDER BY expires_at
        FOR UPDATE SKIP LOCKED
        LIMIT 100
    );

    FOR bucket IN
        SELECT * FROM (VALUES (p_origin_key, 30, 1), (p_account_key, 5, 2)) AS limits(bucket_key, attempt_limit, priority)
        ORDER BY priority
    LOOP
        INSERT INTO admin_login_attempts AS current (bucket_key, attempts, expires_at)
        VALUES (bucket.bucket_key, 1, request_time + interval '15 minutes')
        ON CONFLICT (bucket_key) DO UPDATE
        SET attempts = CASE WHEN current.expires_at <= request_time THEN 1
                            ELSE LEAST(current.attempts, bucket.attempt_limit) + 1 END,
            expires_at = CASE WHEN current.expires_at <= request_time THEN EXCLUDED.expires_at
                              ELSE current.expires_at END
        RETURNING attempts INTO reserved_attempts;

        IF reserved_attempts > bucket.attempt_limit THEN
            RETURN false;
        END IF;
    END LOOP;
    RETURN true;
END;
$$;

-- Uma linha por administrador; não cresce com nomes de arquivo ou uploads.
CREATE TABLE admin_upload_attempts (
    admin_id uuid PRIMARY KEY REFERENCES admin_users(id) ON DELETE CASCADE,
    attempts integer NOT NULL CHECK (attempts BETWEEN 1 AND 31),
    expires_at timestamptz NOT NULL
);
REVOKE ALL ON admin_upload_attempts FROM PUBLIC;

CREATE FUNCTION consume_admin_upload_attempt(p_admin_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
    reserved_attempts integer;
    request_time timestamptz := statement_timestamp();
BEGIN
    INSERT INTO admin_upload_attempts AS current (admin_id, attempts, expires_at)
    VALUES (p_admin_id, 1, request_time + interval '15 minutes')
    ON CONFLICT (admin_id) DO UPDATE
    SET attempts = CASE WHEN current.expires_at <= request_time THEN 1 ELSE LEAST(current.attempts, 30) + 1 END,
        expires_at = CASE WHEN current.expires_at <= request_time THEN EXCLUDED.expires_at ELSE current.expires_at END
    RETURNING attempts INTO reserved_attempts;
    RETURN reserved_attempts <= 30;
END;
$$;
REVOKE ALL ON FUNCTION consume_admin_upload_attempt(uuid) FROM PUBLIC;
