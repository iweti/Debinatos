import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'
import { env } from '@/lib/server/env'

import { Catalog } from './_components/Catalog'

export default function Page() {
    return (
        <Suspense fallback={<Loading />}>
            <Catalog phone={env.WHATSAPP_PHONE} />
        </Suspense>
    )
}
