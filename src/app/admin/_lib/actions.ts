'use server'

import { randomUUID } from 'node:crypto'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSession, deleteSession, requireAdmin } from '@/lib/server/auth'
import { imageService, validImageUrl } from '@/lib/server/cloudinary'
import { database } from '@/lib/server/db'
import type { ActionResult, ProductInput } from '@/lib/types/admin'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function login(_previous: ActionResult, form: FormData): Promise<ActionResult> {
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
    try {
        const [user] = await database()`
            SELECT id FROM admin_users
            WHERE lower(email) = lower(${email.trim()}) AND password_hash = crypt(${password}, password_hash)
        `
        if (!user) return { error: 'E-mail ou senha incorretos.' }
        await createSession(user.id)
    } catch {
        return { error: 'Não foi possível entrar agora. Tente novamente em instantes.' }
    }
    redirect('/admin')
}

export async function logout() {
    await deleteSession()
    redirect('/admin/login')
}

function productInput(value: ProductInput): ProductInput | undefined {
    if (!value || typeof value !== 'object') return
    const limits = { name: 100, category: 40, description: 2000, material: 150, dimensions: 150 } as const
    for (const [key, max] of Object.entries(limits)) {
        const text = value[key as keyof typeof limits]
        if (typeof text !== 'string' || !text.trim() || text.trim().length > max || text.includes('\0')) return
    }
    if (value.id !== undefined && (typeof value.id !== 'string' || !uuid.test(value.id))) return
    if (
        !Number.isInteger(value.stock) ||
        value.stock < 0 ||
        value.stock > 2147483647 ||
        typeof value.active !== 'boolean' ||
        typeof value.featured !== 'boolean'
    )
        return
    if (!Array.isArray(value.images) || value.images.length < 1 || value.images.length > 5 || !value.images.every(validImageUrl)) return
    if (value.badge !== undefined && (typeof value.badge !== 'string' || value.badge.trim().length > 40 || value.badge.includes('\0'))) return
    return {
        ...value,
        name: value.name.trim(),
        category: value.category.trim(),
        description: value.description.trim(),
        material: value.material.trim(),
        dimensions: value.dimensions.trim(),
        badge: value.badge?.trim() || undefined,
    }
}

export async function saveProduct(value: ProductInput): Promise<ActionResult> {
    await requireAdmin()
    const input = productInput(value)
    if (!input) return { error: 'Confira os campos, o estoque inteiro e as fotos do Cloudinary.' }
    try {
        const sql = database()
        if (input.id) {
            const rows = await sql`
                UPDATE products SET name = ${input.name}, description = ${input.description}, stock = ${input.stock},
                    category = ${input.category}, material = ${input.material}, dimensions = ${input.dimensions},
                    active = ${input.active}, featured = ${input.featured}, badge = ${input.badge ?? null}, img = ${input.images}::text[]
                WHERE id = ${input.id}::uuid RETURNING id
            `
            if (!rows.length) return { error: 'Este produto não existe mais. Atualize o painel.' }
        } else {
            await sql`
                INSERT INTO products (name, description, stock, category, material, dimensions, active, featured, badge, img)
                VALUES (${input.name}, ${input.description}, ${input.stock}, ${input.category}, ${input.material}, ${input.dimensions},
                    ${input.active}, ${input.featured}, ${input.badge ?? null}, ${input.images}::text[])
            `
        }
    } catch {
        return { error: 'Não foi possível salvar o produto. Tente novamente.' }
    }
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function setProductActive(id: string, active: boolean): Promise<ActionResult> {
    await requireAdmin()
    if (typeof id !== 'string' || !uuid.test(id) || typeof active !== 'boolean') return { error: 'Produto inválido.' }
    try {
        const rows = await database()`UPDATE products SET active = ${active} WHERE id = ${id}::uuid RETURNING id`
        if (!rows.length) return { error: 'Este produto não existe mais. Atualize o painel.' }
    } catch {
        return { error: 'Não foi possível alterar a visibilidade. Tente novamente.' }
    }
    revalidatePath('/', 'layout')
    return { success: true }
}

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
