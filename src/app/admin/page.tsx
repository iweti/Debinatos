import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'
import { getAdminProducts } from '@/lib/server/admin-products'
import { requireAdmin } from '@/lib/server/auth'
import { getHeroSelections } from '@/lib/server/products'

import { Admin } from './_components/Admin'

export default async function Page() {
    await requireAdmin()
    const [products, hero] = await Promise.all([getAdminProducts(), getHeroSelections()])
    return (
        <Suspense fallback={<Loading />}>
            <Admin initialProducts={products} initialHero={hero} />
        </Suspense>
    )
}
