'use client'
import { usePathname, useRouter } from 'next/navigation'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'

import { useStore } from '@/lib/state/store-context'

export function useHeader() {
    const { state } = useStore()
    const [mobileMenu, setMobileMenu] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [query, setQuery] = useState('')
    const pathname = usePathname()
    const router = useRouter()
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0)
    useEffect(() => {
        setMobileMenu(false)
        setSearchOpen(false)
    }, [pathname])
    const favoriteCount = state.favorites.length
    function search(event: FormEvent) {
        event.preventDefault()
        setSearchOpen(false)
        router.push(`/catalogo?q=${encodeURIComponent(query)}`)
    }
    return {
        pathname,
        mobileMenu,
        setMobileMenu,
        searchOpen,
        setSearchOpen,
        query,
        setQuery,
        count,
        favoriteCount,
        search,
    }
}
