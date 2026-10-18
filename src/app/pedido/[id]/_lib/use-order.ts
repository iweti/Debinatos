'use client'
import { useParams, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/state/store-context'

export function useOrder() {
    const { id } = useParams()
    const { state } = useStore()
    const params = useSearchParams()
    const order = state.orders.find((o) => o.id === id)
    const statuses = ['received', 'preparing', order?.delivery === 'shipping' ? 'sent' : 'ready', 'completed'] as const
    const currentStep = order ? statuses.indexOf(order.status as (typeof statuses)[number]) : -1
    const loggedIn = state.loggedIn
    const isNew = params.get('novo') === '1'
    return { id, loggedIn, order, statuses, currentStep, isNew }
}
