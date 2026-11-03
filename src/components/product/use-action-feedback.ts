'use client'
import { useEffect, useRef, useState } from 'react'

export function useActionFeedback(duration: number) {
    const [feedback, setFeedback] = useState(0)
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const reset = () => {
        if (timeout.current) clearTimeout(timeout.current)
        setFeedback(0)
    }
    const confirm = () => {
        if (timeout.current) clearTimeout(timeout.current)
        setFeedback((previous) => previous + 1)
        timeout.current = setTimeout(() => setFeedback(0), duration)
    }

    useEffect(
        () => () => {
            if (timeout.current) clearTimeout(timeout.current)
        },
        []
    )

    return { feedback, confirm, reset }
}
