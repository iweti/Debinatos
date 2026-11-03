import { execFile, execFileSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { migrationPlan, migrationTransaction, migrationVersion } from '../../../scripts/migrate.mjs'

const directories: string[] = []
async function fixture(sources: string[]) {
    const directory = await mkdtemp(join(tmpdir(), 'debinatos-migrations-'))
    directories.push(directory)
    for (const [index, source] of sources.entries()) await writeFile(join(directory, `${String(index + 1).padStart(3, '0')}_probe.sql`), source)
    return directory
}
afterEach(async () => {
    await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

describe('Catálogo seguro de migrações', () => {
    it.each(['../001_a.sql', '/001_a.sql', '001_a.sql/../../x', '001_a.sql\n', '000_zero.sql', '1_short.sql', '001_bad-name.sql', '001_a.sql;SELECT 1'])(
        'recusa %s',
        (name) => {
            expect(() => migrationVersion(name)).toThrow()
        }
    )

    it('aceita 008 e versões posteriores sem limitar os sete arquivos atuais', async () => {
        const directory = await fixture(Array.from({ length: 8 }, () => 'SELECT 1;'))
        expect((await migrationPlan('008_probe.sql', { directory })).target.version).toBe(8)
    })

    it('rejeita versões duplicadas, lacunas, arquivo ausente e link simbólico', async () => {
        const directory = await fixture(['SELECT 1;'])
        await expect(migrationPlan('002_missing.sql', { directory })).rejects.toThrow('não existe')
        await writeFile(join(directory, '003_gap.sql'), 'SELECT 1;')
        await expect(migrationPlan('001_probe.sql', { directory })).rejects.toThrow('consecutivas')
        await rm(join(directory, '003_gap.sql'))
        await writeFile(join(directory, '0001_duplicate.sql'), 'SELECT 1;')
        await expect(migrationPlan('001_probe.sql', { directory })).rejects.toThrow('únicas')
        await rm(join(directory, '0001_duplicate.sql'))
        const { symlink } = await import('node:fs/promises')
        await symlink(join(directory, '001_probe.sql'), join(directory, '002_link.sql'))
        await expect(migrationPlan('002_link.sql', { directory })).rejects.toThrow('links simbólicos')
    })

    it('exige evidência de publicação e validação antes da 004', async () => {
        await expect(migrationPlan('004_remove_legacy_images.sql')).rejects.toThrow('SHA')
        await expect(migrationPlan('004_remove_legacy_images.sql', { compatibleSha: 'a'.repeat(40) })).rejects.toThrow('HTTPS')
        const plan = await migrationPlan('004_remove_legacy_images.sql', {
            compatibleSha: 'a'.repeat(40),
            validationReference: 'https://github.com/iweti/Debinatos/issues/17',
        })
        expect(plan.evidence).toContain('a'.repeat(40))
        await expect(migrationPlan('004_remove_legacy_images.sql', { verify: true })).resolves.toMatchObject({ verify: true })
    })

    it('baseline exige inspeção explícita e só aceita as sete migrações históricas', async () => {
        await expect(migrationPlan('007_admin_login_rate_limit.sql', { baseline: true })).rejects.toThrow('inspecionadas')
        await expect(migrationPlan('007_admin_login_rate_limit.sql', { baseline: true, baselineInspected: true })).rejects.toThrow('HTTPS')
        const directory = await fixture(Array.from({ length: 8 }, () => 'SELECT 1;'))
        await expect(
            migrationPlan('008_probe.sql', { directory, baseline: true, baselineInspected: true, inspectionReference: 'https://example.com/review' })
        ).rejects.toThrow('001–007')
    })
})

// Mesmo opt-in do teste SQL do limitador: somente PostgreSQL local descartável,
// nunca DATABASE_URL nem um endpoint real da aplicação.
const container = process.env.LOGIN_RATE_LIMIT_TEST_CONTAINER ?? ''

describe.skipIf(!container)('Runner em PostgreSQL isolado', () => {
    let database: string
    const query = (sql: string, target = database) =>
        execFileSync('docker', ['exec', '-i', container, 'psql', '-X', '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', target], {
            input: sql,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim()
    const execute = (plan: Awaited<ReturnType<typeof migrationPlan>>) =>
        query(`BEGIN${plan.verify ? ' READ ONLY' : ''};\n${migrationTransaction(plan).join(';\n')};\nCOMMIT;`)
    beforeEach(() => {
        database = `issue17_${randomUUID().replaceAll('-', '')}`
        query(`CREATE DATABASE ${database};`, 'postgres')
    })
    afterEach(() => {
        query(`DROP DATABASE ${database} WITH (FORCE);`, 'postgres')
    })

    it('aplica uma vez, recusa salto/edição de checksum e verifica histórico sem DDL', async () => {
        const directory = await fixture(['CREATE TABLE marker (id int); INSERT INTO marker VALUES (1);', 'ALTER TABLE marker ADD COLUMN ready boolean;'])
        const first = await migrationPlan('001_probe.sql', { directory })
        const second = await migrationPlan('002_probe.sql', { directory })
        expect(() => execute(second)).toThrow('MIGRATION_PREDECESSOR_REQUIRED')
        execute(first)
        execute(first)
        expect(query('SELECT count(*) FROM marker')).toBe('1')
        expect(() => execute(second)).not.toThrow()
        execute(await migrationPlan('002_probe.sql', { directory, verify: true }))
        await writeFile(join(directory, '001_probe.sql'), 'SELECT 123;')
        expect(() => execute(first)).not.toThrow() // O catálogo original ainda confere.
        const modified = await migrationPlan('002_probe.sql', { directory })
        expect(() => execute(modified)).toThrow('MIGRATION_HISTORY_CONFLICT')
    })

    it('rollback remove DDL e registro quando uma instrução falha', async () => {
        const directory = await fixture(['CREATE TABLE first_marker (id int);', 'CREATE TABLE rolled_back (id int); SELECT 1 / 0;'])
        execute(await migrationPlan('001_probe.sql', { directory }))
        const failing = await migrationPlan('002_probe.sql', { directory })
        expect(() => execute(failing)).toThrow('division by zero')
        expect(query("SELECT to_regclass('public.rolled_back') IS NULL")).toBe('t')
        expect(query('SELECT count(*) FROM public.schema_migrations')).toBe('1')
    })

    it('falha inicial também desfaz a criação do registro', async () => {
        const directory = await fixture(['CREATE TABLE rolled_back (id int); SELECT 1 / 0;'])
        const plan = await migrationPlan('001_probe.sql', { directory })
        expect(() => execute(plan)).toThrow('division by zero')
        expect(query("SELECT to_regclass('public.schema_migrations') IS NULL")).toBe('t')
    })

    it('serializa pelo advisory lock e não admite histórico com lacuna', async () => {
        const directory = await fixture(['SELECT 1;', 'SELECT 2;'])
        execute(await migrationPlan('001_probe.sql', { directory }))
        execute(await migrationPlan('002_probe.sql', { directory }))
        query('DELETE FROM public.schema_migrations WHERE version = 1')
        const plan = await migrationPlan('002_probe.sql', { directory })
        expect(() => execute(plan)).toThrow('MIGRATION_HISTORY_GAP')
        expect(migrationTransaction(plan).findIndex((sql: string) => sql.includes('pg_advisory_xact_lock'))).toBeLessThan(
            migrationTransaction(plan).findIndex((sql: string) => sql.startsWith('CREATE TABLE'))
        )
    })

    it('duas execuções concorrentes confirmam uma única aplicação', async () => {
        const directory = await fixture(['CREATE TABLE once_only (id int); INSERT INTO once_only VALUES (1); SELECT pg_sleep(0.1);'])
        const plan = await migrationPlan('001_probe.sql', { directory })
        const input = `BEGIN;\n${migrationTransaction(plan).join(';\n')};\nCOMMIT;`
        const apply = () =>
            new Promise<void>((resolve, reject) => {
                const child = execFile(
                    'docker',
                    ['exec', '-i', container, 'psql', '-X', '-q', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', database],
                    (error) => (error ? reject(error) : resolve())
                )
                child.stdin?.end(input)
            })
        await Promise.all([apply(), apply()])
        expect(query('SELECT count(*) FROM once_only')).toBe('1')
        expect(query('SELECT count(*) FROM public.schema_migrations')).toBe('1')
    })

    it('executa 001–007 reais e registra baseline existente sem reaplicar SQL', async () => {
        const names = [
            '001_admin_users.sql',
            '002_products.sql',
            '003_product_images_highlights.sql',
            '004_remove_legacy_images.sql',
            '005_product_prices.sql',
            '006_require_product_prices.sql',
            '007_admin_login_rate_limit.sql',
        ]
        for (const name of names)
            execute(await migrationPlan(name, { compatibleSha: 'a'.repeat(40), validationReference: 'https://example.com/published-validation' }))
        expect(query('SELECT count(*) FROM public.schema_migrations')).toBe('7')
        execute(await migrationPlan(names[6]))
        query('DROP TABLE public.schema_migrations')
        const plan = await migrationPlan(names[6], { baseline: true, baselineInspected: true, inspectionReference: 'https://example.com/schema-review' })
        execute(plan)
        execute(plan)
        expect(query("SELECT count(*) FROM public.schema_migrations WHERE method = 'baseline'")).toBe('7')
        execute(await migrationPlan(names[6], { verify: true }))
    })
})
