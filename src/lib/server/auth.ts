import 'server-only'

import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'

import { database } from './db'
import { env } from './env'

const COOKIE_NAME = 'debinatos-admin'
const SESSION_SECONDS = 24 * 60 * 60

function sessionKey() {
    return new TextEncoder().encode(env.SESSION_SECRET)
}

export const getAdmin = cache(async () => {
    const token = (await cookies()).get(COOKIE_NAME)?.value
    if (!token) return null
    const key = sessionKey()
    let id: string
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
            issuer: 'debinatos',
            audience: 'admin',
            requiredClaims: ['sub', 'exp', 'iat'],
        })
        if (typeof payload.sub !== 'string' || !/^[0-9a-f-]{36}$/i.test(payload.sub)) return null
        id = payload.sub
    } catch {
        return null
    }
    const [user] = await database()`SELECT id, email FROM admin_users WHERE id = ${id}::uuid`
    return user ? { id: String(user.id), email: String(user.email) } : null
})

export async function requireAdmin() {
    const user = await getAdmin()
    if (!user) redirect('/admin/login')
    return user
}

export async function createSession(id: string) {
    const expires = new Date(Date.now() + SESSION_SECONDS * 1000)
    const token = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(id)
        .setIssuer('debinatos')
        .setAudience('admin')
        .setIssuedAt()
        .setExpirationTime(Math.floor(expires.getTime() / 1000))
        .sign(sessionKey())
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires,
        maxAge: SESSION_SECONDS,
    })
}

export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
}
