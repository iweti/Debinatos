'use client'
import { useState } from 'react'
import { useStore } from '@/lib/state/store-context'
import { SHIPPING_FEE } from '@/lib/constants/store'
import type { FormEvent } from 'react'

export function useCart() {
    const { state, quantity } = useStore()
    const [delivery, setDelivery] = useState<'shipping' | 'pickup'>('shipping')
    const [cep, setCep] = useState('')
    const [calculatedCep, setCalculatedCep] = useState('')
    const [cepError, setCepError] = useState('')
    const rows = state.cart.map((item) => ({
        item,
        product: state.products.find((p) => p.id === item.productId),
    }))
    const subtotal = rows.reduce((sum, { item, product }) => sum + (product?.price ?? 0) * item.quantity, 0)
    const invalid = rows.some(({ item, product }) => !product?.active || item.quantity > product.stock)
    const fee = delivery === 'shipping' ? SHIPPING_FEE : 0
    const itemCount = state.cart.reduce((n, i) => n + i.quantity, 0)
    function calculateShipping(event: FormEvent) {
        event.preventDefault()
        if (!/^\d{8}$/.test(cep.replace(/\D/g, ''))) {
            setCepError('Informe um CEP com 8 dígitos.')
            setCalculatedCep('')
        } else {
            setCepError('')
            setCalculatedCep(cep)
        }
    }
    function changeCep(value: string) {
        setCep(value)
        setCalculatedCep('')
        setCepError('')
    }
    return {
        quantity,
        delivery,
        setDelivery,
        cep,
        calculatedCep,
        cepError,
        rows,
        subtotal,
        invalid,
        fee,
        itemCount,
        calculateShipping,
        changeCep,
    }
}
