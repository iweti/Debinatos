import { Suspense } from 'react'
import { Cart } from './_components/Cart'
import Loading from '@/components/ui/Loading'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Meu carrinho' }

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Cart />
        </Suspense>
    )
}
