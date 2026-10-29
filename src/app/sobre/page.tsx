import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'

import { About } from './_components/About'

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <About />
        </Suspense>
    )
}
