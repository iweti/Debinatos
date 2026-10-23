'use client'
import type { ReactNode } from 'react'

import { StoreContext } from '@/lib/state/store-context'
import { useStoreState } from '@/lib/state/use-store-state'
import type { Product } from '@/lib/types/store'

export function StoreProvider({ children, products, catalogError }: { children: ReactNode; products: Product[]; catalogError: boolean }) {
    const store = useStoreState(products, catalogError)
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}
