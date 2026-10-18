import { initialState } from '../data/demo'
import type { Address, DemoState } from '../types/store'

export function migrateCopy(state: DemoState): DemoState {
    const catalog = initialState().products
    const products = state.products.map((product) => {
        const original = catalog.find((entry) => entry.id === product.id)
        return original && product.description === `${original.description} Valor fictício por unidade.`
            ? { ...product, description: original.description }
            : product
    })
    const cleanAddress = (address: Address): Address => (address.street === 'Rua das Flores (fictícia)' ? { ...address, street: 'Rua das Flores' } : address)
    const address = cleanAddress(state.profile.address)
    const orders = state.orders.map((order) => {
        if (!order.address) return order
        const address = cleanAddress(order.address)
        return address === order.address ? order : { ...order, address }
    })
    if (
        products.every((product, index) => product === state.products[index]) &&
        address === state.profile.address &&
        orders.every((order, index) => order === state.orders[index])
    )
        return state
    return {
        ...state,
        products,
        profile: address === state.profile.address ? state.profile : { ...state.profile, address },
        orders,
    }
}
