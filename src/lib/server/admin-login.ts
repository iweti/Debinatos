import 'server-only'

import type { ActionResult } from '@/lib/types/admin'

import { createSession } from './auth'
import { database } from './db'
import { consumeLoginAttempt } from './login-rate-limit'

export async function authenticateAdmin(form: FormData): Promise<ActionResult> {
    const email = form.get('email')
    const password = form.get('password')
    if (
        typeof email !== 'string' ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        email.trim().length > 254 ||
        typeof password !== 'string' ||
        !password ||
        password.includes('\0') ||
        Buffer.byteLength(password, 'utf8') > 72
    ) {
        return { error: 'Informe um e-mail válido e uma senha de até 72 bytes.' }
    }
    const loginFailure = { error: 'Não foi possível entrar. Confira os dados ou aguarde 15 minutos antes de tentar novamente.' }
    let stage = 'rate-limit'
    try {
        if (!(await consumeLoginAttempt(email))) return loginFailure
        stage = 'database'
        const [user] = await database()`
            SELECT id FROM admin_users
            WHERE lower(email) = lower(${email.trim()}) AND password_hash = crypt(${password}, password_hash)
        `
        if (!user) return loginFailure
        stage = 'session'
        await createSession(user.id)
    } catch (error) {
        console.error('[admin/login] Falha ao entrar.', {
            stage,
            name: error instanceof Error ? error.name : 'UnknownError',
            code: error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' ? error.code : undefined,
        })
        return { error: 'Não foi possível entrar agora. Tente novamente em instantes.' }
    }
    return { success: true }
}
