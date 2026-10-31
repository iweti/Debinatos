import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { checkEnvironmentParity, environmentReferences } from '../../../scripts/check-env.mjs'
import { validateMigrationEnv, validateValidationEnv } from '../config/env.mjs'

const direct = 'postgresql://user:password@ep-one.example/db'
const pooled = 'postgresql://user:password@ep-one-pooler.example/db'

describe('Configuração de scripts', () => {
    it('aceita a conexão direta sem exigir sessão ou Cloudinary e respeita precedência', () => {
        expect(validateMigrationEnv({ MIGRATION_DATABASE_URL: direct })).toEqual({ databaseUrl: direct })
        expect(validateMigrationEnv({ DATABASE_URL_UNPOOLED: direct })).toEqual({ databaseUrl: direct })
        expect(() => validateMigrationEnv({ MIGRATION_DATABASE_URL: pooled, DATABASE_URL_UNPOOLED: direct })).toThrow('MIGRATION_DATABASE_URL')
    })
    it.each([undefined, '', 'invalid', pooled, 'https://example.com/db'])('recusa conexão inválida ou pooled (%s)', (value) => {
        expect(() => validateMigrationEnv({ MIGRATION_DATABASE_URL: value })).toThrow()
    })
    it('exige destino de validação separado, inclusive com credenciais ou pool diferentes', () => {
        expect(() => validateValidationEnv({ DATABASE_URL: pooled, VALIDATION_DATABASE_URL: direct })).toThrow('VALIDATION_DATABASE_URL')
        expect(() => validateValidationEnv({ DATABASE_URL: direct, VALIDATION_DATABASE_URL: direct.replace('user:password', 'other:secret') })).toThrow()
        expect(validateValidationEnv({ DATABASE_URL: pooled, VALIDATION_DATABASE_URL: direct.replace('ep-one', 'ep-two') }).databaseUrl).toContain('ep-two')
    })
    it('agrega nomes inválidos sem expor os valores no CLI', () => {
        const result = spawnSync(process.execPath, ['scripts/check-env.mjs', '--context=migration'], {
            env: { NODE_ENV: 'test', MIGRATION_DATABASE_URL: 'secret-not-a-url' },
            encoding: 'utf8',
        })
        expect(result.status).toBe(1)
        expect(result.stderr).toContain('MIGRATION_DATABASE_URL')
        expect(result.stderr).not.toContain('secret-not-a-url')
    })
    it('valida somente o contexto escolhido e recusa argumentos desconhecidos', () => {
        const valid = spawnSync(process.execPath, ['scripts/check-env.mjs', '--context=migration'], {
            env: { NODE_ENV: 'test', MIGRATION_DATABASE_URL: direct },
            encoding: 'utf8',
        })
        expect(valid.status).toBe(0)
        const invalid = spawnSync(process.execPath, ['scripts/check-env.mjs', '--context=other'], { env: { NODE_ENV: 'test' }, encoding: 'utf8' })
        expect(invalid.status).toBe(1)
    })
})

describe('Paridade do exemplo', () => {
    it('cobre referências diretas, bracket, aliases e desestruturação, sem ler comentários', async () => {
        const refs = await environmentReferences(
            "// process.env.IGNORED\nconst local = process.env; const { ONE, TWO: renamed } = process.env; local.THREE; process.env['FOUR'];"
        )
        expect([...refs].sort()).toEqual(['FOUR', 'ONE', 'THREE', 'TWO'])
        await expect(environmentReferences('process.env[name]')).rejects.toThrow('dinâmico')
    })
    it('confere as fontes reais sem precisar de credenciais', async () => {
        await expect(checkEnvironmentParity()).resolves.toBeUndefined()
    })
    it('detecta variáveis novas ausentes e entradas sem uso no exemplo', async () => {
        const root = await mkdtemp(join(tmpdir(), 'debinatos-env-parity-'))
        try {
            await mkdir(join(root, 'src'))
            await mkdir(join(root, 'scripts'))
            await writeFile(join(root, 'src', 'consumer.ts'), 'process.env.NEW_SETTING')
            await writeFile(join(root, '.env.example'), 'OBSOLETE=\n')
            await expect(checkEnvironmentParity(root)).rejects.toThrow('NEW_SETTING')
            await expect(checkEnvironmentParity(root)).rejects.toThrow('OBSOLETE')
        } finally {
            await rm(root, { recursive: true, force: true })
        }
    })
})
