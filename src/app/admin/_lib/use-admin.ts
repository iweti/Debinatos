'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { useStore } from '@/lib/state/store-context'
import type { Product } from '@/lib/types/store'

import { getStats } from './get-stats'

export function useAdmin() {
    const { state, update, reset } = useStore()
    const params = useSearchParams()
    const router = useRouter()
    const tab = params.get('aba') === 'produtos' ? 'produtos' : 'visao'
    const [editor, setEditor] = useState<Product | null | undefined>(undefined)
    const [resetOpen, setResetOpen] = useState(false)
    const [resetting, setResetting] = useState(false)
    const [search, setSearch] = useState('')
    const products = state.products.filter((p) => p.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))
    const stats = getStats(state)
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
        products,
        stats,
        totalProducts,
        changeTab,
        toggleProduct,
        closeReset,
        restoreDemo,
    }
}
