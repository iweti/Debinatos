'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useTransition } from 'react'

import { useStore } from '@/lib/state/store-context'

export function CatalogContent({ children }: { children: ReactNode }) {
    const { catalogError } = useStore()
    const pathname = usePathname()
    const router = useRouter()
    const [pending, startTransition] = useTransition()
    const needsCatalog = pathname === '/' || ['/catalogo', '/produto/', '/favoritos', '/carrinho'].some((path) => pathname.startsWith(path))
    if (!catalogError || !needsCatalog) return children
    return (
        <div className="mx-auto min-h-96 max-w-lg px-5 py-16 text-center" role="alert">
            <h1 className="mb-4 text-3xl">Não foi possível carregar os produtos.</h1>
            <p className="mb-6 text-sm text-muted">Tente novamente em instantes.</p>
            <button
                className="rounded-lg bg-brand px-5 py-3 text-xs font-semibold text-white disabled:opacity-60"
                disabled={pending}
                onClick={() => startTransition(() => router.refresh())}
            >
                {pending ? 'Carregando…' : 'Tentar novamente'}
            </button>
        </div>
    )
}
