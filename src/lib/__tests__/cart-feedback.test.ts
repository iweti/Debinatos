import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { AddToCartButton } from '@/components/product/AddToCartButton'
import { Toast } from '@/components/ui/Toast'

import { type Store, StoreContext } from '../state/store-context'
import { createStoreState } from './fixtures/store'

function store(overrides: Partial<Store> = {}): Store {
    return {
        state: createStoreState(),
        ready: true,
        catalogError: false,
        notify: vi.fn(),
        add: vi.fn(() => true),
        quantity: vi.fn(() => true),
        favorite: vi.fn(),
        removeUnavailableFavorites: vi.fn(() => true),
        toast: null,
        dismissToast: vi.fn(),
        ...overrides,
    }
}

function renderToast(toast: Store['toast']) {
    return renderToStaticMarkup(createElement(StoreContext.Provider, { value: store({ toast }) }, createElement(Toast)))
}

describe('Confirmação de carrinho', () => {
    it('oferece continuar comprando e ir ao carrinho somente na confirmação de adição', () => {
        const html = renderToast({ message: 'Adicionado com sucesso.', error: false, cartAdded: true })
        expect(html).toContain('Continuar comprando')
        expect(html).toContain('href="/carrinho"')
        expect(html).toContain('Ver carrinho')
        // Apenas a mensagem é anunciada; os controles continuam fora da região ao vivo.
        expect(html).toContain('<span role="status" aria-atomic="true">Adicionado com sucesso.</span>')
    })

    it.each([
        { message: 'Não foi possível salvar.', error: true },
        { message: 'Aviso geral.', error: false },
        { message: 'Produto indisponível.', error: true, cartAdded: true },
    ])('preserva o aviso sem oferecer ações de compra em $message', (toast) => {
        const html = renderToast(toast)
        expect(html).toContain(toast.error ? 'role="alert"' : 'role="status"')
        expect(html).not.toContain('Continuar comprando')
        expect(html).not.toContain('href="/carrinho"')
    })

    it('não mostra confirmação antes de carregar os dados locais', () => {
        const value = store({ ready: false })
        const html = renderToStaticMarkup(
            createElement(StoreContext.Provider, { value }, createElement(AddToCartButton, { product: value.state.products[0], compact: true }))
        )
        expect(html).toContain('disabled=""')
        expect(html).toContain('aria-label="Adicionar Produto 1 ao carrinho"')
        expect(html).not.toContain('adicionado ao carrinho')
        expect(value.add).not.toHaveBeenCalled()
    })
})
