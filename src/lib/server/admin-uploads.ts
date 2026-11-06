import 'server-only'

import { randomUUID } from 'node:crypto'

import { IMAGE_UPLOAD_TYPES, MAX_IMAGE_BYTES } from '@/lib/domain/image-upload'

import { requireAdmin } from './auth'
import { imageService } from './cloudinary'
import { database } from './db'

export async function uploadImage(form: FormData): Promise<{ url: string } | { error: string }> {
    const admin = await requireAdmin()
    const file = form instanceof FormData ? form.get('file') : null
    if (!(file instanceof File) || file.size === 0 || file.size > MAX_IMAGE_BYTES || !IMAGE_UPLOAD_TYPES.some((type) => type === file.type)) {
        return { error: 'Envie uma foto JPG, PNG ou WebP de até 4 MB.' }
    }
    try {
        // Reserva atômica antes de chamar o provedor. Falhas também consomem a cota.
        const [attempt] = await database()`SELECT consume_admin_upload_attempt(${admin.id}::uuid) AS allowed`
        if (attempt?.allowed !== true) return { error: 'Limite de 30 envios atingido. Aguarde 15 minutos e tente novamente.' }

        const { sdk, folder } = imageService()
        const bytes = Buffer.from(await file.arrayBuffer())
        const url = await new Promise<string>((resolve, reject) => {
            const stream = sdk.uploader.upload_stream(
                { folder, public_id: randomUUID(), overwrite: false, resource_type: 'image', allowed_formats: ['jpg', 'png', 'webp'], timeout: 60000 },
                (error, result) => {
                    if (error || !result?.secure_url) reject(new Error('Upload failed'))
                    else resolve(result.secure_url)
                }
            )
            stream.on('error', reject)
            stream.end(bytes)
        })
        return { url }
    } catch {
        return { error: 'Não foi possível enviar a foto. Tente novamente em instantes.' }
    }
}
