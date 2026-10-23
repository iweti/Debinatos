import type { HighlightsInput, ProductInput } from '../types/admin'

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export const validId = (value: unknown): value is string => typeof value === 'string' && uuid.test(value)
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)

export function parseProductInput(value: unknown, validImageUrl: (url: unknown) => boolean): ProductInput | undefined {
    if (!record(value)) return
    const limits = { name: 100, category: 40, description: 2000, material: 150, dimensions: 150 } as const
    const text: Record<string, string> = {}
    for (const [key, max] of Object.entries(limits)) {
        const field = value[key]
        if (typeof field !== 'string' || !field.trim() || field.trim().length > max || field.includes('\0')) return
        text[key] = field.trim()
    }
    if (value.id !== undefined && !validId(value.id)) return
    if (typeof value.stock !== 'number' || !Number.isInteger(value.stock) || value.stock < 0 || value.stock > 2147483647) return
    if (typeof value.active !== 'boolean') return
    if (!Array.isArray(value.images) || value.images.length < 1 || value.images.length > 5) return
    const images: ProductInput['images'] = []
    for (const image of value.images) {
        if (!record(image) || typeof image.url !== 'string' || !validImageUrl(image.url)) return
        if (image.id !== undefined && !validId(image.id)) return
        images.push({ ...(image.id ? { id: (image.id as string).toLowerCase() } : {}), url: image.url })
    }
    const existingIds = images.flatMap((image) => (image.id ? [image.id] : []))
    if (new Set(existingIds).size !== existingIds.length) return
    if (value.badge !== undefined && (typeof value.badge !== 'string' || value.badge.trim().length > 40 || value.badge.includes('\0'))) return
    return {
        ...(value.id ? { id: (value.id as string).toLowerCase() } : {}),
        name: text.name,
        category: text.category,
        description: text.description,
        material: text.material,
        dimensions: text.dimensions,
        stock: value.stock,
        active: value.active,
        images,
        badge: typeof value.badge === 'string' ? value.badge.trim() || undefined : undefined,
    }
}

export function parseHighlightsInput(value: unknown): HighlightsInput | undefined {
    if (!record(value) || !Array.isArray(value.favorites) || !value.favorites.every(validId) || !record(value.hero)) return
    const favorites = value.favorites.map((id: string) => id.toLowerCase())
    if (new Set(favorites).size !== favorites.length) return
    const hero: HighlightsInput['hero'] = { primary: null, secondary: null }
    for (const slot of ['primary', 'secondary'] as const) {
        const selection = value.hero[slot]
        if (selection === null) continue
        if (!record(selection) || !validId(selection.productId) || (selection.imageId !== null && !validId(selection.imageId))) return
        hero[slot] = { productId: selection.productId.toLowerCase(), imageId: selection.imageId?.toLowerCase() ?? null }
    }
    return { favorites, hero }
}
