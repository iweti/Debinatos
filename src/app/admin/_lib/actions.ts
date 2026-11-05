'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { authenticateAdmin } from '@/lib/server/admin-login'
import {
    saveHighlights as persistHighlights,
    saveProduct as persistProduct,
    setProductActive as persistProductActive,
} from '@/lib/server/admin-product-mutations'
import { authorizeImageUpload as prepareImageUpload } from '@/lib/server/admin-uploads'
import { deleteSession } from '@/lib/server/auth'
import type { ActionResult, HighlightsInput, ProductInput } from '@/lib/types/admin'

export async function login(...[, form]: [ActionResult, FormData]): Promise<ActionResult> {
    const result = await authenticateAdmin(form)
    if (!result.success) return result
    redirect('/admin')
}

export async function logout() {
    await deleteSession()
    redirect('/admin/login')
}

function revalidateCatalog(result: ActionResult): ActionResult {
    if (result.success) revalidatePath('/', 'layout')
    return result
}

export async function saveProduct(value: ProductInput): Promise<ActionResult> {
    return revalidateCatalog(await persistProduct(value))
}

export async function saveHighlights(value: HighlightsInput): Promise<ActionResult> {
    return revalidateCatalog(await persistHighlights(value))
}

export async function setProductActive(id: string, active: boolean): Promise<ActionResult> {
    return revalidateCatalog(await persistProductActive(id, active))
}

export async function authorizeImageUpload() {
    return prepareImageUpload()
}
