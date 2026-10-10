"use client";
import Link from "next/link";
import { Heart, Plus, Sparkles } from "lucide-react";
import { money } from "@/lib/utils/format";
import type { Product } from "@/lib/types/store";
import { Photo } from "@/components/product/Photo";
import { useProductCard } from "@/lib/hooks/use-product-card";

export function ProductCard({ product }: { product: Product }) {
  const { saved, favorite, add } = useProductCard(product.id);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link
          href={`/produto/${product.id}`}
          aria-label={`Ver ${product.name}`}
        >
          <Photo
            source={product.images[0]}
            alt={`Imagem ilustrativa de ${product.name}`}
            loading="lazy"
          />
        </Link>
        {product.badge && (
          <span
            className={`product-badge ${product.badge === "Novidade" ? "badge-green" : ""}`}
          >
            {product.badge === "Queridinho" && <Sparkles size={12} />}{" "}
            {product.badge}
          </span>
        )}
        {!product.stock && <span className="sold-out">Esgotado</span>}
        <button
          className={`favorite-button ${saved ? "saved" : ""}`}
          onClick={() => favorite(product.id)}
          aria-label={`${saved ? "Remover" : "Salvar"} ${product.name}${saved ? " dos favoritos" : " nos favoritos"}`}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
        <span className="photo-caption">Imagem ilustrativa</span>
      </div>
      <div className="product-meta">
        <span>{product.category}</span>
        <Link href={`/produto/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <div className="product-bottom">
          <div>
            <strong>{money(product.price)}</strong>
            {product.originalPrice && product.originalPrice > product.price && (
              <del>{money(product.originalPrice)}</del>
            )}
          </div>
          <button
            className="add-icon"
            disabled={!product.stock}
            onClick={() => add(product.id)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus size={19} />
          </button>
        </div>
        <small>Um detalhe para chamar de seu.</small>
      </div>
    </article>
  );
}
