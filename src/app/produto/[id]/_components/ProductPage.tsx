'use client'
import { Check, Gift, Heart, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'

import { Photo } from '@/components/product/Photo'
import { ProductCard } from '@/components/product/ProductCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EmptyState } from '@/components/ui/EmptyState'
import { Quantity } from '@/components/ui/Quantity'

import { useProduct } from '../_lib/use-product'

export function ProductPage() {
    const { product, count, setCount, photoIndex, setPhotoIndex, saved, related, add, favorite } = useProduct()
    if (!product)
        return (
            <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
                <EmptyState icon={<ShoppingBag size={32} />} title="Este encanto não está disponível.">
                    Explore a coleção para encontrar outros favoritos.
                </EmptyState>
            </div>
        )
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Todos os produtos', to: '/catalogo' }, { label: product.name }]} />
            <div className="grid items-start gap-7 md:grid-cols-2 lg:gap-14">
                <div>
                    <div className="relative aspect-[.97] overflow-hidden rounded-xl bg-cream">
                        <Photo className="size-full object-cover" source={product.images[photoIndex] ?? product.images[0]} alt={`Foto de ${product.name}`} />
                    </div>
                    {product.images.length > 1 && (
                        <div className="mt-4 flex gap-3">
                            {product.images.map((source, i) => (
                                <button
                                    key={source}
                                    className="size-18 overflow-hidden rounded-lg border border-transparent p-1 aria-pressed:border-brand"
                                    onClick={() => setPhotoIndex(i)}
                                    aria-label={`Ver foto ${i + 1}`}
                                    aria-pressed={i === photoIndex}
                                >
                                    <Photo className="size-full rounded object-cover" source={source} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="lg:pt-3">
                    <span className="inline-flex items-center gap-2 text-[9px] leading-relaxed font-semibold tracking-[.18em] text-brand uppercase mb-3">
                        {product.category}
                    </span>
                    <h1 className="mb-5 text-[33px] lg:text-[39px]">{product.name}</h1>
                    <p className="mb-5 text-xs leading-[1.9] text-muted lg:text-[13px]">{product.description}</p>
                    <span
                        className="inline-flex items-center gap-1.5 text-[10px] text-leaf data-[unavailable=true]:text-brand"
                        data-unavailable={!product.stock}
                    >
                        {product.stock ? (
                            <>
                                <Check size={14} /> {product.stock} unidades disponíveis
                            </>
                        ) : (
                            'Esgotado no momento'
                        )}
                    </span>
                    <div className="my-6 flex flex-wrap items-center gap-2 lg:flex-nowrap">
                        <Quantity value={count} max={product.stock} onChange={setCount} name={product.name} />
                        <button
                            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand p-3 leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 flex-1 basis-full  text-[11px] sm:basis-auto md:basis-full lg:basis-auto"
                            disabled={!product.stock || count > product.stock}
                            onClick={() => add(product.id, count)}
                        >
                            <ShoppingBag size={18} /> Adicionar ao carrinho
                        </button>
                        <button
                            className="relative inline-flex shrink-0 items-center justify-center transition hover:bg-cream aria-pressed:text-brand h-11 w-10 rounded-lg border border-[#dfd4c8] ml-auto"
                            aria-label={saved ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                            aria-pressed={saved}
                            onClick={() => favorite(product.id)}
                        >
                            <Heart size={21} fill={saved ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3 border-y border-line py-5 text-[11px] text-muted">
                        <span className="flex items-center gap-2.5">
                            <Truck className="text-brand" size={18} /> Envio ou retirada na loja
                        </span>
                        <span className="flex items-center gap-2.5">
                            <Gift className="text-brand" size={18} /> Um carinho para você ou para presentear
                        </span>
                    </div>
                    <div className="pt-6">
                        <h3 className="mb-4 font-serif text-[17px] font-medium">Os detalhes que importam</h3>
                        <dl className="text-[11px] leading-[1.8]">
                            <div className="mb-2.5 grid grid-cols-[70px_1fr] gap-2.5">
                                <dt className="font-semibold">Material</dt>
                                <dd className="text-muted">{product.material}</dd>
                            </div>
                            <div className="mb-2.5 grid grid-cols-[70px_1fr] gap-2.5">
                                <dt className="font-semibold">Medidas</dt>
                                <dd className="text-muted">{product.dimensions}</dd>
                            </div>
                            <div className="mb-2.5 grid grid-cols-[70px_1fr] gap-2.5">
                                <dt className="font-semibold">Cuidados</dt>
                                <dd className="text-muted">Guarde em local seco e limpe com um pano macio.</dd>
                            </div>
                        </dl>
                    </div>
                    <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-[#856e5f]">
                        <ShieldCheck className="mt-px text-brand" size={17} /> Feito com carinho em cada detalhe.
                    </p>
                </div>
            </div>
            <section className="py-10 md:py-16">
                <div className="mb-6 flex items-center justify-between gap-4 md:mb-8 md:items-end">
                    <div>
                        <span className="inline-flex items-center gap-2 leading-relaxed font-semibold tracking-[.18em] text-brand uppercase mb-2 text-[7px] md:text-[9px]">
                            MAIS DETALHES PARA AMAR
                        </span>
                        <h2 className="text-2xl md:text-[30px]">Combina com você</h2>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-4 md:gap-6">
                    {related.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>
        </div>
    )
}
