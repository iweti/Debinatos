"use client";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useHeader } from "@/lib/hooks/use-header";

export function Header() {
  const {
    pathname,
    mobileMenu,
    setMobileMenu,
    searchOpen,
    setSearchOpen,
    query,
    setQuery,
    count,
    favoriteCount,
    search,
  } = useHeader();
  return (
    <header className="site-header">
      <div className="header-inner site-container">
        <Link className="brand" href="/" aria-label="Debinatos, início">
          <img src="/images/marca-debinatos.jpg" alt="" />
          <span>
            Debinatos
            <span className="brand-subtitle">DETALHES QUE ENCANTAM</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>
            Início
          </Link>
          <Link
            href="/catalogo"
            aria-current={pathname === "/catalogo" ? "page" : undefined}
          >
            Todos os produtos
          </Link>
          <Link
            href="/sobre"
            aria-current={pathname === "/sobre" ? "page" : undefined}
          >
            Sobre a Debinatos
          </Link>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            aria-label="Buscar produtos"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>
          <Link
            className="icon-button favorites-link"
            href="/favoritos"
            aria-label={`Itens salvos, ${favoriteCount} ${favoriteCount === 1 ? "produto" : "produtos"}`}
          >
            <Heart size={20} />
            {favoriteCount > 0 && <span className="tiny-dot" />}
          </Link>
          <Link
            className="icon-button profile-link"
            href="/perfil"
            aria-label="Meu perfil"
          >
            <UserRound size={20} />
          </Link>
          <Link
            className="icon-button bag-link"
            href="/carrinho"
            aria-label={`Carrinho, ${count} ${count === 1 ? "item" : "itens"}`}
          >
            <ShoppingBag size={21} />
            {count > 0 && <span className="count-badge">{count}</span>}
          </Link>
          <button
            className="icon-button mobile-menu-toggle"
            aria-label={mobileMenu ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {searchOpen && (
        <form className="search-drawer site-container" onSubmit={search}>
          <label htmlFor="header-search" className="sr-only">
            O que você está procurando?
          </label>
          <Search size={20} />
          <input
            id="header-search"
            autoFocus
            placeholder="Encontre seu próximo encanto…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="button small" type="submit">
            Buscar
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Fechar busca"
          >
            <X size={20} />
          </button>
        </form>
      )}
      {mobileMenu && (
        <nav
          onClick={() => setMobileMenu(false)}
          className="mobile-nav"
          aria-label="Navegação no celular"
        >
          <Link href="/">Início</Link>
          <Link href="/catalogo">Todos os produtos</Link>
          <Link href="/favoritos">Meus favoritos</Link>
          <Link href="/perfil">Meu perfil</Link>
          <Link href="/sobre">Sobre a Debinatos</Link>
        </nav>
      )}
    </header>
  );
}
