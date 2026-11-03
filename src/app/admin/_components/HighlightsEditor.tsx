'use client'

import { Check, GripVertical, Images, Trash2 } from 'lucide-react'

import { HeroArtwork } from '@/components/product/HeroArtwork'
import { Photo } from '@/components/product/Photo'
import { resolveHeroPhotos } from '@/lib/domain/highlights'
import type { Product } from '@/lib/types/store'

import type { useHighlights } from '../_lib/use-highlights'
import { useReorder } from '../_lib/use-reorder'
import { Modal } from './Modal'

type HighlightsState = ReturnType<typeof useHighlights>

export function HighlightsEditor({ products, editor }: { products: Product[]; editor: HighlightsState }) {
    const { draft, gallery, setGallery, selectPhoto, clearPhoto, addFavorite, removeFavorite, changePosition, save, pending, dirty, error } = editor
    const reorder = useReorder((from, to) => changePosition(draft.favorites[from], to + 1), pending)
    const photos = resolveHeroPhotos(products, draft.hero)
    const available = products.filter((product) => product.active && !draft.favorites.includes(product.id))
    const galleryProducts = products.filter((product) => product.active)
    return (
        <div>
            <h2 className="mb-2 text-[27px]">Produtos em destaque</h2>
            <p className="mb-6 text-xs/relaxed  text-muted">Escolha as fotos de boas-vindas e organize os Favoritos da Debinatos.</p>
            <fieldset disabled={pending} className="min-w-0 space-y-6">
                <section className="rounded-xl border border-line bg-white p-5 md:p-7" aria-labelledby="hero-settings-title">
                    <h3 id="hero-settings-title" className="text-xl">
                        Fotos do hero
                    </h3>
                    <p className="mt-2 text-xs/relaxed  text-muted">Escolher uma foto aqui não adiciona o produto aos favoritos.</p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        {(['primary', 'secondary'] as const).map((slot) => {
                            const selection = draft.hero[slot]
                            const product = products.find((item) => item.id === selection?.productId)
                            const missing = product && selection && !product.images.some((image) => image.id === selection.imageId)
                            const label = slot === 'primary' ? 'Foto principal' : 'Foto menor'
                            return (
                                <div key={slot} className="rounded-lg border border-line p-4">
                                    <h4 className="mb-3 text-sm">{label}</h4>
                                    <Photo source={photos[slot].url} alt={photos[slot].alt} className="h-40 w-full rounded-lg object-cover" />
                                    <p className="mt-3 text-xs text-muted">{product?.name ?? 'Foto padrão'}</p>
                                    {product && !product.active && <p className="mt-2 text-xs text-brand">Produto desativado. A loja usa a foto padrão.</p>}
                                    {product?.active && missing && (
                                        <p className="mt-2 text-xs text-muted">Foto removida. A loja usa a primeira foto do produto.</p>
                                    )}
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setGallery(slot)}
                                            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brand px-3 text-xs text-brand"
                                        >
                                            <Images size={16} /> {selection ? 'Trocar foto' : 'Escolher foto'}
                                            <span className="sr-only">: {label.toLowerCase()}</span>
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!selection}
                                            onClick={() => clearPhoto(slot)}
                                            className="min-h-10 px-2 text-xs text-muted disabled:opacity-40"
                                            aria-label={`Limpar ${label.toLowerCase()}`}
                                        >
                                            Limpar
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <details className="mt-5">
                        <summary className="cursor-pointer py-2 text-xs font-semibold text-brand">Prévia das fotos no hero</summary>
                        <div className="mt-3 overflow-hidden rounded-lg bg-cream">
                            <div className="mx-auto max-w-137.5">
                                <HeroArtwork photos={photos} />
                            </div>
                        </div>
                    </details>
                </section>
                <section className="rounded-xl border border-line bg-white p-5 md:p-7" aria-labelledby="favorites-settings-title">
                    <h3 id="favorites-settings-title" className="text-xl">
                        Favoritos da Debinatos
                    </h3>
                    <p className="mt-2 text-xs/relaxed  text-muted">
                        Até quatro produtos ativos aparecem em grade na página inicial. Favoritos adicionais aparecem no carrossel. Todos seguem esta ordem no
                        catálogo.
                    </p>
                    <label className="mt-5 block max-w-lg text-xs">
                        Adicionar produto ativo
                        <select
                            className="mt-2 block w-full text-xs"
                            value=""
                            disabled={!available.length}
                            onChange={(event) => addFavorite(event.target.value)}
                        >
                            <option value="">{available.length ? 'Selecione um produto' : 'Nenhum produto disponível para adicionar'}</option>
                            {available.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    {!draft.favorites.length && <p className="mt-5 text-xs text-muted">Nenhum favorito selecionado. Adicione um produto para começar.</p>}
                    <p className="mt-5 text-xs/relaxed text-muted">Arraste pela alça para mudar a ordem ou escolha a posição. Depois, salve as alterações.</p>
                    <output className="sr-only">{reorder.announcement}</output>
                    <ol ref={reorder.container} className="mt-4 space-y-3">
                        {draft.favorites.map((id, index) => {
                            const product = products.find((item) => item.id === id)
                            return (
                                <li
                                    key={id}
                                    {...reorder.itemProps(index)}
                                    className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-line p-3 transition duration-200 ease-out data-[dragging=true]:border-brand data-[dragging=true]:bg-cream sm:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] sm:gap-4 sm:p-4"
                                >
                                    <button
                                        {...reorder.handleProps(index, product?.name ?? 'produto')}
                                        className="inline-flex size-11 shrink-0 touch-none items-center justify-center rounded-lg text-muted select-none hover:bg-cream hover:text-brand active:cursor-grabbing cursor-grab"
                                    >
                                        <GripVertical size={20} />
                                    </button>
                                    <Photo source={product?.images[0]?.url ?? ''} alt="" className="size-14 rounded-lg object-cover" />
                                    <div className="col-span-2 min-w-0 wrap-break-word sm:col-span-1">
                                        <p className="text-xs font-semibold">{product?.name ?? 'Produto indisponível'}</p>
                                        {product && !product.active && <p className="mt-1 text-[11px] text-brand">Desativado — preservado na configuração</p>}
                                    </div>
                                    <label className="col-span-3 ml-auto flex items-center gap-2 text-[10px] text-muted sm:col-span-1">
                                        Posição
                                        <select
                                            className="w-18 text-xs"
                                            value={index + 1}
                                            aria-label={`Posição de ${product?.name ?? 'produto'}`}
                                            onChange={(event) => changePosition(id, Number(event.target.value))}
                                        >
                                            {draft.favorites.map((favoriteId, position) => (
                                                <option key={favoriteId} value={position + 1}>
                                                    {position + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => removeFavorite(id)}
                                        aria-label={`Remover ${product?.name ?? 'produto'} dos favoritos`}
                                        className="inline-flex size-11 items-center justify-center rounded-lg text-brand hover:bg-cream"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            )
                        })}
                    </ol>
                </section>
                {error && (
                    <p role="alert" className="text-xs/relaxed  text-brand">
                        {error}
                    </p>
                )}
                <div className="flex flex-wrap items-center justify-end gap-4">
                    <output className="text-xs text-muted">{dirty ? 'Há alterações para publicar.' : 'Configurações salvas.'}</output>
                    <button
                        type="button"
                        disabled={pending || !dirty}
                        onClick={save}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-brand bg-brand px-5 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
                    >
                        <Check size={17} /> {pending ? 'Salvando…' : 'Salvar alterações'}
                    </button>
                </div>
            </fieldset>
            {gallery && (
                <Modal title={gallery === 'primary' ? 'Escolher foto principal' : 'Escolher foto menor'} close={() => setGallery(null)}>
                    <div className="p-5 md:p-6">
                        <p className="mb-5 text-xs/relaxed  text-muted">Todas as fotos dos produtos ativos. Toque em uma imagem para escolher.</p>
                        {!galleryProducts.length && <p className="text-xs text-muted">Cadastre ou ative um produto para escolher suas fotos.</p>}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {galleryProducts.flatMap((product) =>
                                product.images.map((image) => {
                                    const selected = draft.hero[gallery]?.imageId === image.id
                                    return (
                                        <button
                                            key={image.id}
                                            type="button"
                                            aria-pressed={selected}
                                            aria-label={`Selecionar foto ${image.position} de ${product.name}`}
                                            title={product.name}
                                            onClick={() => selectPhoto(gallery, product.id, image.id)}
                                            className="relative overflow-hidden rounded-lg border-2 border-line p-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-pressed:border-brand"
                                        >
                                            <Photo
                                                source={image.url}
                                                alt={`Foto ${image.position} de ${product.name}`}
                                                loading="lazy"
                                                className="aspect-square w-full rounded object-cover"
                                            />
                                            <span className="block truncate px-1 py-2 text-[10px] text-muted">{product.name}</span>
                                            {selected && (
                                                <span className="absolute top-2 right-2 rounded-full bg-brand p-1 text-white">
                                                    <Check size={16} />
                                                </span>
                                            )}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
