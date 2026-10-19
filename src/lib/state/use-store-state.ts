'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

import { initialState } from '../data/demo'
import { addToCart, setQuantity } from '../domain/cart'
import { LEGACY_STORAGE_KEY, readState, STORAGE_KEY, writeState } from '../storage/local-state'
import { clearPhotos } from '../storage/photos'
import type { Store } from './store-context'

export function useStoreState(): Store {
    const [state, setState] = useState(initialState)
    const [ready, setReady] = useState(false)
    const hydrated = useRef(false)
    const current = useRef(state)
    const [toast, setToast] = useState<Store['toast']>(null)
    const notify = useCallback((message: string, error = false) => setToast({ message, error }), [])
    useEffect(() => {
        const loaded = readState()
        current.current = loaded.state
        setState(loaded.state)
        hydrated.current = true
        setReady(true)
        if (loaded.warning) notify(loaded.warning, true)
    }, [notify])
    useEffect(() => {
        if (!toast) return
        const timeout = setTimeout(() => setToast(null), toast.error ? 10000 : 4000)
        return () => clearTimeout(timeout)
    }, [toast])
    useEffect(() => {
        const sync = (event: StorageEvent) => {
            if (event.key !== STORAGE_KEY && event.key !== LEGACY_STORAGE_KEY && event.key !== null) return
            const value = readState()
            current.current = value.state
            setState(value.state)
            if (value.warning) notify(value.warning, true)
        }
        window.addEventListener('storage', sync)
        return () => window.removeEventListener('storage', sync)
    }, [notify])
    const update: Store['update'] = (fn, message) => {
        try {
            if (!hydrated.current) throw new Error('Aguarde o carregamento dos seus dados locais.')
            const next = fn(current.current)
            writeState(next)
            current.current = next
            setState(next)
            if (message) notify(message)
            return true
        } catch (error) {
            notify(error instanceof Error ? error.message : 'Não foi possível salvar.', true)
            return false
        }
    }
    const value: Store = {
        state,
        ready,
        update,
        notify,
        toast,
        dismissToast: () => setToast(null),
        add: (id, quantity = 1) => update((s) => addToCart(s, id, quantity), 'Um encanto a mais no seu carrinho!'),
        quantity: (id, count) => update((s) => setQuantity(s, id, count)),
        favorite: (id) =>
            update((s) => ({
                ...s,
                favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
            })),
        reset: async () => {
            if (update(() => initialState(), 'Dados restaurados. Tudo pronto para recomeçar!')) {
                try {
                    await clearPhotos()
                } catch {
                    notify('Os dados foram restaurados, mas não foi possível limpar as fotos antigas.', true)
                }
            }
        },
    }
    return value
}
