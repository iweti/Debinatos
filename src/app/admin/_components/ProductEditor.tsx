'use client'
import { Check, GripVertical, ImagePlus, X } from 'lucide-react'

import { Photo } from '@/components/product/Photo'
import type { AdminProduct } from '@/lib/types/admin'

import { useProductEditor } from '../_lib/use-product-editor'
import { useReorder } from '../_lib/use-reorder'
import { Modal } from './Modal'

export function ProductEditor({ product, close, categories }: { product: AdminProduct | null; close: () => void; categories: string[] }) {
    const {
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
        uploading,
        saving,
        uploadFailed,
        badge,
        setBadge,
        error,
        upload,
        submit,
    } = useProductEditor(product, close)
    function moveImage(from: number, to: number) {
        const reordered = [...images]
        const [image] = reordered.splice(from, 1)
        reordered.splice(to, 0, image)
        setImages(reordered)
    }
    const reorder = useReorder(moveImage, uploading || saving)
    return (
        <Modal
            title={product ? 'Editar produto' : 'Cadastrar um novo encanto'}
            close={() => {
                if (!uploading && !saving) close()
            }}
        >
            <form className="px-5 py-6 md:px-6" onSubmit={submit}>
                <fieldset disabled={uploading || saving}>
                    <p className="mb-6 text-muted text-[10px]">Preencha os dados e adicione as fotos para publicar o produto na loja.</p>
                    <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 md:gap-5">
                        <label className="text-[11px] col-span-2">
                            Nome do produto
                            <input
                                className="text-xs"
                                required
                                maxLength={100}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex.: Colar Jardim"
                            />
                        </label>
                        <label className="text-[11px]">
                            Categoria
                            <input
                                className="text-xs"
                                required
                                maxLength={40}
                                list="category-options"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <datalist id="category-options">
                                {categories.map((c) => (
                                    <option key={c} value={c} />
                                ))}
                            </datalist>
                        </label>
                        <label className="text-[11px]">
                            Estoque
                            <input className="text-xs" required type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} />
                        </label>
                        <label className="col-span-2 text-[11px]">
                            Preço (R$)
                            <input
                                className="text-xs"
                                name="price"
                                required
                                inputMode="decimal"
                                maxLength={12}
                                value={price}
                                onChange={(event) => setPrice(event.target.value)}
                                placeholder="Ex.: 19,90"
                            />
                        </label>
                        <label className="col-span-2 text-[11px]">
                            Material
                            <input
                                className="text-xs"
                                required
                                maxLength={150}
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                placeholder="Ex.: Liga metálica dourada"
                            />
                        </label>
                        <label className="text-[11px] col-span-2">
                            Medidas
                            <input
                                className="text-xs"
                                required
                                maxLength={150}
                                value={dimensions}
                                onChange={(e) => setDimensions(e.target.value)}
                                placeholder="Ex.: 40 cm + extensor de 5 cm"
                            />
                        </label>
                        <label className="text-[11px] col-span-2">
                            Descrição
                            <textarea
                                className="text-xs"
                                required
                                rows={3}
                                maxLength={2000}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Conte os detalhes desse encanto…"
                            />
                        </label>
                    </div>
                    <div className="mt-6">
                        <h3 className="mb-2 text-xs">Fotos do produto</h3>
                        <small className="block text-[9px] leading-relaxed text-muted">
                            JPG, PNG ou WebP • até 5 MB por foto • máximo de 5 fotos. A primeira é a capa. Arraste pela alça para reorganizar.
                        </small>
                        <output className="sr-only">{reorder.announcement}</output>
                        <ol ref={reorder.container} className="mt-4 grid grid-cols-2 items-start gap-4 sm:grid-cols-3">
                            {images.map((image, i) => (
                                <li
                                    {...reorder.itemProps(i)}
                                    className="min-w-0 rounded-lg border border-line p-2 transition duration-200 ease-out data-[dragging=true]:border-brand data-[dragging=true]:bg-cream"
                                    key={image.id ?? image.url}
                                >
                                    <div className="relative">
                                        <Photo className="aspect-square w-full rounded object-cover" source={image.url} alt={`Foto ${i + 1} do produto`} />
                                        <button
                                            className="inline-flex shrink-0 items-center justify-center rounded-full transition absolute top-1 right-1 size-6 bg-white"
                                            type="button"
                                            disabled={uploading || saving}
                                            onClick={() => setImages([...images.slice(0, i), ...images.slice(i + 1)])}
                                            aria-label={`Remover foto ${i + 1}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <button
                                            {...reorder.handleProps(i, `foto ${i + 1}`)}
                                            className="inline-flex min-h-11 w-8 shrink-0 touch-none items-center justify-center rounded text-muted select-none hover:bg-cream active:cursor-grabbing cursor-grab"
                                        >
                                            <GripVertical size={18} />
                                        </button>
                                        <label className="flex min-w-0 flex-1 flex-col gap-1 text-[10px]">
                                            {i === 0 ? 'Capa' : 'Posição'}
                                            <select
                                                className="min-h-10 w-full px-2 py-1 text-xs"
                                                aria-label={`Posição da foto ${i + 1}`}
                                                value={i + 1}
                                                onChange={(event) => {
                                                    moveImage(i, Number(event.target.value) - 1)
                                                }}
                                            >
                                                {images.map((imageAtPosition, position) => (
                                                    <option key={imageAtPosition.id ?? `${imageAtPosition.url}-${position}`} value={position + 1}>
                                                        {position + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ol>
                        <label className="mt-4 relative flex min-h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded border border-dashed border-[#cdb7a3] bg-[#fcf8f1] text-brand focus-within:outline-2 focus-within:outline-brand text-[11px]">
                            <ImagePlus size={24} />
                            <span>{uploading ? 'Salvando…' : 'Adicionar fotos'}</span>
                            <input
                                className="text-xs absolute inset-0 cursor-pointer opacity-0"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                disabled={uploading || saving || images.length >= 5}
                                onChange={(e) => {
                                    void upload(e.target.files)
                                    e.target.value = ''
                                }}
                            />
                        </label>
                    </div>
                    <label className="mt-5 block text-[11px]">
                        Selo (opcional)
                        <input
                            className="text-xs"
                            maxLength={40}
                            value={badge}
                            onChange={(event) => setBadge(event.target.value)}
                            placeholder="Ex.: Novidade"
                        />
                    </label>
                    <div className="mt-6 flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 text-[11px]">
                            <input className="text-xs" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Visível na loja
                        </label>
                    </div>
                    {error && (
                        <p className="my-3 text-[11px] leading-relaxed text-[#b32217]" role="alert">
                            {error}
                        </p>
                    )}
                    <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
                        <button
                            className="inline-flex items-center justify-center gap-3 rounded-lg border p-3 leading-snug font-semibold transition hover:-translate-y-px disabled:translate-y-0 border-[#d7bbb0] bg-transparent text-brand hover:border-brand hover:bg-[#fff4ec] min-h-11  text-[10px] md:px-4 md:text-[11px]"
                            type="button"
                            disabled={uploading || saving}
                            onClick={close}
                        >
                            Cancelar
                        </button>
                        <button
                            className="inline-flex items-center justify-center gap-3 rounded-lg border border-brand bg-brand p-3 leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 min-h-11  text-[10px] md:px-4 md:text-[11px]"
                            type="submit"
                            disabled={uploading || saving || uploadFailed}
                        >
                            <Check size={17} /> {saving ? 'Salvando…' : 'Salvar produto'}
                        </button>
                    </div>
                </fieldset>
            </form>
        </Modal>
    )
}
