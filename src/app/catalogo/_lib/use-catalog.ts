'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { catalogFilterUrl, catalogProducts, parseCatalogSort } from '@/lib/domain/catalog'
import { useStore } from '@/lib/state/store-context'

export function useCatalog() {
    const { state } = useStore()
    const params = useSearchParams()
    const [filtersOpen, setFiltersOpen] = useState(false)
    const urlQuery = params.get('q') ?? ''
    const [query, setQuery] = useState(urlQuery)
    const searchInput = useRef<HTMLInputElement>(null)
    useEffect(() => {
        // Keep typing immediate while Next updates URL state in a transition.
        if (document.activeElement !== searchInput.current) setQuery(urlQuery)
    }, [urlQuery])
    const category = params.get('categoria') ?? ''
    const sort = parseCatalogSort(params.get('ordem'))
    const categories = [...new Set(state.products.filter((p) => p.active).map((p) => p.category))]
    const updateFilter = (key: 'q' | 'categoria' | 'ordem', value: string) => {
        window.history.replaceState(null, '', catalogFilterUrl(window.location.search, { [key]: value }))
    }
    const clearFilters = () => {
        setQuery('')
        window.history.replaceState(null, '', catalogFilterUrl(window.location.search, { q: '', categoria: '' }))
    }
    const products = catalogProducts(state.products, { query, category, sort })
    const categoryCounts = Object.fromEntries(['', ...categories].map((c) => [c, state.products.filter((p) => p.active && (!c || p.category === c)).length]))
    function changeSearch(value: string) {
        setQuery(value)
        updateFilter('q', value)
    }
    return {
        filtersOpen,
        setFiltersOpen,
        query,
        searchInput,
        category,
        sort,
        categories,
        categoryCounts,
        updateFilter,
        clearFilters,
        changeSearch,
        products,
    }
}
