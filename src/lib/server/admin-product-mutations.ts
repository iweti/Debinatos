import 'server-only'

import { parseHighlightsInput, parseProductInput, validId } from '@/lib/domain/admin-input'
import type { ActionResult, HighlightsInput, ProductInput } from '@/lib/types/admin'

import { requireAdmin } from './auth'
import { validImageUrl } from './cloudinary'
import { database } from './db'

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
    return { success: true }
}
