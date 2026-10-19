import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'

import { Favorites } from './_components/Favorites'

export const metadata: Metadata = { title: 'Meus favoritos' }

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Favorites />
        </Suspense>
    )
}
