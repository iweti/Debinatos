'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useStore } from '@/lib/state/store-context'

export function useProduct() {
    const { id } = useParams()
    const { state, add, favorite } = useStore()
    const product = state.products.find((p) => p.id === id && p.active)
    const [count, setCount] = useState(1)
    const [photoIndex, setPhotoIndex] = useState(0)
    useEffect(() => {
        setCount(1)
        setPhotoIndex(0)
    }, [id])
    const saved = !!product && state.favorites.includes(product.id)
    const related = state.products
        .filter((p) => p.active && p.id !== id)
        .sort((a, b) => Number(b.category === product?.category) - Number(a.category === product?.category))
        .slice(0, 4)
    return {
        product,
        count,
        setCount,
        photoIndex,
        setPhotoIndex,
        saved,
        related,
        add,
        favorite,
    }
}
