import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ sql: vi.fn(), consume: vi.fn(), createSession: vi.fn(), redirect: vi.fn() }))
vi.mock('@/lib/server/db', () => ({ database: () => mocks.sql }))
vi.mock('@/lib/server/login-rate-limit', () => ({ consumeLoginAttempt: mocks.consume }))
vi.mock('@/lib/server/auth', () => ({ createSession: mocks.createSession, deleteSession: vi.fn(), requireAdmin: vi.fn() }))
vi.mock('@/lib/server/cloudinary', () => ({ imageService: vi.fn(), validImageUrl: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }))

import { login } from '@/app/admin/_lib/actions'

function credentials(email = 'admin@example.com', password = 'some-password') {
    const form = new FormData()
    form.set('email', email)
    form.set('password', password)
    return form
}

beforeEach(() => {
    vi.resetAllMocks()
    mocks.consume.mockResolvedValue(true)
    mocks.sql.mockResolvedValue([])
})

describe('Login administrativo limitado', () => {
    it('verifica o limite antes de qualquer consulta de senha e não consulta durante o bloqueio', async () => {
        mocks.consume.mockResolvedValueOnce(true).mockResolvedValue(false)
        const failedPassword = await login({}, credentials())
        for (let index = 0; index < 100; index++) expect(await login({}, credentials())).toEqual(failedPassword)
        expect(mocks.consume).toHaveBeenCalledTimes(101)
        expect(mocks.sql).toHaveBeenCalledTimes(1)
        expect(mocks.sql.mock.calls[0][0].join('')).toContain('crypt')
        expect(mocks.consume.mock.invocationCallOrder[0]).toBeLessThan(mocks.sql.mock.invocationCallOrder[0])
        expect(mocks.createSession).not.toHaveBeenCalled()
    })

    it('permite login válido depois que o armazenamento libera uma nova janela', async () => {
        mocks.consume.mockResolvedValueOnce(false).mockResolvedValueOnce(true)
        await login({}, credentials())
        expect(mocks.sql).not.toHaveBeenCalled()
        mocks.sql.mockResolvedValue([{ id: 'admin-id' }])
        await login({}, credentials())
        expect(mocks.createSession).toHaveBeenCalledWith('admin-id')
        expect(mocks.redirect).toHaveBeenCalledWith('/admin')
    })

    it('falha fechado sem crypt nem sessão quando o limitador está indisponível', async () => {
        const log = vi.spyOn(console, 'error').mockImplementation(() => {})
        try {
            mocks.consume.mockRejectedValue(new Error('Storage unavailable'))
            expect((await login({}, credentials())).error).toContain('Não foi possível entrar agora')
            expect(mocks.sql).not.toHaveBeenCalled()
            expect(mocks.createSession).not.toHaveBeenCalled()
        } finally {
            log.mockRestore()
        }
    })

    it('recusa campos inválidos sem reservar tentativas nem consultar crypt', async () => {
        expect((await login({}, credentials('invalid'))).error).toBeTruthy()
        expect((await login({}, credentials('admin@example.com', 'a'.repeat(73)))).error).toBeTruthy()
        expect(mocks.consume).not.toHaveBeenCalled()
        expect(mocks.sql).not.toHaveBeenCalled()
    })
})
