CREATE TABLE admin_login_attempts (
    bucket_key text PRIMARY KEY CHECK (bucket_key ~ '^(account|origin):[a-f0-9]{64}$'),
    attempts integer NOT NULL CHECK (attempts > 0),
    expires_at timestamptz NOT NULL
);

CREATE INDEX admin_login_attempts_expiration ON admin_login_attempts (expires_at);
REVOKE ALL ON admin_login_attempts FROM PUBLIC;

-- Reserva antes de crypt: ON CONFLICT serializa tentativas entre instâncias.
-- Ambos os limites contam todos os acessos, inclusive acertos; chamadas bloqueadas
-- não prolongam a janela fixa. A ordem das chaves mantém a aquisição dos locks.
CREATE FUNCTION consume_admin_login_attempt(p_account_key text, p_origin_key text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
    bucket record;
    reserved_attempts integer;
    allowed boolean := true;
    request_time timestamptz := statement_timestamp();
BEGIN
    IF p_account_key IS NULL OR p_account_key !~ '^account:[a-f0-9]{64}$'
       OR p_origin_key IS NULL OR p_origin_key !~ '^origin:[a-f0-9]{64}$' THEN
        RAISE EXCEPTION 'Invalid login rate limit keys';
    END IF;

    FOR bucket IN
        SELECT * FROM (VALUES (p_account_key, 5), (p_origin_key, 30)) AS limits(bucket_key, attempt_limit)
        ORDER BY bucket_key
    LOOP
        INSERT INTO admin_login_attempts AS current (bucket_key, attempts, expires_at)
        VALUES (bucket.bucket_key, 1, request_time + interval '15 minutes')
        ON CONFLICT (bucket_key) DO UPDATE
        SET attempts = CASE WHEN current.expires_at <= request_time THEN 1
                            ELSE LEAST(current.attempts, bucket.attempt_limit) + 1 END,
            expires_at = CASE WHEN current.expires_at <= request_time THEN EXCLUDED.expires_at
                              ELSE current.expires_at END
        RETURNING attempts INTO reserved_attempts;

        allowed := allowed AND reserved_attempts <= bucket.attempt_limit;
    END LOOP;

    -- Limpeza limitada sem esperar por outras reservas. Ambientes inativos
    -- retêm os hashes expirados até uma próxima tentativa de login.
    DELETE FROM admin_login_attempts
    WHERE bucket_key IN (
        SELECT bucket_key FROM admin_login_attempts
        WHERE expires_at < request_time - interval '1 day'
        ORDER BY expires_at
        FOR UPDATE SKIP LOCKED
        LIMIT 100
    );

    RETURN allowed;
END;
$$;

REVOKE ALL ON FUNCTION consume_admin_login_attempt(text, text) FROM PUBLIC;
