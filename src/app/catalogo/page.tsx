import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'

import { Catalog } from './_components/Catalog'

export const metadata: Metadata = { title: 'Todos os produtos' }

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Catalog phone={process.env.WHATSAPP_PHONE?.trim()} />
        </Suspense>
    )
}
