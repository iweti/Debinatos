import type { Product, StoreState } from '../types/store'

export function unavailableFavoriteIds(favorites: string[], products: Product[], catalogError: boolean): string[] {
    // Uma falha temporária não permite concluir que um produto foi removido.
    if (catalogError) return []
    const available = new Set(products.filter((product) => product.active).map((product) => product.id))
    return favorites.filter((id) => !available.has(id))
}

export function removeUnavailableFavorites(state: StoreState, catalogError: boolean): StoreState {
    if (catalogError) throw new Error('Aguarde o carregamento do catálogo antes de remover itens indisponíveis.')
    const unavailable = new Set(unavailableFavoriteIds(state.favorites, state.products, catalogError))
    return { ...state, favorites: state.favorites.filter((id) => !unavailable.has(id)) }
}
