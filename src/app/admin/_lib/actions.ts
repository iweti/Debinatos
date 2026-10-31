'use server'

import { randomUUID } from 'node:crypto'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { parseHighlightsInput, parseProductInput, validId } from '@/lib/domain/admin-input'
import { createSession, deleteSession, requireAdmin } from '@/lib/server/auth'
import { imageService, validImageUrl } from '@/lib/server/cloudinary'
import { database } from '@/lib/server/db'
import { consumeLoginAttempt } from '@/lib/server/login-rate-limit'
import type { ActionResult, HighlightsInput, ProductInput } from '@/lib/types/admin'

export async function login(...[, form]: [ActionResult, FormData]): Promise<ActionResult> {
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
    const loginFailure = { error: 'Não foi possível entrar. Confira os dados ou aguarde 15 minutos antes de tentar novamente.' }
    let stage = 'rate-limit'
    try {
        if (!(await consumeLoginAttempt(email))) return loginFailure
        stage = 'database'
        const [user] = await database()`
            SELECT id FROM admin_users
            WHERE lower(email) = lower(${email.trim()}) AND password_hash = crypt(${password}, password_hash)
        `
        if (!user) return loginFailure
        stage = 'session'
        await createSession(user.id)
    } catch (error) {
        console.error('[admin/login] Falha ao entrar.', {
            stage,
            name: error instanceof Error ? error.name : 'UnknownError',
            code: error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' ? error.code : undefined,
        })
        return { error: 'Não foi possível entrar agora. Tente novamente em instantes.' }
    }
    redirect('/admin')
}

export async function logout() {
    await deleteSession()
    redirect('/admin/login')
}

export async function saveProduct(value: ProductInput): Promise<ActionResult> {
    await requireAdmin()
    const input = parseProductInput(value, validImageUrl)
    if (!input) return { error: 'Confira os campos, o preço maior que zero, o estoque inteiro e as fotos do Cloudinary.' }
    try {
        const sql = database()
        const { id, images, ...data } = input
        await sql.transaction([sql`SELECT save_store_product(${id ?? null}::uuid, ${JSON.stringify(data)}::jsonb, ${JSON.stringify(images)}::jsonb)`])
    } catch {
        return { error: 'Não foi possível salvar o produto. Tente novamente.' }
    }
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function saveHighlights(value: HighlightsInput): Promise<ActionResult> {
    await requireAdmin()
    const input = parseHighlightsInput(value)
    if (!input) return { error: 'Confira os favoritos e as fotos selecionadas.' }
    try {
        const sql = database()
        await sql.transaction([sql`SELECT save_store_highlights(${input.favorites}::uuid[], ${JSON.stringify(input.hero)}::jsonb)`])
    } catch {
        return { error: 'Não foi possível salvar. Confira se os produtos e as fotos continuam disponíveis e tente novamente.' }
    }
    revalidatePath('/', 'layout')
    return { success: true }
}

export async function setProductActive(id: string, active: boolean): Promise<ActionResult> {
    await requireAdmin()
    if (!validId(id) || typeof active !== 'boolean') return { error: 'Produto inválido.' }
    try {
        const sql = database()
        const [, rows] = await sql.transaction([
            sql`SELECT pg_advisory_xact_lock(77120001)`,
            sql`UPDATE products SET active = ${active} WHERE id = ${id}::uuid RETURNING id`,
        ])
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
