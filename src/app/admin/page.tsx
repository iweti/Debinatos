import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'
import { requireAdmin } from '@/lib/server/auth'
import { getHeroSelections, getProducts } from '@/lib/server/products'

import { Admin } from './_components/Admin'

export default async function Page() {
    await requireAdmin()
    const [products, hero] = await Promise.all([getProducts(true), getHeroSelections()])
    return (
        <Suspense fallback={<Loading />}>
            <Admin initialProducts={products} initialHero={hero} />
        </Suspense>
    )
}
