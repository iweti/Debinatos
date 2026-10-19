'use client'
import { Flower2, Search, SlidersHorizontal } from 'lucide-react'

import { ProductCard } from '@/components/product/ProductCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeading } from '@/components/ui/PageHeading'

import { useCatalog } from '../_lib/use-catalog'

export function Catalog() {
    const { filtersOpen, setFiltersOpen, query, searchInput, category, sort, categories, categoryCounts, updateFilter, clearFilters, changeSearch, products } =
        useCatalog()
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Todos os produtos' }]} />
            <PageHeading eyebrow="ESCOLHA SEUS PEQUENOS ENCANTOS" title="Todos os produtos">
                Artesanatos, bijuterias e itens personalizados para você e para presentear.
            </PageHeading>
            <div className="mb-7 flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1 focus-within:ring-2 focus-within:ring-brand/20">
                <Search className="size-5 text-muted" size={20} />
                <label className="sr-only" htmlFor="catalog-search">
                    Buscar por nome
                </label>
                <input
                    className="min-w-0 flex-1 border-0 bg-transparent px-2 text-xs focus:ring-0"
                    id="catalog-search"
                    ref={searchInput}
                    value={query}
                    onChange={(e) => changeSearch(e.target.value)}
                    placeholder="Que encanto você procura?"
                />
                <button
                    className="items-center justify-center rounded-lg border leading-snug font-semibold transition hover:-translate-y-px disabled:translate-y-0 flex gap-1.5 md:hidden border-[#d7bbb0] bg-transparent text-brand hover:border-brand hover:bg-[#fff4ec] min-h-10 px-4 py-2.5 text-[11px]"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    aria-expanded={filtersOpen}
                >
                    <SlidersHorizontal size={17} /> Filtros
                </button>
            </div>
            <div className="grid gap-6 md:grid-cols-[170px_minmax(0,1fr)] lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10">
                <aside
                    className="hidden md:block data-[open=true]:block data-[open=true]:rounded-lg data-[open=true]:border data-[open=true]:border-line data-[open=true]:bg-surface data-[open=true]:p-5 data-[open=true]:md:rounded-none data-[open=true]:md:border-0 data-[open=true]:md:bg-transparent data-[open=true]:md:p-0"
                    data-open={filtersOpen}
                >
                    <h3 className="mb-7 flex items-center gap-2 text-sm">
                        <SlidersHorizontal size={17} /> Filtrar por
                    </h3>
                    <fieldset className="mb-6 border-b border-line pb-6">
                        <legend className="mb-4 text-xs font-semibold">Categorias</legend>
                        {['', ...categories].map((c) => (
                            <label className="mb-3.5 flex cursor-pointer items-center gap-2 text-[11px] text-[#6b554c]" key={c}>
                                <input className="m-0" type="radio" name="categoria" checked={category === c} onChange={() => updateFilter('categoria', c)} />
                                {c || 'Todos os produtos'}
                                <span className="ml-auto text-[10px] text-muted">{categoryCounts[c]}</span>
                            </label>
                        ))}
                    </fieldset>
                    {(category || query) && (
                        <button
                            className="inline-flex items-center gap-2 p-0 text-xs/relaxed  font-semibold text-brand hover:underline hover:underline-offset-4"
                            onClick={clearFilters}
                        >
                            Limpar filtros
                        </button>
                    )}
                    <div className="mt-8 hidden rounded-lg bg-cream px-4 py-7 text-center md:block">
                        <Flower2 className="mx-auto mb-3 text-brand" size={27} />
                        <strong className="block font-serif text-base font-medium">Escolha com carinho.</strong>
                        <p className="mt-2.5 text-[10px] text-muted">Seu próximo favorito pode estar a um detalhe de distância.</p>
                    </div>
                </aside>
                <section aria-label="Produtos">
                    <div className="mb-6 flex min-h-9 items-center justify-between gap-3 text-[10px] text-muted md:text-[11px]">
                        <span>
                            <strong className="font-medium text-ink">{products.length}</strong>{' '}
                            {products.length === 1 ? 'encanto encontrado' : 'encantos encontrados'}
                        </span>
                        <label className="flex items-center gap-2.5 whitespace-nowrap text-[0px] lg:text-[10px]">
                            Ordenar por{' '}
                            <select
                                className="min-w-28 border-0 bg-surface px-3 py-2 text-[10px] md:text-[11px]"
                                aria-label="Ordenar produtos"
                                value={sort}
                                onChange={(e) => updateFilter('ordem', e.target.value)}
                            >
                                <option value="destaques">Destaques</option>
                                <option value="novidades">Novidades</option>
                            </select>
                        </label>
                    </div>
                    {products.length ? (
                        <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 lg:grid-cols-3 lg:gap-x-5">
                            {products.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<Search size={30} />}
                            title="Esse encanto ainda não apareceu."
                            action={
                                <button
                                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug  font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0"
                                    onClick={clearFilters}
                                >
                                    Limpar filtros
                                </button>
                            }
                        >
                            Tente outro nome ou ajuste os filtros para explorar nossa coleção.
                        </EmptyState>
                    )}
                </section>
            </div>
        </div>
    )
}
