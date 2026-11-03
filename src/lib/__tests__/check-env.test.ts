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
    it('recusa host pooled com escapes que o SDK Neon normaliza antes de conectar', () => {
        const disguisedPooled = pooled.replace('-pooler', '%2Dpoo%6cer')
        expect(() => validateMigrationEnv({ MIGRATION_DATABASE_URL: disguisedPooled })).toThrow('MIGRATION_DATABASE_URL')
        expect(() => validateValidationEnv({ DATABASE_URL: direct.replace('ep-one', 'ep-two'), VALIDATION_DATABASE_URL: disguisedPooled })).toThrow(
            'VALIDATION_DATABASE_URL'
        )
    })
    it('exige destino de validação separado, inclusive com credenciais ou pool diferentes', () => {
        expect(() => validateValidationEnv({ DATABASE_URL: pooled, VALIDATION_DATABASE_URL: direct })).toThrow('VALIDATION_DATABASE_URL')
        expect(() => validateValidationEnv({ DATABASE_URL: direct, VALIDATION_DATABASE_URL: direct.replace('user:password', 'other:secret') })).toThrow()
        expect(validateValidationEnv({ DATABASE_URL: pooled, VALIDATION_DATABASE_URL: direct.replace('ep-one', 'ep-two') }).databaseUrl).toContain('ep-two')
    })
    it.each([
        [direct, direct.replace('ep-one', 'ep-%6fne')],
        [direct.replace('ep-one', 'ep-%6fne'), direct],
        [pooled.replace('-pooler', '%2Dpooler'), direct.replace('ep-one', 'EP-%6FNE')],
    ])('recusa origem e destino que identificam o mesmo banco após normalizar o host (%s)', (source, target) => {
        expect(() => validateValidationEnv({ DATABASE_URL: source, VALIDATION_DATABASE_URL: target })).toThrow('VALIDATION_DATABASE_URL')
    })
    it('aceita hosts escapados quando identificam bancos separados', () => {
        const target = direct.replace('ep-one', 'ep-%74wo')
        expect(validateValidationEnv({ DATABASE_URL: direct, VALIDATION_DATABASE_URL: target }).databaseUrl).toBe(target)
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
    it.each([
        'const { env } = process; env.NEW_SETTING',
        'const { env: variables } = process; variables.NEW_SETTING',
        'const { env: { NEW_SETTING: value } } = process',
        "import { env } from 'node:process'; env.NEW_SETTING",
        "import { env as variables } from 'node:process'; variables.NEW_SETTING",
        "import * as runtime from 'node:process'; runtime.env.NEW_SETTING",
        "import runtime from 'node:process'; runtime.env.NEW_SETTING",
        "import { default as runtime } from 'node:process'; runtime.env.NEW_SETTING",
        "import { env as variables } from 'process'; const copy = variables; copy['NEW_SETTING']",
        "const runtime = process; const { ['env']: variables } = runtime; const { NEW_SETTING: value } = variables",
        'function read() { const variables = runtime.env; return variables.NEW_SETTING }; const runtime = process',
    ])('acompanha imports e aliases de process/env (%s)', async (source) => {
        expect([...(await environmentReferences(source))]).toEqual(['NEW_SETTING'])
    })
    it.each(["import { env as variables } from 'node:process'; variables[name]", 'const { env: variables } = process; const { [name]: value } = variables'])(
        'recusa acesso dinâmico por aliases (%s)',
        async (source) => {
            await expect(environmentReferences(source)).rejects.toThrow('dinâmic')
        }
    )
    it('confere as fontes reais sem precisar de credenciais', async () => {
        await expect(checkEnvironmentParity()).resolves.toBeUndefined()
    })
    it.each([
        'process.env.NEW_SETTING',
        'const { env } = process; env.NEW_SETTING',
        "import { env as variables } from 'node:process'; variables.NEW_SETTING",
        "import * as runtime from 'node:process'; runtime.env.NEW_SETTING",
    ])('detecta variáveis novas ausentes e entradas sem uso no exemplo (%s)', async (source) => {
        const root = await mkdtemp(join(tmpdir(), 'debinatos-env-parity-'))
        try {
            await mkdir(join(root, 'src'))
            await mkdir(join(root, 'scripts'))
            await writeFile(join(root, 'src', 'consumer.ts'), source)
            await writeFile(join(root, '.env.example'), 'OBSOLETE=\n')
            await expect(checkEnvironmentParity(root)).rejects.toThrow('NEW_SETTING')
            await expect(checkEnvironmentParity(root)).rejects.toThrow('OBSOLETE')
        } finally {
            await rm(root, { recursive: true, force: true })
        }
    })
})
