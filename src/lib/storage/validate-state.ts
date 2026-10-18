import type { DemoState } from '../types/store'
import { STATUS_LABELS } from '../constants/store'

// Stored records can be incomplete after older prototypes or manual edits.
export function isDemoState(value: unknown): value is DemoState {
    const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
    const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every((item) => typeof item === 'string')
    const amount = (v: unknown) => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0
    const address = (v: unknown) =>
        record(v) && ['cep', 'street', 'number', 'complement', 'district', 'city', 'state'].every((key) => typeof v[key] === 'string')
    if (
        !record(value) ||
        value.version !== 1 ||
        typeof value.loggedIn !== 'boolean' ||
        !record(value.profile) ||
        typeof value.profile.name !== 'string' ||
        !address(value.profile.address) ||
        !strings(value.favorites)
    )
        return false
    if (
        !Array.isArray(value.products) ||
        !value.products.every(
            (p) =>
                record(p) &&
                ['id', 'name', 'category', 'description', 'material', 'dimensions', 'createdAt'].every((key) => typeof p[key] === 'string') &&
                strings(p.images) &&
                p.images.length > 0 &&
                amount(p.price) &&
                amount(p.stock) &&
                typeof p.active === 'boolean' &&
                typeof p.featured === 'boolean' &&
                (p.originalPrice === undefined || amount(p.originalPrice)) &&
                (p.badge === undefined || typeof p.badge === 'string')
        )
    )
        return false
    if (!Array.isArray(value.cart) || !value.cart.every((i) => record(i) && typeof i.productId === 'string' && amount(i.quantity) && Number(i.quantity) > 0))
        return false
    return (
        Array.isArray(value.orders) &&
        value.orders.every(
            (o) =>
                record(o) &&
                typeof o.id === 'string' &&
                typeof o.customerName === 'string' &&
                typeof o.createdAt === 'string' &&
                Number.isFinite(Date.parse(o.createdAt)) &&
                ['shipping', 'pickup'].includes(String(o.delivery)) &&
                ['pix', 'card'].includes(String(o.payment)) &&
                Object.hasOwn(STATUS_LABELS, String(o.status)) &&
                ['subtotal', 'shipping', 'total'].every((key) => amount(o[key])) &&
                (o.address === null || address(o.address)) &&
                Array.isArray(o.items) &&
                o.items.every(
                    (i) =>
                        record(i) &&
                        ['productId', 'name', 'image'].every((key) => typeof i[key] === 'string') &&
                        amount(i.price) &&
                        amount(i.quantity) &&
                        Number(i.quantity) > 0
                )
        )
    )
}
