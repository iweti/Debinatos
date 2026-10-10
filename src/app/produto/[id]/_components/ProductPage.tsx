"use client";
import {
  Check,
  Gift,
  Heart,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { Photo } from "@/components/product/Photo";
import { ProductCard } from "@/components/product/ProductCard";
import { Quantity } from "@/components/ui/Quantity";
import { money } from "@/lib/utils/format";
import { useProduct } from "../_lib/use-product";

export function ProductPage() {
  const {
    product,
    count,
    setCount,
    photoIndex,
    setPhotoIndex,
    saved,
    related,
    add,
    favorite,
  } = useProduct();
  if (!product)
    return (
      <div className="page-container">
        <EmptyState
          icon={<ShoppingBag size={32} />}
          title="Este encanto não está disponível."
        >
          Explore a coleção para encontrar outros favoritos.
        </EmptyState>
      </div>
    );
  return (
    <div className="page-container">
      <Breadcrumb
        items={[
          { label: "Todos os produtos", to: "/catalogo" },
          { label: product.name },
        ]}
      />
      <div className="grid items-start gap-7 md:grid-cols-2 lg:gap-14">
        <div>
          <div className="detail-image">
            <Photo
              source={product.images[photoIndex] ?? product.images[0]}
              alt={`Imagem ilustrativa de ${product.name}`}
            />
            <span className="photo-caption">
              Imagem ilustrativa • produto de demonstração
            </span>
          </div>
          {product.images.length > 1 && (
            <div className="thumbnails">
              {product.images.map((source, i) => (
                <button
                  key={source}
                  className={i === photoIndex ? "selected" : ""}
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={i === photoIndex}
                >
                  <Photo source={source} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">
            <strong>{money(product.price)}</strong>
            {product.originalPrice && product.originalPrice > product.price && (
              <del>{money(product.originalPrice)}</del>
            )}
          </div>
          <p className="detail-description">{product.description}</p>
          <span className={`stock-label ${product.stock ? "" : "unavailable"}`}>
            {product.stock ? (
              <>
                <Check size={14} /> {product.stock} unidades disponíveis na
                demonstração
              </>
            ) : (
              "Esgotado no momento"
            )}
          </span>
          <div className="detail-actions">
            <Quantity
              value={count}
              max={product.stock}
              onChange={setCount}
              name={product.name}
            />
            <button
              className="button"
              disabled={!product.stock || count > product.stock}
              onClick={() => add(product.id, count)}
            >
              <ShoppingBag size={18} /> Adicionar ao carrinho
            </button>
            <button
              className={`icon-button heart-outline ${saved ? "saved" : ""}`}
              aria-label={
                saved ? "Remover dos favoritos" : "Salvar nos favoritos"
              }
              aria-pressed={saved}
              onClick={() => favorite(product.id)}
            >
              <Heart size={21} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="detail-perks">
            <span>
              <Truck size={18} /> Envio ou retirada na loja
            </span>
            <span>
              <Gift size={18} /> Um carinho para você ou para presentear
            </span>
          </div>
          <div className="product-specs">
            <h3>Os detalhes que importam</h3>
            <dl>
              <div>
                <dt>Material</dt>
                <dd>{product.material}</dd>
              </div>
              <div>
                <dt>Medidas</dt>
                <dd>{product.dimensions}</dd>
              </div>
              <div>
                <dt>Cuidados</dt>
                <dd>Guarde em local seco e limpe com um pano macio.</dd>
              </div>
            </dl>
          </div>
          <p className="demo-note">
            <ShieldCheck size={17} /> Você está em uma demonstração. Nenhuma
            compra ou cobrança é real.
          </p>
        </div>
      </div>
      <section className="py-10 md:py-16">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MAIS DETALHES PARA AMAR</span>
            <h2>Combina com você</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-4 md:gap-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
