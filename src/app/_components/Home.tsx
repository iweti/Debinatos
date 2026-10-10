"use client";
import Link from "next/link";
import {
  ArrowRight,
  Flower2,
  Gem,
  Gift,
  Heart,
  Sparkles,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { useHome } from "../_lib/use-home";

import { Hero } from "./Hero";

export function Home() {
  const { featured } = useHome();
  return (
    <>
      <Hero />
      <div className="benefits-bar">
        <div className="site-container benefits-grid">
          <div>
            <Gift size={22} />
            <span>
              Itens personalizados, <strong>presentes com significado</strong>
            </span>
          </div>
          <div>
            <Gem size={22} />
            <span>
              Qualidade e exclusividade <strong>em cada peça</strong>
            </span>
          </div>
          <div>
            <Truck size={23} />
            <span>
              Envios <strong>para todo o Brasil</strong>
            </span>
          </div>
          <div>
            <Heart size={22} />
            <span>
              Peças feitas <strong>com amor e carinho</strong>
            </span>
          </div>
        </div>
      </div>
      <section className="py-10 md:py-16">
        <div className="site-container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <Sparkles size={13} /> FAVORITOS DA DEBINATOS
              </span>
              <h2>Impossível não se encantar</h2>
            </div>
            <Link className="text-link" href="/catalogo">
              Ver todos os produtos <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {!featured.length && (
            <p className="muted">
              Novos encantos em breve. Explore nosso catálogo.
            </p>
          )}
          <p className="illustration-note">
            Produtos, preços e imagens de demonstração. Explore e simule sua
            compra.
          </p>
        </div>
      </section>
      <section className="site-container py-10 md:py-16">
        <div className="brand-story">
          <div className="story-art">
            <img
              src="/images/marca-debinatos.jpg"
              alt="Mascote ruiva da Debinatos, acompanhada de uma joaninha e flores"
              loading="lazy"
            />
            <span className="story-flower">
              <Flower2 size={38} />
            </span>
          </div>
          <div className="story-copy">
            <span className="eyebrow">PRAZER, SOMOS A DEBINATOS</span>
            <h2>
              Um pouquinho de carinho.
              <br />
              <em>Um montão de encanto.</em>
            </h2>
            <p>
              A Debinatos reúne artesanatos, bijuterias e itens personalizados
              para você, para presentear e para deixar seu cantinho especial.
            </p>
            <p>
              Peças feitas com amor, qualidade e exclusividade, para levar mais
              afeto e personalidade ao seu dia. Do nosso cantinho para todo o
              Brasil.
            </p>
            <Link className="text-link" href="/sobre">
              Conheça a Debinatos <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="closing-note">
        <Flower2 size={30} />
        <h2>Tem sempre um encanto esperando por você.</h2>
        <p>Salve seus favoritos e volte quando quiser.</p>
        <Link className="button outline" href="/favoritos">
          <Heart size={17} /> Meu cantinho de favoritos
        </Link>
      </section>
    </>
  );
}
