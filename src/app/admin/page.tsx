import type { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'
import { requireAdmin } from '@/lib/server/auth'
import { getProducts } from '@/lib/server/products'

import { Admin } from './_components/Admin'

export const metadata: Metadata = { title: 'Painel administrativo' }

export default async function Page() {
    await requireAdmin()
    const products = await getProducts(true)
    return (
        <Suspense fallback={<Loading />}>
            <Admin initialProducts={products} />
        </Suspense>
    )
}
