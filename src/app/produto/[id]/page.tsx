import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'

import { ProductPage } from './_components/ProductPage'

export const metadata: Metadata = { title: 'Um pequeno encanto' }

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <ProductPage />
        </Suspense>
    )
}
