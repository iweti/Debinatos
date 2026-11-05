import 'server-only'

import { randomUUID } from 'node:crypto'

import { requireAdmin } from './auth'
import { imageService } from './cloudinary'

export async function authorizeImageUpload() {
    await requireAdmin()
    try {
        const { sdk, cloudName, apiKey, apiSecret, folder } = imageService()
        const parameters = { timestamp: Math.floor(Date.now() / 1000), folder, public_id: randomUUID(), overwrite: false, allowed_formats: 'jpg,png,webp' }
        return { cloudName, apiKey, parameters, signature: sdk.utils.api_sign_request(parameters, apiSecret) }
    } catch {
        return { error: 'Não foi possível preparar o envio das fotos. Confira a configuração do Cloudinary.' }
    }
}
