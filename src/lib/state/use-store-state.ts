'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

import { addToCart, reconcileVisitor, setQuantity } from '../domain/cart'
import { emptyVisitor, readVisitorForCatalog, VISITOR_LEGACY_KEYS, VISITOR_STORAGE_KEY, writeVisitor } from '../storage/visitor-state'
import type { Product, StoreState } from '../types/store'
import type { Store } from './store-context'

export function useStoreState(products: Product[], catalogError: boolean): Store {
    const [visitor, setVisitor] = useState(emptyVisitor)
    const [ready, setReady] = useState(false)
    const current = useRef(visitor)
    const [toast, setToast] = useState<Store['toast']>(null)
    const notify = useCallback((message: string, error = false) => setToast({ message, error }), [])
    const loadVisitor = useCallback(() => {
        const loaded = readVisitorForCatalog(products, catalogError)
        current.current = loaded.state
        setVisitor(loaded.state)
        setReady(true)
        if (loaded.warning) notify(loaded.warning, true)
    }, [products, catalogError, notify])
    useEffect(() => {
        loadVisitor()
    }, [loadVisitor])
    useEffect(() => {
        if (!toast) return
        const timeout = setTimeout(() => setToast(null), toast.error ? 10000 : 4000)
        return () => clearTimeout(timeout)
    }, [toast])
    useEffect(() => {
        const sync = (event: StorageEvent) => {
            if (event.key !== VISITOR_STORAGE_KEY && !VISITOR_LEGACY_KEYS.includes(event.key ?? '') && event.key !== null) return
            loadVisitor()
        }
        window.addEventListener('storage', sync)
        return () => window.removeEventListener('storage', sync)
    }, [loadVisitor])
    const update = (fn: (previous: StoreState) => StoreState, message?: string): boolean => {
        try {
            if (!ready) throw new Error('Aguarde o carregamento dos seus dados locais.')
            const next = fn({ ...reconcileVisitor(current.current, products, catalogError), products })
            const local = { cart: next.cart, favorites: next.favorites }
            writeVisitor(local)
            current.current = local
            setVisitor(local)
            if (message) notify(message)
            return true
        } catch (error) {
            notify(error instanceof Error ? error.message : 'Não foi possível salvar.', true)
            return false
        }
    }
    return {
        state: { ...reconcileVisitor(visitor, products, catalogError), products },
        ready,
        catalogError,
        notify,
        toast,
        dismissToast: () => setToast(null),
        add: (id, quantity = 1) => update((s) => addToCart(s, id, quantity), 'Um encanto a mais no seu carrinho!'),
        quantity: (id, count) => update((s) => setQuantity(s, id, count)),
        favorite: (id) => update((s) => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] })),
    }
}
