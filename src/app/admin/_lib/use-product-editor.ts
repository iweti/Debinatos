'use client'
import type { FormEvent } from 'react'
import { useRef, useState, useTransition } from 'react'

import { IMAGE_UPLOAD_TYPES, MAX_IMAGE_BYTES } from '@/lib/domain/image-upload'
import { parsePrice, priceInput } from '@/lib/domain/money'
import { useStore } from '@/lib/state/store-context'
import type { AdminProduct, ProductImageInput } from '@/lib/types/admin'

import { saveProduct, uploadImage } from './actions'

export function useProductEditor(product: AdminProduct | null, close: () => void) {
    const { notify } = useStore()
    const [name, setName] = useState(product?.name ?? '')
    const [category, setCategory] = useState(product?.category ?? 'Bijuterias')
    const [stock, setStock] = useState(product?.stock.toString() ?? '1')
    const [price, setPrice] = useState(product ? priceInput(product.priceCents) : '')
    const [description, setDescription] = useState(product?.description ?? '')
    const [material, setMaterial] = useState(product?.material ?? '')
    const [dimensions, setDimensions] = useState(product?.dimensions ?? '')
    const [images, setImages] = useState<ProductImageInput[]>(product?.images ?? [])
    const [active, setActive] = useState(product?.active ?? true)
    const [badge, setBadge] = useState(product?.badge ?? '')
    const [uploading, startUpload] = useTransition()
    const [saving, startSave] = useTransition()
    const [uploadFailed, setUploadFailed] = useState(false)
    const [error, setError] = useState('')
    const busy = useRef(false)

    function upload(files: FileList | null) {
        if (!files?.length || busy.current) return
        const selected = Array.from(files)
        if (
            images.length + selected.length > 5 ||
            selected.some((file) => !IMAGE_UPLOAD_TYPES.some((type) => type === file.type) || file.size === 0 || file.size > MAX_IMAGE_BYTES)
        ) {
            setError('Use de 1 a 5 fotos JPG, PNG ou WebP, de até 4 MB cada.')
            setUploadFailed(true)
            return
        }
        busy.current = true
        setError('')
        startUpload(async () => {
            try {
                const sources: string[] = []
                for (const file of selected) {
                    const form = new FormData()
                    form.set('file', file)
                    const result = await uploadImage(form)
                    if ('error' in result) throw new Error(result.error)
                    sources.push(result.url)
                }
                setImages((previous) => [...previous, ...sources.map((url) => ({ url }))])
                setUploadFailed(false)
            } catch (error) {
                setUploadFailed(true)
                setError(error instanceof Error ? error.message : 'Não foi possível enviar as fotos. Tente novamente.')
            } finally {
                busy.current = false
            }
        })
    }

    function submit(event: FormEvent) {
        event.preventDefault()
        if (busy.current || uploadFailed) return
        const quantity = Number(stock)
        const priceCents = parsePrice(price)
        if (priceCents === undefined) {
            setError('Informe um preço maior que zero, com até duas casas decimais e no máximo R$ 21.474.836,47.')
            return
        }
        if (
            !stock.trim() ||
            !name.trim() ||
            !category.trim() ||
            !description.trim() ||
            !material.trim() ||
            !dimensions.trim() ||
            !Number.isInteger(quantity) ||
            quantity < 0 ||
            quantity > 2147483647 ||
            images.length < 1 ||
            images.length > 5
        ) {
            setError('Preencha os campos, informe estoque inteiro a partir de zero e adicione pelo menos uma foto.')
            return
        }
        busy.current = true
        setError('')
        startSave(async () => {
            try {
                const result = await saveProduct({
                    id: product?.id,
                    name,
                    category,
                    stock: quantity,
                    priceCents,
                    description,
                    material,
                    dimensions,
                    images,
                    active,
                    badge,
                })
                if (result.error) setError(result.error)
                else {
                    notify(product ? 'Produto atualizado na vitrine.' : 'Produto cadastrado!')
                    close()
                }
            } catch {
                setError('Não foi possível salvar o produto. Tente novamente.')
            } finally {
                busy.current = false
            }
        })
    }
    return {
        name,
        setName,
        category,
        setCategory,
        stock,
        setStock,
        price,
        setPrice,
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
        badge,
        setBadge,
        uploading,
        saving,
        uploadFailed,
        error,
        upload,
        submit,
    }
}
