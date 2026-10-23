import 'server-only'

import { neon } from '@neondatabase/serverless'

export function database() {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL não configurada.')
    return neon(url, { fetchOptions: { signal: AbortSignal.timeout(15000) } })
}
