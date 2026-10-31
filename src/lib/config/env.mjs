// Regras puras: podem ser usadas pelo servidor e por scripts Node sem server-only.
export const RUNTIME_ENV_KEYS = Object.freeze([
    'DATABASE_URL',
    'SESSION_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'CLOUDINARY_FOLDER',
    'WHATSAPP_PHONE',
    'NODE_ENV',
    'VERCEL',
])

// Fornecidas pelo Next.js/Vercel, sem exigir entradas no exemplo de configuração.
export const PLATFORM_ENV_KEYS = Object.freeze(['NODE_ENV', 'NEXT_RUNTIME', 'NEXT_PHASE', 'VERCEL'])

export class EnvironmentError extends Error {
    constructor(variables) {
        const names = [...new Set(variables)]
        super(`Variáveis de ambiente ausentes ou inválidas: ${names.join(', ')}.`)
        this.name = 'EnvironmentError'
        this.variables = Object.freeze(names)
    }
}

export function isPostgresUrl(value) {
    if (typeof value !== 'string' || !value || /\s/.test(value)) return false
    try {
        const url = new URL(value)
        return ['postgres:', 'postgresql:'].includes(url.protocol) && !!url.hostname && url.pathname.length > 1 && !url.hash
    } catch {
        return false
    }
}

export function validateRuntimeEnv(source) {
    const invalid = []
    const required = (name) => {
        const value = source[name]?.trim()
        if (!value) invalid.push(name)
        return value || ''
    }
    const databaseUrl = required('DATABASE_URL')
    if (databaseUrl && !isPostgresUrl(databaseUrl)) invalid.push('DATABASE_URL')

    // Preserve os bytes do segredo, inclusive espaços nas extremidades.
    const sessionSecret = source.SESSION_SECRET ?? ''
    if (!sessionSecret.trim() || new TextEncoder().encode(sessionSecret).byteLength < 32) invalid.push('SESSION_SECRET')

    const cloudName = required('CLOUDINARY_CLOUD_NAME')
    const apiKey = required('CLOUDINARY_API_KEY')
    const apiSecret = required('CLOUDINARY_API_SECRET')
    const folder = source.CLOUDINARY_FOLDER?.trim() || 'debinatos'
    const phone = source.WHATSAPP_PHONE?.trim() || undefined
    if (phone && !/^\d{12,13}$/.test(phone)) invalid.push('WHATSAPP_PHONE')

    const nodeEnv = source.NODE_ENV
    if (!['development', 'production', 'test'].includes(nodeEnv)) invalid.push('NODE_ENV')
    if (invalid.length) throw new EnvironmentError(invalid)

    return Object.freeze({
        DATABASE_URL: databaseUrl,
        SESSION_SECRET: sessionSecret,
        CLOUDINARY_CLOUD_NAME: cloudName,
        CLOUDINARY_API_KEY: apiKey,
        CLOUDINARY_API_SECRET: apiSecret,
        CLOUDINARY_FOLDER: folder,
        WHATSAPP_PHONE: phone,
        NODE_ENV: nodeEnv,
        // Só o marcador exato da plataforma permite confiar em sua origem.
        VERCEL: source.VERCEL === '1' ? '1' : undefined,
    })
}
