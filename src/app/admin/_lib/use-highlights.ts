'use client'

import { useRef, useState, useTransition } from 'react'

import { compareFeatured, mergePublishedHighlights, moveFavorite } from '@/lib/domain/highlights'
import { useStore } from '@/lib/state/store-context'
import type { HighlightsInput } from '@/lib/types/admin'
import type { HeroSelections, HeroSlot, Product } from '@/lib/types/store'

import { saveHighlights } from './actions'

export function useHighlights(products: Product[], initialHero: HeroSelections) {
    const { notify } = useStore()
    const [draft, setDraft] = useState<HighlightsInput>(() => ({
        favorites: products
            .filter((product) => product.featured)
            .sort(compareFeatured)
            .map((product) => product.id),
        hero: initialHero,
    }))
    const [saved, setSaved] = useState(() => JSON.stringify(draft))
    const published: HighlightsInput = {
        favorites: products
            .filter((product) => product.featured)
            .sort(compareFeatured)
            .map((product) => product.id),
        hero: initialHero,
    }
    const publishedKey = JSON.stringify(published)
    const [loadedKey, setLoadedKey] = useState(publishedKey)
    const [gallery, setGallery] = useState<HeroSlot | null>(null)
    const [error, setError] = useState('')
    const [pending, startTransition] = useTransition()
    const busy = useRef(false)
    const dirty = JSON.stringify(draft) !== saved

    // Refresh untouched selections after editing a product, while preserving the user's draft.
    if (loadedKey !== publishedKey) {
        setLoadedKey(publishedKey)
        setDraft(mergePublishedHighlights(draft, JSON.parse(saved) as HighlightsInput, published))
        setSaved(publishedKey)
    }

    function selectPhoto(slot: HeroSlot, productId: string, imageId: string) {
        setDraft((previous) => ({ ...previous, hero: { ...previous.hero, [slot]: { productId, imageId } } }))
        setGallery(null)
    }

    function clearPhoto(slot: HeroSlot) {
        setDraft((previous) => ({ ...previous, hero: { ...previous.hero, [slot]: null } }))
    }

    function addFavorite(id: string) {
        if (!products.some((product) => product.id === id && product.active)) return
        setDraft((previous) => (previous.favorites.includes(id) ? previous : { ...previous, favorites: [...previous.favorites, id] }))
    }

    function removeFavorite(id: string) {
        setDraft((previous) => ({ ...previous, favorites: previous.favorites.filter((value) => value !== id) }))
    }

    function changePosition(id: string, position: number) {
        setDraft((previous) => ({ ...previous, favorites: moveFavorite(previous.favorites, id, position) }))
    }

    function save() {
        if (busy.current || !dirty) return
        busy.current = true
        setError('')
        const submitted = draft
        startTransition(async () => {
            try {
                const result = await saveHighlights(submitted)
                if (result.error) setError(result.error)
                else {
                    setSaved(JSON.stringify(submitted))
                    notify('Destaques publicados na loja.')
                }
            } catch {
                setError('Não foi possível salvar. Suas escolhas foram mantidas. Tente novamente.')
            } finally {
                busy.current = false
            }
        })
    }

    return { draft, gallery, setGallery, selectPhoto, clearPhoto, addFavorite, removeFavorite, changePosition, save, dirty, pending, error }
}
