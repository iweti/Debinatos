'use client'

import { Heart, ShoppingBag } from 'lucide-react'
import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { CartAnimationContext } from './cart-animation-context'
import styles from './CartAdditionAnimation.module.css'
import { Photo } from './Photo'

export type CartAnimationPhoto = {
    source: string
    left: number
    top: number
    width: number
    height: number
    objectFit: string
    objectPosition: string
}

const hearts = [
    { x: -62, y: -96, rotation: -24, size: 18 },
    { x: 42, y: -122, rotation: 18, size: 22 },
    { x: -28, y: -148, rotation: -12, size: 24 },
    { x: 70, y: -88, rotation: 28, size: 16 },
    { x: -76, y: -130, rotation: -30, size: 20 },
    { x: 14, y: -166, rotation: 12, size: 22 },
    { x: 50, y: -142, rotation: 24, size: 18 },
]

function FlyingPhoto({ photo, onComplete }: { photo: CartAnimationPhoto; onComplete: () => void }) {
    useEffect(() => {
        const timeout = setTimeout(onComplete, 2600)
        return () => clearTimeout(timeout)
    }, [onComplete])
    const style = {
        '--photo-left': `${photo.left}px`,
        '--photo-top': `${photo.top}px`,
        '--photo-width': `${photo.width}px`,
        '--photo-height': `${photo.height}px`,
        '--travel-x': `calc(50vw - ${photo.left + photo.width / 2}px)`,
        '--travel-y': `calc(var(--bag-top) - ${photo.top + photo.height / 2 + 40}px)`,
        '--drop-y': `calc(var(--bag-top) + 68px - ${photo.top + photo.height / 2}px)`,
        '--photo-scale': Math.min(72 / photo.width, 72 / photo.height, 1),
        '--photo-fit': photo.objectFit,
        '--photo-position': photo.objectPosition,
    } as CSSProperties

    return (
        <>
            <Photo className={styles.photo} style={style} source={photo.source} alt="" />
            <div className={styles.hearts}>
                {hearts.map((heart, index) => (
                    <Heart
                        key={index}
                        className={styles.heart}
                        size={heart.size}
                        fill="currentColor"
                        aria-hidden="true"
                        style={
                            {
                                '--heart-x': `${heart.x}px`,
                                '--heart-y': `${heart.y}px`,
                                '--heart-rotation': `${heart.rotation}deg`,
                                animationDelay: `${1120 + index * 55}ms`,
                            } as CSSProperties
                        }
                        onAnimationEnd={index === hearts.length - 1 ? onComplete : undefined}
                    />
                ))}
            </div>
        </>
    )
}

type Flight = { id: number; photo: CartAnimationPhoto; onComplete: () => void }

export function CartAnimationProvider({ children }: { children: ReactNode }) {
    const [flights, setFlights] = useState<Flight[]>([])
    const [active, setActive] = useState(false)
    const nextId = useRef(0)
    const enqueue = useCallback((photo: CartAnimationPhoto) => {
        const id = ++nextId.current
        setActive(true)
        setFlights((previous) => [...previous, { id, photo, onComplete: () => setFlights((current) => current.filter((flight) => flight.id !== id)) }])
    }, [])

    useEffect(() => {
        if (!active || flights.length > 0) return
        const timeout = setTimeout(() => setActive(false), 200)
        return () => clearTimeout(timeout)
    }, [active, flights.length])

    return (
        <CartAnimationContext.Provider value={enqueue}>
            {children}
            {active &&
                createPortal(
                    <div className={styles.animation} data-leaving={flights.length === 0} aria-hidden="true">
                        <div className={styles.bagBack}>
                            <ShoppingBag size={120} aria-hidden="true" />
                        </div>
                        {flights.map(({ id, photo, onComplete }) => (
                            <FlyingPhoto key={id} photo={photo} onComplete={onComplete} />
                        ))}
                        <div className={styles.bagFront}>
                            <ShoppingBag size={120} fill="white" aria-hidden="true" />
                        </div>
                    </div>,
                    document.body
                )}
        </CartAnimationContext.Provider>
    )
}
