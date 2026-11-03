'use client'
import { createContext, useContext } from 'react'

import type { StoreState } from '../types/store'

export type Store = {
    state: StoreState
    ready: boolean
    catalogError: boolean
    notify: (message: string, error?: boolean) => void
    add: (id: string, quantity?: number) => boolean
    quantity: (id: string, count: number) => boolean
    favorite: (id: string) => void
    toast: { message: string; error: boolean } | null
    dismissToast: () => void
}
export const StoreContext = createContext<Store | null>(null)

export function useStore() {
    const store = useContext(StoreContext)
    if (!store) throw new Error('StoreProvider ausente')
    return store
}
