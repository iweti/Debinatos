"use client";
import { Heart } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeading } from "@/components/ui/PageHeading";
import { ProductCard } from "@/components/product/ProductCard";
import { useFavorites } from "../_lib/use-favorites";

export function Favorites() {
  const { products, hasUnavailable } = useFavorites();
  return (
    <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
      <Breadcrumb items={[{ label: "Itens salvos" }]} />
      <PageHeading eyebrow="UM CANTINHO SÓ SEU" title="Meus favoritos">
        Guarde os detalhes que fizeram seus olhos brilhar.
      </PageHeading>
      {products.length ? (
        <>
          <p className="text-xs text-muted mb-6">
            {products.length}{" "}
            {products.length === 1 ? "encanto salvo" : "encantos salvos"} no seu
            navegador
          </p>
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-7 md:grid-cols-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Heart size={32} />}
          title="Seu próximo favorito está por aí."
        >
          Toque no coração dos produtos para guardar seus encantos aqui. Você
          pode começar sem entrar no perfil.
        </EmptyState>
      )}
      {hasUnavailable && (
        <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-[#856e5f]">
          Alguns itens salvos foram desativados e não estão disponíveis na
          vitrine.
        </p>
      )}
    </div>
  );
}
