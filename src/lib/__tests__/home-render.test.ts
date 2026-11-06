import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'

import { Home } from '@/app/(home)/_components/Home'
import { StoreProvider } from '@/components/providers/StoreProvider'
import { DEFAULT_HERO_PHOTOS } from '@/lib/domain/highlights'

import { createStoreState } from './fixtures/store'

it('renderiza apresentação e catálogo vazio antes de carregar os dados locais', () => {
    const html = renderToStaticMarkup(
        createElement(StoreProvider, { products: [], catalogError: false, children: createElement(Home, { heroPhotos: DEFAULT_HERO_PHOTOS }) })
    )
    expect(html).toContain('Pequenos detalhes,')
    expect(html).toContain('Novos encantos em breve.')
    expect(html).toContain('href="/catalogo"')
})

it('mostra destaques do mesmo catálogo usado pelo carrinho, sem incluir produtos comuns', () => {
    const products = createStoreState().products
    products[0].featured = true
    const html = renderToStaticMarkup(
        createElement(StoreProvider, { products, catalogError: false, children: createElement(Home, { heroPhotos: DEFAULT_HERO_PHOTOS }) })
    )
    expect(html).toContain('href="/produto/produto-1"')
    expect(html).not.toContain('href="/produto/produto-2"')
    expect(html).not.toContain('Novos encantos em breve.')
})
