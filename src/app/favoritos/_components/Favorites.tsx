'use client'
import { Heart } from 'lucide-react'

import { ProductCard } from '@/components/product/ProductCard'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeading } from '@/components/ui/PageHeading'

import { useFavorites } from '../_lib/use-favorites'

export function Favorites() {
    const { products, unavailableCount, ready, removeUnavailableFavorites } = useFavorites()
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Itens salvos' }]} />
            <PageHeading eyebrow="UM CANTINHO SÓ SEU" title="Meus favoritos">
                Guarde os detalhes que fizeram seus olhos brilhar.
            </PageHeading>
            {products.length ? (
                <>
                    <p className="text-xs text-muted mb-6">
                        {products.length} {products.length === 1 ? 'encanto salvo' : 'encantos salvos'} no seu navegador
                    </p>
                    <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-4 md:gap-6">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </>
            ) : (
                <EmptyState icon={<Heart size={32} />} title="Seu próximo favorito está por aí.">
                    Toque no coração dos produtos para guardar seus encantos aqui.
                </EmptyState>
            )}
            {unavailableCount > 0 ? (
                <div className="mt-6 rounded-lg border border-line bg-cream p-5">
                    <p className="text-xs/relaxed  text-muted">
                        {unavailableCount === 1
                            ? 'Um item salvo não está mais disponível na vitrine.'
                            : `${unavailableCount} itens salvos não estão mais disponíveis na vitrine.`}{' '}
                        Você pode remover essas referências e manter os favoritos disponíveis.
                    </p>
                    <button
                        type="button"
                        className="mt-4 min-h-11 rounded-lg border border-brand px-4 py-2 text-xs font-semibold text-brand disabled:opacity-60"
                        disabled={!ready}
                        onClick={removeUnavailableFavorites}
                    >
                        Remover {unavailableCount === 1 ? 'item indisponível' : 'itens indisponíveis'}
                    </button>
                </div>
            ) : null}
        </div>
    )
}
