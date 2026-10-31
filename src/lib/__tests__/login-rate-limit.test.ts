import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ sql: vi.fn(), headers: vi.fn(), secret: 's'.repeat(32), vercel: '' }))
vi.mock('server-only', () => ({}))
vi.mock('@/lib/server/db', () => ({ database: () => mocks.sql }))
vi.mock('next/headers', () => ({ headers: mocks.headers }))
vi.mock('@/lib/server/env', () => ({
    env: {
        get SESSION_SECRET() {
            return mocks.secret
        },
        get VERCEL() {
            return mocks.vercel
        },
    },
}))

import { consumeLoginAttempt, loginRateLimitKeys } from '@/lib/server/login-rate-limit'

beforeEach(() => {
    vi.resetAllMocks()
    mocks.secret = 's'.repeat(32)
    mocks.vercel = ''
    mocks.headers.mockResolvedValue(new Headers())
})

describe('Chaves do limite de login', () => {
    it('normaliza a conta e guarda somente HMACs separados por finalidade', () => {
        const first = loginRateLimitKeys(' ADMIN@Example.COM ', new Headers())
        expect(first).toEqual(loginRateLimitKeys('admin@example.com', new Headers()))
        expect(first.account).toMatch(/^account:[a-f0-9]{64}$/)
        expect(first.origin).toMatch(/^origin:[a-f0-9]{64}$/)
        expect(first.account).not.toContain('admin')
    })

    it('ignora IPs forjados fora do ingresso confiável da Vercel', () => {
        const original = loginRateLimitKeys('admin@example.com', new Headers())
        const forged = new Headers({ 'x-vercel-forwarded-for': '203.0.113.1', 'x-forwarded-for': '198.51.100.2', 'x-real-ip': '192.0.2.3' })
        expect(loginRateLimitKeys('admin@example.com', forged)).toEqual(original)
    })

    it('na Vercel usa somente um IP válido do header da plataforma', () => {
        mocks.vercel = '1'
        const first = loginRateLimitKeys('admin@example.com', new Headers({ 'x-vercel-forwarded-for': '203.0.113.1' }))
        const changedAccount = loginRateLimitKeys('other@example.com', new Headers({ 'x-vercel-forwarded-for': '203.0.113.1' }))
        const changedOrigin = loginRateLimitKeys('admin@example.com', new Headers({ 'x-vercel-forwarded-for': '203.0.113.2' }))
        expect(first.account).toBe(changedOrigin.account)
        expect(first.origin).toBe(changedAccount.origin)
        expect(first.origin).not.toBe(changedOrigin.origin)
        const fallback = loginRateLimitKeys('admin@example.com', new Headers())
        expect(loginRateLimitKeys('admin@example.com', new Headers({ 'x-forwarded-for': '203.0.113.1' }))).toEqual(fallback)
        expect(loginRateLimitKeys('admin@example.com', new Headers({ 'x-vercel-forwarded-for': '203.0.113.1, 203.0.113.2' }))).toEqual(fallback)
        expect(loginRateLimitKeys('admin@example.com', new Headers({ 'x-vercel-forwarded-for': 'invalid' }))).toEqual(fallback)
    })

    it('canonicaliza representações equivalentes de IPv6', () => {
        mocks.vercel = '1'
        expect(loginRateLimitKeys('admin@example.com', new Headers({ 'x-vercel-forwarded-for': '2001:db8::1' }))).toEqual(
            loginRateLimitKeys('admin@example.com', new Headers({ 'x-vercel-forwarded-for': '2001:0db8:0:0:0:0:0:0001' }))
        )
    })

    it('recusa segredo insuficiente para as chaves compartilhadas', () => {
        mocks.secret = ''
        expect(() => loginRateLimitKeys('admin@example.com', new Headers())).toThrow('SESSION_SECRET')
    })
})

describe('Reserva compartilhada antes da autenticação', () => {
    it('envia as chaves ao banco e exige confirmação explícita', async () => {
        mocks.sql
            .mockResolvedValueOnce([{ allowed: true }])
            .mockResolvedValueOnce([{ allowed: false }])
            .mockResolvedValueOnce([])
        expect(await consumeLoginAttempt('admin@example.com')).toBe(true)
        expect(await consumeLoginAttempt('admin@example.com')).toBe(false)
        expect(await consumeLoginAttempt('admin@example.com')).toBe(false)
        expect(mocks.sql.mock.calls[0][0].join('')).toContain('consume_admin_login_attempt')
        expect(mocks.sql.mock.calls[0].slice(1).every((key: string) => !key.includes('@'))).toBe(true)
    })

    it('propaga falhas do armazenamento para a ação negar o login', async () => {
        mocks.sql.mockRejectedValue(new Error('Unavailable'))
        await expect(consumeLoginAttempt('admin@example.com')).rejects.toThrow('Unavailable')
    })
})
