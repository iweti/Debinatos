'use client'
import { Heart, Search, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'

import { useHeader } from './use-header'

export function Header() {
    const { pathname, searchOpen, setSearchOpen, query, setQuery, count, favoriteCount, search } = useHeader()
    return (
        <header className="relative z-20 border-b border-line bg-white">
            <div className="mx-auto w-[calc(100%-36px)] max-w-310 md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)] flex h-19 items-center justify-between gap-3 md:h-23 md:gap-6">
                <Link className="inline-flex shrink-0 items-center" href="/" aria-label="Debinatos, início">
                    <img
                        className="h-14 w-16 p-2 object-cover sm:h-18 sm:w-20.5 md:h-22.5 md:w-25.5"
                        src="/images/logo-debinatos-transparente.png"
                        width={340}
                        height={120}
                        alt="Debinatos"
                    />
                </Link>
                <nav className="hidden items-center gap-6 text-[11px] lg:flex" aria-label="Navegação principal">
                    <Link
                        className="relative whitespace-nowrap py-3 text-[#665047] hover:text-brand aria-[current=page]:text-brand aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:bottom-0  aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded aria-[current=page]:after:bg-brand"
                        href="/"
                        aria-current={pathname === '/' ? 'page' : undefined}
                    >
                        Início
                    </Link>
                    <Link
                        className="relative whitespace-nowrap py-3 text-[#665047] hover:text-brand aria-[current=page]:text-brand aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:bottom-0  aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded aria-[current=page]:after:bg-brand"
                        href="/catalogo"
                        aria-current={pathname === '/catalogo' ? 'page' : undefined}
                    >
                        Todos os produtos
                    </Link>
                    <Link
                        className="relative whitespace-nowrap py-3 text-[#665047] hover:text-brand aria-[current=page]:text-brand aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:bottom-0  aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded aria-[current=page]:after:bg-brand"
                        href="/sobre"
                        aria-current={pathname === '/sobre' ? 'page' : undefined}
                    >
                        Sobre a Debinatos
                    </Link>
                    <Link
                        className="relative whitespace-nowrap py-3 text-[#665047] hover:text-brand aria-[current=page]:text-brand aria-[current=page]:after:absolute aria-[current=page]:after:inset-x-0 aria-[current=page]:after:bottom-0  aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded aria-[current=page]:after:bg-brand"
                        href="/contato"
                        aria-current={pathname === '/contato' ? 'page' : undefined}
                    >
                        Contato
                    </Link>
                </nav>
                <div className="flex items-center gap-1 md:gap-2">
                    <button
                        className="relative inline-flex shrink-0 items-center justify-center rounded-full transition hover:bg-cream h-9 w-8"
                        aria-label="Buscar produtos"
                        aria-expanded={searchOpen}
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        <Search size={20} />
                    </button>
                    <Link
                        className="relative shrink-0 items-center justify-center rounded-full transition hover:bg-cream h-9 w-8 hidden lg:inline-flex"
                        href="/favoritos"
                        aria-label={`Itens salvos, ${favoriteCount} ${favoriteCount === 1 ? 'produto' : 'produtos'}`}
                    >
                        <Heart size={20} />
                        {favoriteCount > 0 && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-brand" />}
                    </Link>
                    <Link
                        className="relative hidden shrink-0 items-center justify-center rounded-full transition hover:bg-cream h-9 w-8 lg:inline-flex"
                        href="/carrinho"
                        aria-label={`Carrinho, ${count} ${count === 1 ? 'item' : 'itens'}`}
                    >
                        <ShoppingBag size={21} />
                        {count > 0 && (
                            <span className="absolute -right-0.5 top-0.5 grid h-4.25 min-w-4.25 place-items-center rounded-full border-2 border-white bg-brand px-0.5 text-[8px] text-white">
                                {count}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
            {searchOpen && (
                <form
                    className="mx-auto w-[calc(100%-36px)] max-w-310 md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)] flex items-center gap-2 border-t border-line py-4 md:gap-3"
                    onSubmit={search}
                >
                    <label htmlFor="header-search" className="sr-only">
                        O que você está procurando?
                    </label>
                    <Search size={20} />
                    <input
                        className="min-w-0 flex-1 border-0 bg-surface text-xs"
                        id="header-search"
                        autoFocus
                        placeholder="Encontre seu próximo encanto…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        className="inline-flex items-center justify-center gap-3 rounded-lg border border-brand bg-brand leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 min-h-10 px-4 py-2.5 text-[11px]"
                        type="submit"
                    >
                        Buscar
                    </button>
                    <button
                        className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full transition hover:bg-cream"
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        aria-label="Fechar busca"
                    >
                        <X size={20} />
                    </button>
                </form>
            )}
        </header>
    )
}
