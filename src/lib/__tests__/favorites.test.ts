import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Favorites } from '@/app/favoritos/_components/Favorites'
import { Header } from '@/components/layout/Header'
import type { Store } from '@/lib/state/store-context'
import { StoreContext } from '@/lib/state/store-context'

import { removeUnavailableFavorites, unavailableFavoriteIds } from '../domain/favorites'
import { readVisitor, readVisitorForCatalog, VISITOR_STORAGE_KEY, writeVisitor } from '../storage/visitor-state'
import type { StoreState } from '../types/store'
import { createStoreState } from './fixtures/store'

vi.mock('next/navigation', () => ({
    usePathname: () => '/favoritos',
    useRouter: () => ({ push: vi.fn() }),
}))

afterEach(() => vi.unstubAllGlobals())

function mixedFavorites(): StoreState {
    const state = createStoreState()
    state.products[1].active = false
    state.favorites = ['produto-1', 'produto-2', 'removido']
    state.cart = [{ productId: 'produto-1', quantity: 3 }]
    return state
}

function createStore(state: StoreState, overrides: Partial<Store> = {}): Store {
    return {
        state,
        ready: true,
        catalogError: false,
        notify: vi.fn(),
        add: vi.fn(),
        quantity: vi.fn(),
        favorite: vi.fn(),
        removeUnavailableFavorites: vi.fn(),
        toast: null,
        dismissToast: vi.fn(),
        ...overrides,
    }
}

function renderFavorites(store: Store) {
    return renderToStaticMarkup(createElement(StoreContext.Provider, { value: store }, createElement(Favorites)))
}

function renderHeader(store: Store) {
    return renderToStaticMarkup(createElement(StoreContext.Provider, { value: store }, createElement(Header)))
}

function localStorageWith(state: StoreState) {
    const data = new Map([[VISITOR_STORAGE_KEY, JSON.stringify({ cart: state.cart, favorites: state.favorites })]])
    const setItem = vi.fn((key: string, value: string) => data.set(key, value))
    vi.stubGlobal('localStorage', { getItem: (key: string) => data.get(key) ?? null, setItem })
    return { data, setItem }
}

describe('Remoção explícita de favoritos indisponíveis', () => {
    it('remove referências desativadas e ausentes, preservando favoritos ativos e carrinho', () => {
        const state = mixedFavorites()
        const before = structuredClone(state)
        expect(unavailableFavoriteIds(state.favorites, state.products, false)).toEqual(['produto-2', 'removido'])
        const next = removeUnavailableFavorites(state, false)
        expect(next.favorites).toEqual(['produto-1'])
        expect(next.cart).toBe(state.cart)
        expect(next.products).toBe(state.products)
        expect(state).toEqual(before)
    })

    it('permite limpar uma lista contendo somente referências indisponíveis', () => {
        const state = { ...mixedFavorites(), favorites: ['produto-2', 'removido'] }
        const next = removeUnavailableFavorites(state, false)
        expect(next.favorites).toEqual([])
        expect(next.cart).toEqual(state.cart)
        const html = renderFavorites(createStore(state))
        expect(html).toContain('2 itens salvos não estão mais disponíveis')
        expect(html).toContain('Remover itens indisponíveis')
        expect(renderFavorites(createStore(next))).not.toContain('Remover itens indisponíveis')
    })

    it('persiste a seleção limpa e o contador usa os IDs restantes ao reabrir a página', () => {
        const state = mixedFavorites()
        localStorageWith(state)
        const loaded = readVisitorForCatalog(state.products, false)
        expect(loaded.state.favorites).toEqual(state.favorites)
        expect(renderHeader(createStore(state))).toContain('Itens salvos, 3 produtos')
        const next = removeUnavailableFavorites({ ...loaded.state, products: state.products }, false)
        writeVisitor(next)
        const reopened = { ...readVisitorForCatalog(state.products, false).state, products: state.products }
        expect(reopened.favorites).toEqual(['produto-1'])
        expect(reopened.cart).toEqual(state.cart)
        expect(renderHeader(createStore(reopened))).toContain('Itens salvos, 1 produto')
    })

    it('mostra uma ação acessível e mantém o produto ativo na lista mista', () => {
        const html = renderFavorites(createStore(mixedFavorites()))
        expect(html).toContain('Produto 1')
        expect(html).not.toContain('Produto 2')
        expect(html).toMatch(/<button[^>]*type="button"[^>]*>Remover itens indisponíveis<\/button>/)
        expect(html).not.toMatch(/<button[^>]*disabled=""[^>]*>Remover itens indisponíveis/)
    })

    it('desabilita a ação enquanto os dados locais não foram carregados', () => {
        const html = renderFavorites(createStore(mixedFavorites(), { ready: false }))
        expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Remover itens indisponíveis<\/button>/)
    })

    it('não classifica nem apaga favoritos quando o catálogo falha, mesmo se uma ação antiga for chamada', () => {
        const state = { ...mixedFavorites(), products: [] }
        const { setItem } = localStorageWith(state)
        expect(unavailableFavoriteIds(state.favorites, state.products, true)).toEqual([])
        expect(readVisitorForCatalog([], true).state).toEqual({ cart: state.cart, favorites: state.favorites })
        expect(setItem).not.toHaveBeenCalled()
        expect(() => removeUnavailableFavorites(state, true)).toThrow('Aguarde o carregamento do catálogo')
        expect(readVisitor().state.favorites).toEqual(state.favorites)
        expect(renderFavorites(createStore(state, { catalogError: true }))).not.toContain('Remover itens indisponíveis')
    })

    it('uma falha de armazenamento mantém os dados persistidos anteriores e permite tentar novamente', () => {
        const state = mixedFavorites()
        const { data, setItem } = localStorageWith(state)
        const original = data.get(VISITOR_STORAGE_KEY)
        setItem.mockImplementationOnce(() => {
            throw new Error('QuotaExceededError')
        })
        const next = removeUnavailableFavorites(state, false)
        expect(() => writeVisitor(next)).toThrow('Não foi possível salvar no navegador')
        expect(data.get(VISITOR_STORAGE_KEY)).toBe(original)
        expect(readVisitor().state.favorites).toEqual(state.favorites)
        writeVisitor(next)
        expect(readVisitor().state).toEqual({ cart: state.cart, favorites: ['produto-1'] })
    })
})
