import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'

import { Profile } from './_components/Profile'

export const metadata: Metadata = { title: 'Meu perfil' }

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Profile />
        </Suspense>
    )
}
