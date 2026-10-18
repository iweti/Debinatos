'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useStore } from '@/lib/state/store-context'
import { savePhoto } from '@/lib/storage/photos'
import type { Product } from '@/lib/types/store'

export function useProductEditor(product: Product | null, close: () => void) {
    const { state, update, notify } = useStore()
    const [name, setName] = useState(product?.name ?? '')
    const [category, setCategory] = useState(product?.category ?? 'Bijuterias')
    const [price, setPrice] = useState(product ? (product.price / 100).toFixed(2) : '')
    const [stock, setStock] = useState(product?.stock.toString() ?? '1')
    const [description, setDescription] = useState(product?.description ?? '')
    const [material, setMaterial] = useState(product?.material ?? '')
    const [dimensions, setDimensions] = useState(product?.dimensions ?? '')
    const [images, setImages] = useState(product?.images ?? [])
    const [active, setActive] = useState(product?.active ?? true)
    const [featured, setFeatured] = useState(product?.featured ?? false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')
    async function upload(files: FileList | null) {
        if (!files?.length) return
        if (images.length + files.length > 5) {
            setError('Adicione até 5 fotos por produto.')
            return
        }
        setUploading(true)
        setError('')
        try {
            const sources: string[] = []
            for (const file of Array.from(files)) sources.push(await savePhoto(file))
            setImages((previous) => [...previous, ...sources])
            notify('Fotos guardadas neste navegador. Salve o produto para publicá-las na vitrine.')
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Não foi possível guardar as fotos.')
        } finally {
            setUploading(false)
        }
    }
    function submit(event: FormEvent) {
        event.preventDefault()
        const cents = Math.round(Number(price) * 100)
        const quantity = Number(stock)
        if (
            !name.trim() ||
            !category.trim() ||
            !description.trim() ||
            !material.trim() ||
            !dimensions.trim() ||
            !Number.isFinite(cents) ||
            cents < 1 ||
            !Number.isInteger(quantity) ||
            quantity < 0
        ) {
            setError('Preencha os campos. Use preço positivo e estoque inteiro a partir de zero.')
            return
        }
        if (!images.length) {
            setError('Adicione pelo menos uma foto ao produto.')
            return
        }
        const next: Product = {
            ...(product ?? {}),
            id: product?.id ?? `produto-${crypto.randomUUID().slice(0, 8)}`,
            name: name.trim(),
            category: category.trim(),
            price: cents,
            stock: quantity,
            description: description.trim(),
            material: material.trim(),
            dimensions: dimensions.trim(),
            images,
            active,
            featured,
            createdAt: product?.createdAt ?? new Date().toISOString(),
        }
        if (
            update(
                (s) => ({
                    ...s,
                    products: product ? s.products.map((p) => (p.id === product.id ? next : p)) : [...s.products, next],
                }),
                product ? 'Produto atualizado na vitrine local.' : 'Novo encanto cadastrado!'
            )
        )
            close()
    }
    const categories = [...new Set(state.products.map((p) => p.category))]
    return {
        name,
        setName,
        category,
        setCategory,
        price,
        setPrice,
        stock,
        setStock,
        description,
        setDescription,
        material,
        setMaterial,
        dimensions,
        setDimensions,
        images,
        setImages,
        active,
        setActive,
        featured,
        setFeatured,
        uploading,
        error,
        upload,
        submit,
        categories,
    }
}
