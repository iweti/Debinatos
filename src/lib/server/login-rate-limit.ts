import 'server-only'

import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'

import { headers } from 'next/headers'

import { database } from './db'
import { env } from './env'

export function loginRateLimitKeys(email: string, requestHeaders: Pick<Headers, 'get'>) {
    const secret = env.SESSION_SECRET
    if (!secret || Buffer.byteLength(secret, 'utf8') < 32) throw new Error('Configure SESSION_SECRET com pelo menos 32 bytes.')

    // Apenas o ingresso da Vercel fornece este valor confiável. Na hospedagem própria,
    // headers arbitrários não podem permitir que o cliente troque seu bucket de origem.
    const forwarded = env.VERCEL === '1' ? requestHeaders.get('x-vercel-forwarded-for')?.trim() : undefined
    const origin = forwarded && isIP(forwarded) ? (isIP(forwarded) === 6 ? new URL(`http://[${forwarded}]`).hostname : forwarded) : 'unknown'
    const key = (kind: string, value: string) => `${kind}:${createHmac('sha256', secret).update(`admin-login:${kind}:${value}`).digest('hex')}`
    return { account: key('account', email.trim().toLowerCase()), origin: key('origin', origin) }
}

export async function consumeLoginAttempt(email: string): Promise<boolean> {
    const keys = loginRateLimitKeys(email, await headers())
    const [result] = await database()`SELECT consume_admin_login_attempt(${keys.account}, ${keys.origin}) AS allowed`
    // Migração ausente, falha de armazenamento ou resposta inesperada recusam o login.
    return result?.allowed === true
}
