import { Suspense } from 'react'
import Loading from '@/components/ui/Loading'
import { OrderPage } from './_components/OrderPage'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Meu pedido' }

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <OrderPage />
        </Suspense>
    )
}
