import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { promisify } from 'node:util'

import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

// Opt-in integration against a disposable local PostgreSQL container only.
// No DATABASE_URL or production credentials are read by these tests.
const container = process.env.LOGIN_RATE_LIMIT_TEST_CONTAINER
const schema = `test_login_rate_limit_${randomUUID().replaceAll('-', '')}`
const run = promisify(execFile)
const account = `account:${'a'.repeat(64)}`
const origin = `origin:${'b'.repeat(64)}`
const reserve = `SELECT consume_admin_login_attempt('${account}', '${origin}');`

async function query(sql: string) {
    if (!container) throw new Error('Configure um contêiner PostgreSQL descartável em LOGIN_RATE_LIMIT_TEST_CONTAINER.')
    const { stdout } = await run('docker', ['exec', container, 'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-Atq', '-c', sql])
    return stdout.trim()
}

async function isolatedQuery(sql: string) {
    return query(`SET search_path TO ${schema}; ${sql}`)
}

describe.skipIf(!container)('Limite atômico em PostgreSQL descartável', () => {
    beforeAll(async () => {
        const migration = await readFile(new URL('../../../migrations/007_admin_login_rate_limit.sql', import.meta.url), 'utf8')
        const fix = await readFile(new URL('../../../migrations/008_bound_login_and_upload_attempts.sql', import.meta.url), 'utf8')
        await query(`CREATE SCHEMA ${schema}; SET search_path TO ${schema}; CREATE TABLE admin_users (id uuid PRIMARY KEY); ${migration} ${fix}`)
    }, 30000)

    beforeEach(async () => {
        await isolatedQuery('TRUNCATE admin_login_attempts, admin_upload_attempts, admin_users;')
    })

    afterAll(async () => {
        await query(`DROP SCHEMA IF EXISTS ${schema} CASCADE;`)
    })

    it('permite cinco tentativas e bloqueia a sexta sem prolongar a janela', async () => {
        for (let count = 0; count < 5; count++) expect(await isolatedQuery(reserve)).toBe('t')
        const expiry = await isolatedQuery(`SELECT expires_at FROM admin_login_attempts WHERE bucket_key = '${account}';`)
        expect(await isolatedQuery(reserve)).toBe('f')
        expect(await isolatedQuery(reserve)).toBe('f')
        expect(await isolatedQuery(`SELECT expires_at FROM admin_login_attempts WHERE bucket_key = '${account}';`)).toBe(expiry)
        expect(await isolatedQuery(`SELECT attempts FROM admin_login_attempts WHERE bucket_key = '${account}';`)).toBe('6')
    })

    it('mantém o limite da conta ao trocar de origem', async () => {
        for (let count = 0; count < 5; count++) expect(await isolatedQuery(reserve)).toBe('t')
        expect(await isolatedQuery(`SELECT consume_admin_login_attempt('${account}', 'origin:${'c'.repeat(64)}');`)).toBe('f')
    })

    it('limita a origem mesmo com contas diferentes', async () => {
        for (let count = 0; count < 30; count++) {
            const uniqueAccount = `account:${count.toString(16).padStart(64, '0')}`
            expect(await isolatedQuery(`SELECT consume_admin_login_attempt('${uniqueAccount}', '${origin}');`)).toBe('t')
        }
        expect(await isolatedQuery(reserve)).toBe('f')
        expect(await isolatedQuery("SELECT count(*) FROM admin_login_attempts WHERE bucket_key LIKE 'account:%'")).toBe('30')
        for (let count = 100; count < 120; count++) {
            expect(await isolatedQuery(`SELECT consume_admin_login_attempt('account:${count.toString(16).padStart(64, '0')}', '${origin}');`)).toBe('f')
        }
        expect(await isolatedQuery('SELECT count(*) FROM admin_login_attempts')).toBe('31')
    }, 30000)

    it('recupera a janela expirada sem desbloqueio manual', async () => {
        for (let count = 0; count < 6; count++) await isolatedQuery(reserve)
        await isolatedQuery("UPDATE admin_login_attempts SET expires_at = statement_timestamp() - interval '1 second';")
        expect(await isolatedQuery(reserve)).toBe('t')
        expect(await isolatedQuery('SELECT min(attempts), max(attempts) FROM admin_login_attempts;')).toBe('1|1')
    })

    it('admite somente cinco reservas entre vinte conexões simultâneas', async () => {
        const results = await Promise.all(Array.from({ length: 20 }, () => isolatedQuery(reserve)))
        expect(results.filter((result) => result === 't')).toHaveLength(5)
        expect(results.filter((result) => result === 'f')).toHaveLength(15)
    }, 30000)

    it('admite somente trinta contas por origem entre quarenta conexões simultâneas', async () => {
        const results = await Promise.all(
            [...Array(40).keys()].map((index) => {
                const uniqueAccount = `account:${index.toString(16).padStart(64, '0')}`
                return isolatedQuery(`SELECT consume_admin_login_attempt('${uniqueAccount}', '${origin}');`)
            })
        )
        expect(results.filter((result) => result === 't')).toHaveLength(30)
        expect(results.filter((result) => result === 'f')).toHaveLength(10)
        expect(await isolatedQuery('SELECT count(*) FROM admin_login_attempts')).toBe('31')
    }, 30000)

    it('remove no máximo cem chaves expiradas por reserva', async () => {
        await isolatedQuery(
            `INSERT INTO admin_login_attempts SELECT 'account:' || lpad(to_hex(id), 64, '0'), 1, statement_timestamp() - interval '2 days' FROM generate_series(1, 150) id;`
        )
        expect(await isolatedQuery(reserve)).toBe('t')
        expect(await isolatedQuery('SELECT count(*) FROM admin_login_attempts;')).toBe('52')
    })
    it('limita uploads concorrentes por administrador e recupera a janela sem crescer a tabela', async () => {
        const admin = '00000000-0000-0000-0000-000000000001'
        const other = '00000000-0000-0000-0000-000000000002'
        await isolatedQuery(`INSERT INTO admin_users VALUES ('${admin}'), ('${other}');`)
        const upload = `SELECT consume_admin_upload_attempt('${admin}');`
        const results = await Promise.all(Array.from({ length: 40 }, () => isolatedQuery(upload)))
        expect(results.filter((result) => result === 't')).toHaveLength(30)
        expect(results.filter((result) => result === 'f')).toHaveLength(10)
        const expiry = await isolatedQuery(`SELECT expires_at FROM admin_upload_attempts WHERE admin_id = '${admin}';`)
        expect(await isolatedQuery(upload)).toBe('f')
        expect(await isolatedQuery(`SELECT expires_at FROM admin_upload_attempts WHERE admin_id = '${admin}';`)).toBe(expiry)
        expect(await isolatedQuery('SELECT count(*) FROM admin_upload_attempts')).toBe('1')
        expect(await isolatedQuery(`SELECT consume_admin_upload_attempt('${other}');`)).toBe('t')
        await isolatedQuery("UPDATE admin_upload_attempts SET expires_at = statement_timestamp() - interval '1 second';")
        expect(await isolatedQuery(upload)).toBe('t')
    }, 30000)
})
