'use client'
import { useEffect, useState } from 'react'

import { loadPhoto } from '@/lib/storage/photos'

export function usePhoto(source: string) {
    const [src, setSrc] = useState(source.startsWith('idb:') ? '/images/placeholder.svg' : source)
    useEffect(() => {
        let cancelled = false
        let objectUrl: string | undefined
        if (!source.startsWith('idb:')) {
            setSrc(source || '/images/placeholder.svg')
            return
        }
        setSrc('/images/placeholder.svg')
        loadPhoto(source)
            .then((blob) => {
                if (cancelled || !blob) return
                objectUrl = URL.createObjectURL(blob)
                setSrc(objectUrl)
            })
            .catch(() => {})
        return () => {
            cancelled = true
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [source])

    return { src }
}
