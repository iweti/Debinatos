import type { CartItem, Product } from '../types/store'

export const PERSONALIZED_MESSAGE = 'Olá! Gostaria de saber mais sobre pedidos personalizados.'

export function getContactSelection(products: Product[], cart: CartItem[]) {
    const rows = cart.map((item) => ({ item, product: products.find((product) => product.id === item.productId) }))
    const invalid = rows.some(
        ({ item, product }) => !product?.active || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > product.stock
    )
    const message = !cart.length
        ? PERSONALIZED_MESSAGE
        : invalid
          ? undefined
          : [
                'Olá! Tenho interesse nestes produtos:',
                '',
                ...rows.map(({ item, product }) => `- ${product?.name ?? ''} — ${item.quantity} ${item.quantity === 1 ? 'unidade' : 'unidades'}`),
                '',
                'Gostaria de consultar a disponibilidade e combinar os detalhes.',
            ].join('\n')
    return { rows, invalid, message, itemCount: cart.reduce((sum, item) => sum + item.quantity, 0) }
}

export function whatsappUrl(phone: string | undefined, message: string | undefined): string | undefined {
    const number = phone?.trim()
    if (!number || !/^\d{10,15}$/.test(number) || !message) return undefined
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
