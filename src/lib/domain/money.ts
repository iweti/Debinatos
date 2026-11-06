export const MAX_PRICE_CENTS = 2147483647

export function validPriceCents(value: unknown): value is number {
    return typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= MAX_PRICE_CENTS
}

export function parsePrice(value: string): number | undefined {
    const match = /^(\d+)(?:[.,](\d{1,2}))?$/.exec(value.trim())
    if (!match) return
    const cents = Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'))
    return validPriceCents(cents) ? cents : undefined
}

export function priceInput(cents: number): string {
    return `${Math.floor(cents / 100)},${String(cents % 100).padStart(2, '0')}`
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatMoney(cents: number | bigint): string {
    const amount = BigInt(cents)
    return currency
        .formatToParts(amount / 100n)
        .map((part) => (part.type === 'fraction' ? String(amount % 100n).padStart(2, '0') : part.value))
        .join('')
}
