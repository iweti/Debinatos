"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
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
      <div className="border-b border-line">
        <div className="mx-auto w-[calc(100%-36px)] max-w-310 md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)] grid grid-cols-2 items-center py-1 md:min-h-21.5 md:grid-cols-4 md:py-0">
          <div className="flex min-h-16 items-center gap-2 border-line pl-3 odd:border-r md:min-h-0 md:justify-center md:border-r md:px-1 nth-[-n+2]:border-b nth-[-n+2]:md:border-b-0 last:border-r-0">
            <Gift className="size-5 text-brand" size={22} />
            <span className="text-[8px] leading-relaxed text-muted lg:text-[10px]">
              Itens personalizados,{" "}
              <strong className="block font-medium text-ink">
                presentes com significado
              </strong>
            </span>
          </div>
          <div className="flex min-h-16 items-center gap-2 border-line pl-3 odd:border-r md:min-h-0 md:justify-center md:border-r md:px-1 nth-[-n+2]:border-b nth-[-n+2]:md:border-b-0 last:border-r-0">
            <Gem className="size-5 text-brand" size={22} />
            <span className="text-[8px] leading-relaxed text-muted lg:text-[10px]">
              Qualidade e exclusividade{" "}
              <strong className="block font-medium text-ink">
                em cada peça
              </strong>
            </span>
          </div>
          <div className="flex min-h-16 items-center gap-2 border-line pl-3 odd:border-r md:min-h-0 md:justify-center md:border-r md:px-1 nth-[-n+2]:border-b nth-[-n+2]:md:border-b-0 last:border-r-0">
            <Truck className="size-5 text-brand" size={23} />
            <span className="text-[8px] leading-relaxed text-muted lg:text-[10px]">
              Envios{" "}
              <strong className="block font-medium text-ink">
                para todo o Brasil
              </strong>
            </span>
          </div>
          <div className="flex min-h-16 items-center gap-2 border-line pl-3 odd:border-r md:min-h-0 md:justify-center md:border-r md:px-1 nth-[-n+2]:border-b nth-[-n+2]:md:border-b-0 last:border-r-0">
            <Heart className="size-5 text-brand" size={22} />
            <span className="text-[8px] leading-relaxed text-muted lg:text-[10px]">
              Peças feitas{" "}
              <strong className="block font-medium text-ink">
                com amor e carinho
              </strong>
            </span>
          </div>
        </div>
      </div>
      <section className="py-10 md:py-16">
        <div className="mx-auto w-[calc(100%-36px)] max-w-310 md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)]">
          <div className="mb-6 flex items-center justify-between gap-4 md:mb-8 md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 leading-relaxed font-semibold tracking-[.18em] text-brand uppercase mb-2 text-[7px] md:text-[9px]">
                <Sparkles size={13} /> FAVORITOS DA DEBINATOS
              </span>
              <h2 className="text-2xl md:text-[30px]">
                Impossível não se encantar
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 p-0 leading-relaxed font-semibold text-brand hover:underline hover:underline-offset-4 max-w-28 text-[10px] md:max-w-none md:text-xs"
              href="/catalogo"
            >
              Ver todos os produtos <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {!featured.length && (
            <p className="text-xs text-muted">
              Novos encantos em breve. Explore nosso catálogo.
            </p>
          )}
        </div>
      </section>
      <section className="mx-auto w-[calc(100%-36px)] max-w-310 md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)] py-10 md:py-16">
        <div className="grid items-center gap-8 rounded-2xl border border-[#f2e9df] bg-[#fbf7f1] px-6 py-8 text-center md:grid-cols-[.83fr_1.17fr] md:gap-10 md:px-10 md:py-12 md:text-left lg:gap-16 lg:px-16">
          <div className="relative mx-auto w-full max-w-52.5 md:max-w-85">
            <img
              className="aspect-square rounded-t-[48%] rounded-b-xl object-cover"
              src="/images/marca-debinatos.jpg"
              alt="Mascote ruiva da Debinatos, acompanhada de uma joaninha e flores"
              loading="lazy"
            />
            <span className="absolute -right-5 bottom-5 grid size-14 rotate-15 place-items-center rounded-full border-5 border-[#fbf7f1] bg-gold text-brand md:size-16">
              <Flower2 className="size-8" size={38} />
            </span>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 leading-relaxed font-semibold tracking-[.18em] text-brand uppercase mb-4 text-[8px]">
              PRAZER, SOMOS A DEBINATOS
            </span>
            <h2 className="mb-4 text-[25px] leading-normal lg:text-[31px]">
              Um pouquinho de carinho.
              <br />
              <em>Um montão de encanto.</em>
            </h2>
            <p className="mb-3 max-w-115 text-[11px] text-muted lg:text-xs">
              A Debinatos reúne artesanatos, bijuterias e itens personalizados
              para você, para presentear e para deixar seu cantinho especial.
            </p>
            <p className="mb-3 max-w-115 text-[11px] text-muted lg:text-xs">
              Seu cantinho muito mais especial
            </p>
            <Link
              className="mt-3 inline-flex min-h-16 items-center justify-center gap-5 rounded-xl bg-brand px-7 py-4 text-base/snug  font-semibold text-white transition-colors hover:bg-brand-dark"
              href="/sobre"
            >
              Conheça a Debinatos <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="mt-4 bg-cream px-6 py-12 text-center md:py-16">
        <Flower2 className="mx-auto mb-5 text-brand" size={30} />
        <h2 className="mx-auto mb-3 max-w-3xl text-2xl md:text-[27px]">
          Tem sempre um encanto esperando por você.
        </h2>
        <p className="mb-6 text-xs text-muted">
          Salve seus favoritos e volte quando quiser.
        </p>
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border px-5 py-3 text-xs/snug  font-semibold transition hover:-translate-y-px disabled:translate-y-0 border-[#d7bbb0] bg-transparent text-brand hover:border-brand hover:bg-[#fff4ec]"
          href="/favoritos"
        >
          <Heart size={17} /> Meu cantinho de favoritos
        </Link>
      </section>
    </>
  );
}
