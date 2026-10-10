"use client";
import { Flower2, Search, SlidersHorizontal } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/ui/PageHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { useCatalog } from "../_lib/use-catalog";

export function Catalog() {
  const {
    filtersOpen,
    setFiltersOpen,
    query,
    searchInput,
    category,
    sort,
    maximum,
    categories,
    categoryCounts,
    updateFilter,
    clearFilters,
    changeSearch,
    products,
  } = useCatalog();
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "Todos os produtos" }]} />
      <PageHeading
        eyebrow="ESCOLHA SEUS PEQUENOS ENCANTOS"
        title="Todos os produtos"
      >
        Artesanatos, bijuterias e itens personalizados para você e para
        presentear.
      </PageHeading>
      <div className="catalog-search">
        <Search size={20} />
        <label className="sr-only" htmlFor="catalog-search">
          Buscar por nome
        </label>
        <input
          id="catalog-search"
          ref={searchInput}
          value={query}
          onChange={(e) => changeSearch(e.target.value)}
          placeholder="Que encanto você procura?"
        />
        <button
          className="button outline small filter-toggle"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal size={17} /> Filtros
        </button>
      </div>
      <div className="catalog-layout">
        <aside
          className={`catalog-filters ${filtersOpen ? "filters-open" : ""}`}
        >
          <h3>
            <SlidersHorizontal size={17} /> Filtrar por
          </h3>
          <fieldset>
            <legend>Categorias</legend>
            {["", ...categories].map((c) => (
              <label className="radio-row" key={c}>
                <input
                  type="radio"
                  name="categoria"
                  checked={category === c}
                  onChange={() => updateFilter("categoria", c)}
                />
                {c || "Todos os produtos"}
                <span>{categoryCounts[c]}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Faixa de preço</legend>
            <label htmlFor="max-price">Preço máximo</label>
            <select
              id="max-price"
              value={maximum}
              onChange={(e) => updateFilter("preco", e.target.value)}
            >
              <option value="">Todos os preços</option>
              <option value="40">Até R$ 40</option>
              <option value="60">Até R$ 60</option>
              <option value="80">Até R$ 80</option>
            </select>
          </fieldset>
          {(category || maximum || query) && (
            <button className="text-link" onClick={clearFilters}>
              Limpar filtros
            </button>
          )}
          <div className="filter-note">
            <Flower2 size={27} />
            <strong>Escolha com carinho.</strong>
            <p>Seu próximo favorito pode estar a um detalhe de distância.</p>
          </div>
        </aside>
        <section className="catalog-results" aria-label="Produtos">
          <div className="results-top">
            <span>
              <strong>{products.length}</strong>{" "}
              {products.length === 1
                ? "encanto encontrado"
                : "encantos encontrados"}
            </span>
            <label>
              Ordenar por{" "}
              <select
                aria-label="Ordenar produtos"
                value={sort}
                onChange={(e) => updateFilter("ordem", e.target.value)}
              >
                <option value="destaques">Destaques</option>
                <option value="novidades">Novidades</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
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
                <button className="button" onClick={clearFilters}>
                  Limpar filtros
                </button>
              }
            >
              Tente outro nome ou ajuste os filtros para explorar nossa coleção.
            </EmptyState>
          )}
          <p className="illustration-note">
            Todas as fotos e informações dos produtos são ilustrativas.
          </p>
        </section>
      </div>
    </div>
  );
}
