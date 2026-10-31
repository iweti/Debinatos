import 'server-only'

import { neon } from '@neondatabase/serverless'

import { env } from './env'

export function database() {
    return neon(env.DATABASE_URL, { fetchOptions: { signal: AbortSignal.timeout(15000) } })
}
