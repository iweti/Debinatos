'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/state/store-context'
import type { OrderStatus, Product } from '@/lib/types/store'
import { getStats } from './getStats'

export function useAdmin() {
    const { state, update, reset } = useStore()
    const params = useSearchParams()
    const router = useRouter()
    const tab = params.get('aba') ?? 'visao'
    const [editor, setEditor] = useState<Product | null | undefined>(undefined)
    const [resetOpen, setResetOpen] = useState(false)
    const [resetting, setResetting] = useState(false)
    const [search, setSearch] = useState('')
    const [orderFilter, setOrderFilter] = useState('')
    const products = state.products.filter((p) => p.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))
    const orders = state.orders.filter((o) => !orderFilter || o.status === orderFilter)
    const stats = getStats(state)
    const latestOrders = state.orders.slice(0, 4)
    const totalProducts = state.products.length
    function changeTab(value: string) {
        router.replace(`/admin?aba=${value}`, { scroll: false })
    }
    function toggleProduct(product: Product) {
        update(
            (s) => ({
                ...s,
                products: s.products.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p)),
            }),
            product.active ? 'Produto desativado na vitrine.' : 'Produto visível na vitrine.'
        )
    }
    function changeOrderStatus(id: string, status: OrderStatus) {
        update(
            (s) => ({
                ...s,
                orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
            }),
            'Andamento atualizado no perfil do cliente.'
        )
    }
    function closeReset() {
        if (!resetting) setResetOpen(false)
    }
    async function restoreDemo() {
        setResetting(true)
        await reset()
        setResetting(false)
        setResetOpen(false)
    }
    return {
        tab,
        editor,
        setEditor,
        resetOpen,
        setResetOpen,
        resetting,
        search,
        setSearch,
        orderFilter,
        setOrderFilter,
        products,
        orders,
        stats,
        latestOrders,
        totalProducts,
        changeTab,
        toggleProduct,
        changeOrderStatus,
        closeReset,
        restoreDemo,
    }
}
