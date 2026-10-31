import 'server-only'

import { type RuntimeEnv, validateRuntimeEnv } from '@/lib/config/env.mjs'

let validated: RuntimeEnv | undefined

export function getServerEnv(): RuntimeEnv {
    validated ??= validateRuntimeEnv(process.env)
    return validated
}

// Getters adiam a leitura até o boot/uso no runtime. Importar consumidores no build
// não exige credenciais e nunca cria valores fictícios para os serviços.
export const env: RuntimeEnv = Object.freeze({
    get DATABASE_URL() {
        return getServerEnv().DATABASE_URL
    },
    get SESSION_SECRET() {
        return getServerEnv().SESSION_SECRET
    },
    get CLOUDINARY_CLOUD_NAME() {
        return getServerEnv().CLOUDINARY_CLOUD_NAME
    },
    get CLOUDINARY_API_KEY() {
        return getServerEnv().CLOUDINARY_API_KEY
    },
    get CLOUDINARY_API_SECRET() {
        return getServerEnv().CLOUDINARY_API_SECRET
    },
    get CLOUDINARY_FOLDER() {
        return getServerEnv().CLOUDINARY_FOLDER
    },
    get WHATSAPP_PHONE() {
        return getServerEnv().WHATSAPP_PHONE
    },
    get NODE_ENV() {
        return getServerEnv().NODE_ENV
    },
    get VERCEL() {
        return getServerEnv().VERCEL
    },
})
