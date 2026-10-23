import { Suspense } from 'react'

import { Loading } from '@/components/ui/Loading'
import { DEFAULT_HERO_PHOTOS, resolveHeroPhotos } from '@/lib/domain/highlights'
import { getHeroSelections, getProducts } from '@/lib/server/products'

import { Home } from './_components/Home'

export default async function Page() {
    let heroPhotos = DEFAULT_HERO_PHOTOS
    try {
        const [products, selections] = await Promise.all([getProducts(), getHeroSelections()])
        heroPhotos = resolveHeroPhotos(products, selections)
    } catch {
        // A failed hero read keeps the current static composition available.
    }
    return (
        <Suspense fallback={<Loading />}>
            <Home heroPhotos={heroPhotos} />
        </Suspense>
    )
}
