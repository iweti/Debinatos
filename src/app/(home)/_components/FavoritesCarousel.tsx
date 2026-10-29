'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { ProductCard } from '@/components/product/ProductCard'
import type { Product } from '@/lib/types/store'

import styles from './FavoritesCarousel.module.css'

export function FavoritesCarousel({ products }: { products: Product[] }) {
    if (products.length <= 4) {
        return (
            <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-4 md:gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )
    }
    return <LoopingFavorites key={products.map((product) => product.id).join(',')} products={products} />
}

function LoopingFavorites({ products }: { products: Product[] }) {
    // Two full sequences leave enough offscreen slides for Embla's loop even with five products.
    const slides = [...products, ...products]
    const reducedMotion = useRef(false)
    const snapAfterDrag = useRef(false)
    const [viewportRef, api] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        duration: 40,
        loop: true,
        slidesToScroll: 1,
        watchFocus: false,
    })

    useEffect(() => {
        if (!api) return
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        let dragging = false
        let motionChangePending = false
        const updateMotion = () => {
            reducedMotion.current = media.matches
            // A preference change must not reinitialize Embla under the pointer.
            motionChangePending = dragging
            if (dragging) return
            snapAfterDrag.current = false
            api.reInit({ dragFree: !media.matches, duration: media.matches ? 0 : 40 })
        }
        const startDrag = () => {
            dragging = true
            snapAfterDrag.current = true
            api.rootNode().dataset.dragging = 'true'
        }
        const endDrag = () => {
            dragging = false
            delete api.rootNode().dataset.dragging
            if (motionChangePending) updateMotion()
        }
        const alignAfterMomentum = () => {
            if (dragging || !snapAfterDrag.current) return
            // Only a drag can schedule this correction. Its own settle event and
            // arrow navigation must never start another alignment animation.
            snapAfterDrag.current = false
            if (reducedMotion.current) return
            const viewportLeft = api.rootNode().getBoundingClientRect().left
            let nearestIndex = 0
            let nearestDistance = Infinity
            api.slideNodes().forEach((slide, index) => {
                // Actual positions include Embla's transforms at the loop seam.
                const distance = Math.abs(slide.getBoundingClientRect().left - viewportLeft)
                if (distance < nearestDistance) {
                    nearestIndex = index
                    nearestDistance = distance
                }
            })
            if (nearestDistance >= 2) api.scrollTo(nearestIndex)
        }
        let focusFrame = 0
        const updateFocus = () => {
            cancelAnimationFrame(focusFrame)
            focusFrame = requestAnimationFrame(() => {
                const viewport = api.rootNode().getBoundingClientRect()
                api.slideNodes().forEach((slide) => {
                    const bounds = slide.getBoundingClientRect()
                    slide.inert = bounds.left < viewport.left - 1 || bounds.right > viewport.right + 1
                })
            })
        }
        api.on('select', updateFocus).on('scroll', updateFocus).on('settle', updateFocus).on('reInit', updateFocus)
        api.on('pointerDown', startDrag).on('pointerUp', endDrag).on('settle', alignAfterMomentum)
        media.addEventListener('change', updateMotion)
        updateMotion()
        updateFocus()
        return () => {
            cancelAnimationFrame(focusFrame)
            api.off('select', updateFocus).off('scroll', updateFocus).off('settle', updateFocus).off('reInit', updateFocus)
            api.off('pointerDown', startDrag).off('pointerUp', endDrag).off('settle', alignAfterMomentum)
            delete api.rootNode().dataset.dragging
            media.removeEventListener('change', updateMotion)
        }
    }, [api])

    const navigate = (direction: 'previous' | 'next') => {
        snapAfterDrag.current = false
        if (direction === 'previous') api?.scrollPrev(reducedMotion.current)
        else api?.scrollNext(reducedMotion.current)
    }

    return (
        <section className={styles.carousel} aria-label="Favoritos da Debinatos" aria-roledescription="carrossel">
            <div className={styles.imageOverlay}>
                <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label="Ver produto anterior" onClick={() => navigate('previous')}>
                    <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Ver próximo produto" onClick={() => navigate('next')}>
                    <ArrowRight size={18} aria-hidden="true" />
                </button>
            </div>
            <div className={styles.viewport} ref={viewportRef}>
                <ul className={styles.track}>
                    {slides.map((product, index) => (
                        <li
                            key={`${product.id}-${index}`}
                            className={styles.slide}
                            aria-roledescription="slide"
                            aria-label={`${(index % products.length) + 1} de ${products.length}`}
                        >
                            <ProductCard product={product} />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
