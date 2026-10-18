import { Suspense } from 'react'
import { Catalog } from './_components/Catalog'
import Loading from '@/components/ui/Loading'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Todos os produtos' }

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Catalog />
        </Suspense>
    )
}
