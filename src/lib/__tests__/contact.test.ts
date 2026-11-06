import { describe, expect, it } from 'vitest'

import { addToCart, setQuantity } from '../domain/cart'
import { getContactSelection, PERSONALIZED_MESSAGE, whatsappUrl } from '../domain/contact'
import { createStoreState } from './fixtures/store'

const phone = '5511999999999'

describe('Consulta pelo WhatsApp', () => {
    it('inclui nomes e quantidades na consulta sem depender do estoque interno', () => {
        const state = createStoreState()
        state.products[0].name = 'Terrário Ursos Polares & Cia #1'
        state.products[1].name = 'Mini Aquário de Urso'
        const cart = [
            { productId: state.products[0].id, quantity: 2 },
            { productId: state.products[1].id, quantity: 1 },
        ]
        const { message, invalid, itemCount } = getContactSelection(state.products, cart)
        expect(invalid).toBe(false)
        expect(itemCount).toBe(3)
        expect(message).toBe(
            'Olá! Tenho interesse nestes produtos:\n\n- Terrário Ursos Polares & Cia #1 — 2 unidades\n- Mini Aquário de Urso — 1 unidade\n\nGostaria de consultar a disponibilidade e combinar os detalhes.'
        )
        const url = new URL(whatsappUrl(` ${phone} `, message) ?? '')
        expect(url.hostname).toBe('wa.me')
        expect(url.pathname).toBe(`/${phone}`)
        expect(url.searchParams.get('text')).toBe(message)
        expect([...url.searchParams.keys()]).toEqual(['text'])
    })

    it('usa a mensagem de personalizados quando a seleção está vazia', () => {
        expect(getContactSelection(createStoreState().products, [])).toMatchObject({ invalid: false, message: PERSONALIZED_MESSAGE, itemCount: 0 })
    })

    it.each([undefined, '', ' ', '+5511999999999', '5511abc', '1'])('não cria link com número ausente ou inválido: %s', (number) => {
        expect(whatsappUrl(number, PERSONALIZED_MESSAGE)).toBeUndefined()
    })

    it.each(['removed', 'inactive', 'zero', 'fraction', 'negative'] as const)('exige revisão para seleção inválida: %s', (scenario) => {
        const state = createStoreState()
        const product = state.products[0]
        const item = { productId: product.id, quantity: 2 }
        if (scenario === 'removed') item.productId = 'removido'
        if (scenario === 'inactive') product.active = false
        if (scenario === 'zero') item.quantity = 0
        if (scenario === 'fraction') item.quantity = 1.5
        if (scenario === 'negative') item.quantity = -1
        const selection = getContactSelection(state.products, [item])
        expect(selection.invalid).toBe(true)
        expect(selection.message).toBeUndefined()
        expect(whatsappUrl(phone, selection.message)).toBeUndefined()
    })

    it('atualiza a mensagem ao mudar a seleção e não altera carrinho ou catálogo', () => {
        const state = addToCart(createStoreState(), 'produto-1', 2)
        const before = structuredClone(state)
        const first = getContactSelection(state.products, state.cart)
        expect(whatsappUrl(phone, first.message)).toBeTruthy()
        expect(state).toEqual(before)
        const changed = setQuantity(state, state.products[0].id, 1)
        expect(getContactSelection(changed.products, changed.cart).message).toContain('— 1 unidade\n')
        expect(getContactSelection(changed.products, setQuantity(changed, changed.products[0].id, 0).cart).message).toBe(PERSONALIZED_MESSAGE)
    })
})
