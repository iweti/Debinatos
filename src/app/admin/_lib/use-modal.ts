'use client'
import { useEffect, useRef } from 'react'

export function useModal() {
    const dialog = useRef<HTMLDialogElement>(null)
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null
        dialog.current?.showModal()
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previousOverflow
            previous?.focus()
        }
    }, [])

    return { dialog }
}
