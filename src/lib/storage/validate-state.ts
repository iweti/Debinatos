import type { DemoState } from '../types/store'
import type { LegacyState } from './legacy-state'

const record = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string')
const count = (value: unknown) => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0
const address = (value: unknown) =>
    record(value) && ['cep', 'street', 'number', 'complement', 'district', 'city', 'state'].every((key) => typeof value[key] === 'string')

function validCatalogState(value: unknown): value is Record<string, unknown> {
    return (
        record(value) &&
        typeof value.loggedIn === 'boolean' &&
        record(value.profile) &&
        typeof value.profile.name === 'string' &&
        address(value.profile.address) &&
        strings(value.favorites) &&
        Array.isArray(value.products) &&
        value.products.every(
            (p) =>
                record(p) &&
                ['id', 'name', 'category', 'description', 'material', 'dimensions', 'createdAt'].every((key) => typeof p[key] === 'string') &&
                strings(p.images) &&
                p.images.length > 0 &&
                count(p.stock) &&
                typeof p.active === 'boolean' &&
                typeof p.featured === 'boolean' &&
                (p.badge === undefined || typeof p.badge === 'string')
        ) &&
        Array.isArray(value.cart) &&
        value.cart.every((item) => record(item) && typeof item.productId === 'string' && count(item.quantity) && Number(item.quantity) > 0)
    )
}

export function isDemoState(value: unknown): value is DemoState {
    return (
        validCatalogState(value) &&
        value.version === 2 &&
        !('orders' in value) &&
        (value.products as Record<string, unknown>[]).every((p) => !('price' in p) && !('originalPrice' in p))
    )
}

export function isLegacyState(value: unknown): value is LegacyState {
    return (
        validCatalogState(value) &&
        value.version === 1 &&
        (value.products as Record<string, unknown>[]).every((p) => count(p.price) && (p.originalPrice === undefined || count(p.originalPrice))) &&
        Array.isArray(value.orders) &&
        value.orders.every((order) => record(order) && (order.address === null || address(order.address)))
    )
}
