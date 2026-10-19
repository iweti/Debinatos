import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'

import { Home } from './_components/Home'

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Home />
        </Suspense>
    )
}
