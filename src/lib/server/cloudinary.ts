import 'server-only'

import { v2 as cloudinary } from 'cloudinary'

import { env } from './env'

export function imageService() {
    const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret, CLOUDINARY_FOLDER: folder } = env
    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true })
    return { sdk: cloudinary, cloudName, apiKey, apiSecret, folder }
}

export function validImageUrl(value: unknown): value is string {
    if (typeof value !== 'string' || value.length > 2048) return false
    try {
        const url = new URL(value)
        const cloudName = env.CLOUDINARY_CLOUD_NAME
        return (
            !!cloudName &&
            url.protocol === 'https:' &&
            url.hostname === 'res.cloudinary.com' &&
            !url.username &&
            !url.password &&
            !url.port &&
            url.pathname.startsWith(`/${cloudName}/image/upload/`)
        )
    } catch {
        return false
    }
}
