'use client'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
    const sort = params.get('ordem') ?? 'destaques'
    const maximum = params.get('preco') ?? ''
    const categories = [...new Set(state.products.filter((p) => p.active).map((p) => p.category))]
    const updateFilter = (key: string, value: string) => {
        const next = new URLSearchParams(window.location.search)
        if (value) next.set(key, value)
        else next.delete(key)
        window.history.replaceState(null, '', `/catalogo?${next.toString()}`)
    }
    const clearFilters = () => {
        setQuery('')
        window.history.replaceState(null, '', '/catalogo')
    }
    const normalize = (s: string) =>
        s
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
    const products = state.products
        .filter(
            (p) =>
                p.active &&
                (!category || p.category === category) &&
                normalize(p.name).includes(normalize(query)) &&
                (!maximum || p.price <= Number(maximum) * 100)
        )
        .sort((a, b) =>
            sort === 'menor'
                ? a.price - b.price
                : sort === 'maior'
                  ? b.price - a.price
                  : sort === 'novidades'
                    ? b.createdAt.localeCompare(a.createdAt)
                    : Number(b.featured) - Number(a.featured)
        )
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
        maximum,
        categories,
        categoryCounts,
        updateFilter,
        clearFilters,
        changeSearch,
        products,
    }
}
