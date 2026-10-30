'use client'

import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Slot = { x: number; y: number; width: number; height: number }
type Drag = {
    from: number
    to: number | null
    startX: number
    startY: number
    x: number
    y: number
    listTop: number
    listLeft: number
    slots: Slot[]
}

// Preview with transforms, preserving the actual order until the pointer is released.
export function useReorder(move: (from: number, to: number) => void, disabled: boolean) {
    const container = useRef<HTMLOListElement>(null)
    const [drag, setDrag] = useState<Drag | null>(null)
    const session = useRef<Drag | null>(null)
    const landing = useRef<{ node: HTMLElement; rect: DOMRect } | null>(null)
    const [announcement, setAnnouncement] = useState('')

    function update(next: Drag | null) {
        session.current = next
        setDrag(next)
    }

    function targetAt(current: Drag, x: number, y: number) {
        const bounds = container.current?.getBoundingClientRect()
        if (!bounds || x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) return null
        let nearest = current.from
        let distance = Infinity
        current.slots.forEach((slot, index) => {
            const dx = x - bounds.left - slot.x - slot.width / 2
            const dy = y - bounds.top - slot.y - slot.height / 2
            const next = dx * dx + dy * dy
            if (next < distance) {
                nearest = index
                distance = next
            }
        })
        return nearest
    }

    function finish(commit: boolean) {
        const current = session.current
        if (!current) return
        const node = container.current?.children[current.from] as HTMLElement | undefined
        if (node) landing.current = { node, rect: node.getBoundingClientRect() }
        if (commit && !disabled && current.to !== null && current.to !== current.from) {
            move(current.from, current.to)
            setAnnouncement(`Item movido para a posição ${current.to + 1}.`)
        }
        update(null)
    }

    // The same keyed element lands in its new slot, or returns to its original one on cancel.
    useLayoutEffect(() => {
        if (drag || !landing.current) return
        const { node, rect } = landing.current
        landing.current = null
        if (!node.isConnected || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const destination = node.getBoundingClientRect()
        node.animate(
            [
                { transform: `translate(${rect.left - destination.left}px, ${rect.top - destination.top}px) scale(1.025)`, boxShadow: '0 18px 36px #350f0c26' },
                { transform: 'translate(0, 0) scale(1)', boxShadow: '0 0 0 #350f0c00' },
            ],
            { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' }
        )
    }, [drag])

    const dragging = drag !== null
    useEffect(() => {
        if (!dragging) return
        let frame: number
        function tick() {
            const current = session.current
            const list = container.current
            if (!current || !list) return
            const dialog = list.closest('dialog')
            const bounds = dialog?.getBoundingClientRect()
            const top = Math.max(0, bounds?.top ?? 0)
            const bottom = Math.min(window.innerHeight, bounds?.bottom ?? window.innerHeight)
            const step = current.y < top + 60 ? -10 : current.y > bottom - 60 ? 10 : 0
            if (step) {
                const scrollArea = dialog ?? window
                scrollArea.scrollBy({ top: step, behavior: 'instant' })
                update({ ...current, to: targetAt(current, current.x, current.y) })
            }
            frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frame)
    }, [dragging])

    function handleProps(index: number, label: string) {
        return {
            type: 'button' as const,
            disabled,
            'aria-label': `Mover ${label}`,
            title: 'Arraste para mudar a posição ou use as setas do teclado',
            onPointerDown(event: PointerEvent<HTMLButtonElement>) {
                if (disabled || !event.isPrimary || event.button !== 0 || !container.current) return
                const list = container.current.getBoundingClientRect()
                const slots = Array.from(container.current.children, (child) => {
                    const rect = child.getBoundingClientRect()
                    return { x: rect.left - list.left, y: rect.top - list.top, width: rect.width, height: rect.height }
                })
                event.currentTarget.setPointerCapture(event.pointerId)
                update({
                    from: index,
                    to: index,
                    startX: event.clientX,
                    startY: event.clientY,
                    x: event.clientX,
                    y: event.clientY,
                    listTop: list.top,
                    listLeft: list.left,
                    slots,
                })
            },
            onPointerMove(event: PointerEvent<HTMLButtonElement>) {
                const current = session.current
                if (!current || !event.currentTarget.hasPointerCapture(event.pointerId)) return
                update({ ...current, x: event.clientX, y: event.clientY, to: targetAt(current, event.clientX, event.clientY) })
            },
            onPointerUp(event: PointerEvent<HTMLButtonElement>) {
                const current = session.current
                if (!current) return
                session.current = { ...current, to: targetAt(current, event.clientX, event.clientY) }
                finish(true)
                if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
            },
            onPointerCancel() {
                finish(false)
            },
            onLostPointerCapture() {
                finish(false)
            },
            onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
                if (event.key === 'Escape' && session.current) {
                    event.preventDefault()
                    event.stopPropagation()
                    finish(false)
                    return
                }
                if (disabled || session.current || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
                event.preventDefault()
                const to = index + (event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 1)
                if (to < 0 || to >= (container.current?.children.length ?? 0)) return
                move(index, to)
                setAnnouncement(`${label} movido para a posição ${to + 1}.`)
            },
        }
    }

    function itemProps(index: number) {
        const style: CSSProperties = { transition: drag ? 'transform 200ms cubic-bezier(.2,.8,.2,1)' : 'none' }
        if (drag) {
            const slot = drag.slots[index]
            if (index === drag.from) {
                const list = container.current?.getBoundingClientRect()
                style.transform = `translate(${drag.x - drag.startX + drag.listLeft - (list?.left ?? drag.listLeft)}px, ${drag.y - drag.startY + drag.listTop - (list?.top ?? drag.listTop)}px) scale(1.025)`
                style.transition = 'box-shadow 160ms ease, background-color 160ms ease'
                style.position = 'relative'
                style.zIndex = 10
                style.pointerEvents = 'none'
                style.boxShadow = '0 18px 36px #350f0c26, 0 3px 8px #350f0c1a'
                style.backgroundColor = 'white'
            } else {
                let destination = index
                const to = drag.to ?? drag.from
                if (drag.from < index && index <= to) destination--
                if (to <= index && index < drag.from) destination++
                const target = drag.slots[destination]
                style.transform = `translate(${target.x - slot.x}px, ${target.y - slot.y}px)`
            }
        }
        return {
            'data-reorder-index': index,
            'data-dragging': drag?.from === index,
            style,
        }
    }

    return { container, handleProps, itemProps, announcement }
}
