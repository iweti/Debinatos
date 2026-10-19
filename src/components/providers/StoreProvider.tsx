'use client'
import type { ReactNode } from 'react'

import { StoreContext } from '@/lib/state/store-context'
import { useStoreState } from '@/lib/state/use-store-state'

export function StoreProvider({ children }: { children: ReactNode }) {
    const store = useStoreState()
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
