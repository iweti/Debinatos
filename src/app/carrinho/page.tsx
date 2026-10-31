import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'
import { env } from '@/lib/server/env'

import { Cart } from './_components/Cart'

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Cart phone={env.WHATSAPP_PHONE} />
        </Suspense>
    )
}
