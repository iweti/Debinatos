import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'

import { Cart } from './_components/Cart'

export const metadata: Metadata = { title: 'Meu carrinho' }

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Cart phone={process.env.WHATSAPP_PHONE?.trim()} />
        </Suspense>
    )
}
