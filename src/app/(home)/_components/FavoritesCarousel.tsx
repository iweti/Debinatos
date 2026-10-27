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
    const [viewportRef, api] = useEmblaCarousel({
        align: 'start',
        loop: true,
        slidesToScroll: 1,
        skipSnaps: false,
        watchFocus: false,
    })

    useEffect(() => {
        if (!api) return
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        const updateMotion = () => {
            reducedMotion.current = media.matches
            api.reInit({ duration: media.matches ? 0 : 25 })
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
        media.addEventListener('change', updateMotion)
        updateMotion()
        updateFocus()
        return () => {
            cancelAnimationFrame(focusFrame)
            api.off('select', updateFocus).off('scroll', updateFocus).off('settle', updateFocus).off('reInit', updateFocus)
            media.removeEventListener('change', updateMotion)
        }
    }, [api])

    return (
        <section className={styles.carousel} aria-label="Favoritos da Debinatos" aria-roledescription="carrossel">
            <div className={styles.imageOverlay}>
                <button type="button" className={`${styles.arrow} ${styles.previous}`} aria-label="Ver produto anterior" onClick={() => api?.scrollPrev(reducedMotion.current)}>
                    <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" className={`${styles.arrow} ${styles.next}`} aria-label="Ver próximo produto" onClick={() => api?.scrollNext(reducedMotion.current)}>
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
