'use client'
import type { ImgHTMLAttributes } from 'react'

export function Photo({ source, alt, ...props }: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & { source: string }) {
    return (
        <img
            {...props}
            src={source || '/images/placeholder.svg'}
            alt={alt}
            onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = '/images/placeholder.svg'
            }}
        />
    )
}
