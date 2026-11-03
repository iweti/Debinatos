import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ContactAction } from '@/components/contact/ContactAction'
import { CatalogContent } from '@/components/providers/CatalogContent'
import type { Store } from '@/lib/state/store-context'
import { StoreContext } from '@/lib/state/store-context'

import { createStoreState } from './fixtures/store'

const navigation = vi.hoisted(() => ({ pathname: '/contato' }))
vi.mock('next/navigation', () => ({
    usePathname: () => navigation.pathname,
    useRouter: () => ({ refresh: vi.fn() }),
}))

afterEach(() => {
    navigation.pathname = '/contato'
})

function renderContact({ catalogError = true, phone = '5511999999999' }: { catalogError?: boolean; phone?: string } = {}) {
    const store: Store = {
        state: createStoreState(),
        ready: true,
        catalogError,
        notify: vi.fn(),
        add: vi.fn(),
        quantity: vi.fn(),
        favorite: vi.fn(),
        removeUnavailableFavorites: vi.fn(),
        toast: null,
        dismissToast: vi.fn(),
    }
    return renderToStaticMarkup(
        createElement(StoreContext.Provider, { value: store }, createElement(CatalogContent, { children: createElement(ContactAction, { phone }) }))
    )
}

describe('Contato independente do catálogo', () => {
    it.each([true, false])('mantém o link correto do WhatsApp na página de contato com catalogError=%s', (catalogError) => {
        const html = renderContact({ catalogError })
        expect(html).toContain('href="https://wa.me/5511999999999?text=')
        expect(html).toContain('Fale com a gente pelo WhatsApp')
        expect(html).not.toContain('Não foi possível carregar os produtos')
    })

    it.each(['', ' ', 'inválido', '+5511999999999'])('preserva o estado de telefone ausente ou inválido: %s', (phone) => {
        const html = renderContact({ phone })
        expect(html).toContain('WhatsApp em breve')
        expect(html).toContain('disabled=""')
        expect(html).not.toContain('href="https://wa.me/')
    })

    it.each(['/', '/catalogo', '/catalogo/categoria', '/produto/produto-1', '/favoritos', '/carrinho'])('mantém a guarda de catálogo em %s', (pathname) => {
        navigation.pathname = pathname
        const html = renderContact()
        expect(html).toContain('Não foi possível carregar os produtos')
        expect(html).toContain('Tentar novamente')
        expect(html).not.toContain('href="https://wa.me/')
    })

    it('mantém conteúdo de outras páginas independentes durante falha do catálogo', () => {
        navigation.pathname = '/sobre'
        expect(renderContact()).toContain('href="https://wa.me/')
    })
})
