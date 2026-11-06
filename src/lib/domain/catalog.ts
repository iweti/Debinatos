import type { Product } from '../types/store'
import { compareFeatured, compareNewest } from './highlights'

export const CATALOG_SORT_OPTIONS = [
    { value: 'preco-crescente', label: 'Preço Crescente' },
    { value: 'preco-decrescente', label: 'Preço Decrescente' },
    { value: 'novidade', label: 'Novidade' },
    { value: 'relevantes', label: 'Relevantes' },
] as const

export type CatalogSort = (typeof CATALOG_SORT_OPTIONS)[number]['value']
type CatalogFilter = 'q' | 'categoria' | 'ordem'

export function parseCatalogSort(value: string | null): CatalogSort {
    if (value === 'novidades') return 'novidade'
    return CATALOG_SORT_OPTIONS.find((option) => option.value === value)?.value ?? 'relevantes'
}

const comparators: Record<CatalogSort, (a: Product, b: Product) => number> = {
    'preco-crescente': (a, b) => a.priceCents - b.priceCents || compareNewest(a, b),
    'preco-decrescente': (a, b) => b.priceCents - a.priceCents || compareNewest(a, b),
    novidade: compareNewest,
    relevantes: compareFeatured,
}

export function catalogProducts(products: readonly Product[], filters: { query: string; category: string; sort: CatalogSort }) {
    const normalize = (value: string) =>
        value
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
    const query = normalize(filters.query)
    return products
        .filter((product) => product.active && (!filters.category || product.category === filters.category) && normalize(product.name).includes(query))
        .sort(comparators[filters.sort])
}

export function catalogFilterUrl(search: string, changes: Partial<Record<CatalogFilter, string>>) {
    const next = new URLSearchParams(search)
    for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value)
        else next.delete(key)
    }
    // Old links retain their meaning; new interactions write only the canonical order.
    const sort = parseCatalogSort(next.get('ordem'))
    if (sort === 'relevantes') next.delete('ordem')
    else next.set('ordem', sort)
    const query = next.toString()
    return `/catalogo${query ? `?${query}` : ''}`
}
