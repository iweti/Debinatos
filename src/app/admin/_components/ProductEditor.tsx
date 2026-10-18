'use client'
import { Check, ImagePlus, X } from 'lucide-react'
import { Photo } from '@/components/product/Photo'
import type { Product } from '@/lib/types/store'
import { Modal } from './Modal'
import { useProductEditor } from '../_lib/use-product-editor'

export function ProductEditor({ product, close }: { product: Product | null; close: () => void }) {
    const {
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
    } = useProductEditor(product, close)
    return (
        <Modal title={product ? 'Editar produto' : 'Cadastrar um novo encanto'} close={close}>
            <form className="px-5 py-6 md:px-6" onSubmit={submit}>
                <p className="mb-6 text-muted text-[10px]">Alterações válidas apenas neste navegador. Todos os campos são obrigatórios.</p>
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 md:gap-5">
                    <label className="text-[11px] col-span-2">
                        Nome do produto
                        <input
                            className="text-xs"
                            autoFocus
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
                        Preço (R$)
                        <input
                            className="text-xs"
                            required
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="39,90"
                        />
                    </label>
                    <label className="text-[11px]">
                        Estoque
                        <input className="text-xs" required type="number" min="0" step="1" value={stock} onChange={(e) => setStock(e.target.value)} />
                    </label>
                    <label className="text-[11px]">
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
                        JPG, PNG ou WebP • até 5 MB por foto • máximo de 5 fotos. A primeira é a capa.
                    </small>
                    {!images.length && (
                        <button
                            className="inline-flex items-center gap-2 p-0 text-xs/relaxed  font-semibold text-brand hover:underline hover:underline-offset-4 mt-3"
                            type="button"
                            onClick={() => setImages(['/images/placeholder.svg'])}
                        >
                            Usar imagem padrão
                        </button>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2.5">
                        {images.map((source, i) => (
                            <div className="relative h-23 w-20.75" key={source}>
                                <Photo className="size-full rounded object-cover" source={source} alt={`Foto ${i + 1} do produto`} />
                                <button
                                    className="inline-flex shrink-0 items-center justify-center rounded-full transition absolute top-1 right-1 size-6 bg-white"
                                    type="button"
                                    onClick={() => setImages(images.filter((_, index) => i !== index))}
                                    aria-label={`Remover foto ${i + 1}`}
                                >
                                    <X size={14} />
                                </button>
                                {i === 0 && <span className="absolute bottom-1 left-1 rounded-sm bg-[#fffaf4] px-1 py-0.5 text-[8px]">Capa</span>}
                            </div>
                        ))}
                        <label className="relative flex h-23 w-26.25 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded border border-dashed border-[#cdb7a3] bg-[#fcf8f1] text-brand focus-within:outline-2 focus-within:outline-brand text-[11px]">
                            <ImagePlus size={24} />
                            <span>{uploading ? 'Salvando…' : 'Adicionar fotos'}</span>
                            <input
                                className="text-xs absolute inset-0 cursor-pointer opacity-0"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                disabled={uploading || images.length >= 5}
                                onChange={(e) => {
                                    void upload(e.target.files)
                                    e.target.value = ''
                                }}
                            />
                        </label>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-[11px]">
                        <input className="text-xs" type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Visível na loja
                    </label>
                    <label className="flex items-center gap-2 text-[11px]">
                        <input className="text-xs" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /> Destaque na página
                        inicial
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
                        onClick={close}
                    >
                        Cancelar
                    </button>
                    <button
                        className="inline-flex items-center justify-center gap-3 rounded-lg border border-brand bg-brand p-3 leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 min-h-11  text-[10px] md:px-4 md:text-[11px]"
                        type="submit"
                        disabled={uploading}
                    >
                        <Check size={17} /> Salvar produto
                    </button>
                </div>
            </form>
        </Modal>
    )
}
