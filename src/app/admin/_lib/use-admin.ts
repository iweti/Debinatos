'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

import { useStore } from '@/lib/state/store-context'
import type { Product } from '@/lib/types/store'

import { setProductActive } from './actions'
import { getStats } from './get-stats'

export function useAdmin(initialProducts: Product[]) {
    const { notify } = useStore()
    const params = useSearchParams()
    const router = useRouter()
    const selected = params.get('aba')
    const tab = selected === 'produtos' || selected === 'destaques' ? selected : 'visao'
    const [editor, setEditor] = useState<Product | null | undefined>(undefined)
    const [search, setSearch] = useState('')
    const [pending, startTransition] = useTransition()
    const products = initialProducts.filter((p) => p.name.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')))
    const stats = getStats(initialProducts)
    function changeTab(value: string) {
        router.replace(`/admin?aba=${value}`, { scroll: false })
    }
    function toggleProduct(product: Product) {
        startTransition(async () => {
            try {
                const result = await setProductActive(product.id, !product.active)
                if (result.error) notify(result.error, true)
                else notify(product.active ? 'Produto desativado na vitrine.' : 'Produto visível na vitrine.')
            } catch {
                notify('Não foi possível alterar o produto. Tente novamente.', true)
            }
        })
    }
    return { tab, editor, setEditor, search, setSearch, products, stats, totalProducts: initialProducts.length, changeTab, toggleProduct, pending }
}
