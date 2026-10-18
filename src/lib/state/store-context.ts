'use client'
import { createContext, useContext } from 'react'
import type { CheckoutInput, DemoState } from '../types/store'

export type Store = {
    state: DemoState
    ready: boolean
    update: (fn: (previous: DemoState) => DemoState, message?: string) => boolean
    notify: (message: string, error?: boolean) => void
    add: (id: string, quantity?: number) => boolean
    quantity: (id: string, count: number) => boolean
    favorite: (id: string) => void
    checkout: (input: CheckoutInput) => string | undefined
    reset: () => Promise<void>
    toast: { message: string; error: boolean } | null
    dismissToast: () => void
}
export const StoreContext = createContext<Store | null>(null)

export function useStore() {
    const store = useContext(StoreContext)
    if (!store) throw new Error('StoreProvider ausente')
    return store
}
