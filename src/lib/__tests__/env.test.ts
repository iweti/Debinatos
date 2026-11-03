import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'

import { EnvironmentError, type EnvironmentSource, RUNTIME_ENV_KEYS, validateRuntimeEnv } from '@/lib/config/env.mjs'

vi.mock('server-only', () => ({}))

const valid = {
    DATABASE_URL: 'postgresql://test:test@database.invalid/catalogo?sslmode=require',
    SESSION_SECRET: 'segredo-ficticio-exclusivo-de-testes-32',
    CLOUDINARY_CLOUD_NAME: 'loja-teste',
    CLOUDINARY_API_KEY: 'chave-ficticia',
    CLOUDINARY_API_SECRET: 'segredo-cloudinary-ficticio',
    NODE_ENV: 'test',
}

function invalidVariables(source: EnvironmentSource) {
    try {
        validateRuntimeEnv(source)
    } catch (error) {
        expect(error).toBeInstanceOf(EnvironmentError)
        return error as EnvironmentError
    }
    throw new Error('A configuração deveria ter sido recusada.')
}

beforeEach(() => {
    vi.resetModules()
    for (const name of RUNTIME_ENV_KEYS) vi.stubEnv(name, undefined)
    vi.stubEnv('NEXT_PHASE', undefined)
    vi.stubEnv('NEXT_RUNTIME', undefined)
})

afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
})

describe('Configuração compartilhada do runtime', () => {
    it('agrega todas as ausências e informa somente nomes, sem valores de credenciais', () => {
        expect(invalidVariables({}).variables).toEqual([
            'DATABASE_URL',
            'SESSION_SECRET',
            'CLOUDINARY_CLOUD_NAME',
            'CLOUDINARY_API_KEY',
            'CLOUDINARY_API_SECRET',
            'NODE_ENV',
        ])
        const source = { ...valid, DATABASE_URL: 'https://usuario:senha-confidencial@database.invalid/db', SESSION_SECRET: 'segredo-curto' }
        const error = invalidVariables(source)
        expect(error.variables).toEqual(['DATABASE_URL', 'SESSION_SECRET'])
        expect(error.message).not.toContain('senha-confidencial')
        expect(error.message).not.toContain(source.DATABASE_URL)
        expect(error.message).not.toContain(source.SESSION_SECRET)
    })

    it.each(['', 'http://example.com/db', 'postgres://', 'postgresql://database.invalid', 'postgres://host/db#fragment', 'postgres://host/db name'])(
        'recusa URL Postgres inválida: %s',
        (DATABASE_URL) => expect(invalidVariables({ ...valid, DATABASE_URL }).variables).toEqual(['DATABASE_URL'])
    )

    it.each(['postgres://user:password@database.invalid/catalogo', 'postgresql://database.invalid/catalogo'])(
        'aceita os dois esquemas Postgres: %s',
        (DATABASE_URL) => expect(validateRuntimeEnv({ ...valid, DATABASE_URL }).DATABASE_URL).toBe(DATABASE_URL)
    )

    it('mede o segredo por bytes UTF-8, preserva seus bytes e recusa segredo vazio', () => {
        expect(validateRuntimeEnv({ ...valid, SESSION_SECRET: 'é'.repeat(16) }).SESSION_SECRET).toBe('é'.repeat(16))
        expect(invalidVariables({ ...valid, SESSION_SECRET: 'é'.repeat(15) }).variables).toEqual(['SESSION_SECRET'])
        expect(invalidVariables({ ...valid, SESSION_SECRET: ' '.repeat(32) }).variables).toEqual(['SESSION_SECRET'])
        const secret = ` ${'x'.repeat(32)} `
        expect(validateRuntimeEnv({ ...valid, SESSION_SECRET: secret }).SESSION_SECRET).toBe(secret)
    })

    it.each(['development', 'production', 'test'])('aceita NODE_ENV=%s', (NODE_ENV) => {
        expect(validateRuntimeEnv({ ...valid, NODE_ENV }).NODE_ENV).toBe(NODE_ENV)
    })

    it.each([undefined, '', 'preview', 'PRODUCTION'])('recusa NODE_ENV inválido: %s', (NODE_ENV) => {
        expect(invalidVariables({ ...valid, NODE_ENV }).variables).toEqual(['NODE_ENV'])
    })

    it.each(['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'])('exige %s preenchida', (key) => {
        expect(invalidVariables({ ...valid, [key]: '  ' }).variables).toEqual([key])
    })

    it('normaliza campos opcionais vazios e usa a pasta padrão', () => {
        const env = validateRuntimeEnv({ ...valid, CLOUDINARY_FOLDER: '   ', WHATSAPP_PHONE: '  ' })
        expect(env.CLOUDINARY_FOLDER).toBe('debinatos')
        expect(env.WHATSAPP_PHONE).toBeUndefined()
        expect(validateRuntimeEnv(valid).CLOUDINARY_FOLDER).toBe('debinatos')
        expect(validateRuntimeEnv({ ...valid, CLOUDINARY_FOLDER: ' loja/fotos ' }).CLOUDINARY_FOLDER).toBe('loja/fotos')
    })

    it.each(['551199999999', '5511999999999'])('aceita telefone de 12 ou 13 dígitos: %s', (WHATSAPP_PHONE) => {
        expect(validateRuntimeEnv({ ...valid, WHATSAPP_PHONE: ` ${WHATSAPP_PHONE} ` }).WHATSAPP_PHONE).toBe(WHATSAPP_PHONE)
    })

    it.each(['+5511999999999', '55119-99999999', '55119999999', '55119999999999', 'telefone'])('recusa telefone malformado: %s', (WHATSAPP_PHONE) =>
        expect(invalidVariables({ ...valid, WHATSAPP_PHONE }).variables).toEqual(['WHATSAPP_PHONE'])
    )

    it('devolve objeto congelado e só confia no marcador exato da Vercel', () => {
        const env = validateRuntimeEnv({ ...valid, VERCEL: '1' })
        expect(Object.isFrozen(env)).toBe(true)
        expectTypeOf(env.NODE_ENV).toEqualTypeOf<'development' | 'production' | 'test'>()
        expect(() => Object.assign(env, { SESSION_SECRET: 'alterado' })).toThrow(TypeError)
        expect(env.VERCEL).toBe('1')
        expect(validateRuntimeEnv({ ...valid, VERCEL: 'true' }).VERCEL).toBeUndefined()
        expect(valid).not.toHaveProperty('CLOUDINARY_FOLDER')
    })
})

describe('Fronteira server-only e inicialização do Next.js', () => {
    it('permite importar o módulo sem secrets e valida somente quando usado', async () => {
        const { env, getServerEnv } = await import('@/lib/server/env')
        expect(Object.isFrozen(env)).toBe(true)
        expect(() => getServerEnv()).toThrow('DATABASE_URL, SESSION_SECRET')
        expect(Object.keys(env)).toEqual(RUNTIME_ENV_KEYS)
        expect(() => env.WHATSAPP_PHONE).toThrow('Variáveis de ambiente ausentes ou inválidas:')
    })

    it('mantém um único snapshot tipado e congelado após validar', async () => {
        for (const [name, value] of Object.entries(valid)) vi.stubEnv(name, value)
        const { env, getServerEnv } = await import('@/lib/server/env')
        const first = getServerEnv()
        vi.stubEnv('SESSION_SECRET', 'valor-alterado')
        expect(getServerEnv()).toBe(first)
        expect(Object.isFrozen(first)).toBe(true)
        expect(env.SESSION_SECRET).toBe(valid.SESSION_SECRET)
    })

    it('não exige credenciais durante o build nem importa configuração Node no Edge', async () => {
        const { register } = await import('@/instrumentation')
        vi.stubEnv('NEXT_RUNTIME', 'nodejs')
        vi.stubEnv('NEXT_PHASE', 'phase-production-build')
        await expect(register()).resolves.toBeUndefined()
        vi.stubEnv('NEXT_PHASE', undefined)
        vi.stubEnv('NEXT_RUNTIME', 'edge')
        await expect(register()).resolves.toBeUndefined()
    })

    it('recusa o boot Node com todos os nomes inválidos antes de atender requisições', async () => {
        vi.stubEnv('NEXT_RUNTIME', 'nodejs')
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})
        const exit = vi.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('PROCESS_EXIT_1')
        })
        const { register } = await import('@/instrumentation')
        await expect(register()).rejects.toThrow('PROCESS_EXIT_1')
        expect(exit).toHaveBeenCalledWith(1)
        expect(log).toHaveBeenCalledWith(
            'Variáveis de ambiente ausentes ou inválidas: DATABASE_URL, SESSION_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, NODE_ENV.'
        )
    })

    it('conclui a inicialização com configuração válida sem chamar serviços externos', async () => {
        for (const [name, value] of Object.entries(valid)) vi.stubEnv(name, value)
        vi.stubEnv('NEXT_RUNTIME', 'nodejs')
        const { register } = await import('@/instrumentation')
        await expect(register()).resolves.toBeUndefined()
    })
})
