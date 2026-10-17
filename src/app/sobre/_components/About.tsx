"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Truck } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeading } from "@/components/ui/PageHeading";
import { PICKUP_ADDRESS } from "@/lib/constants/store";
import { INSTAGRAM_URL } from "@/lib/constants/brand";

export function About() {
  return (
    <div className="mx-auto min-h-[500px] w-[calc(100%-36px)] max-w-[1240px] pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
      <Breadcrumb items={[{ label: "Sobre a Debinatos" }]} />
      <PageHeading
        eyebrow="FEITO DE DETALHES E AFETO"
        title="Prazer, Debinatos."
      >
        Artesanatos, bijuterias e itens personalizados feitos com amor.
      </PageHeading>
      <div className="grid items-center gap-8 rounded-xl bg-[#fcf8f2] p-6 text-center md:grid-cols-[260px_1fr] md:p-10 md:text-left lg:grid-cols-[320px_1fr] lg:gap-14">
        <img
          className="mx-auto w-52 rounded-t-[140px] rounded-b-xl md:w-full"
          src="/images/marca-debinatos.jpg"
          alt="Logo e mascote da Debinatos"
        />
        <div>
          <h2 className="mb-5 text-[27px] md:text-[31px]">
            Amor, qualidade e exclusividade.
          </h2>
          <p className="mb-4 text-left text-xs text-muted md:text-[13px]">
            Na Debinatos, o carinho ganha forma em artesanatos, bijuterias e
            itens personalizados. Peças feitas com amor, qualidade e
            exclusividade para acompanhar você, presentear alguém especial e dar
            mais personalidade aos seus momentos.
          </p>
          <p className="mb-4 text-left text-xs text-muted md:text-[13px]">
            Enviamos para todo o Brasil. Nesta loja de demonstração, você pode
            conhecer esse universo, guardar seus favoritos e experimentar uma
            compra simulada.
          </p>
          <Link
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 mt-3"
            href="/catalogo"
          >
            Conhecer a coleção <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <section id="entregas" className="scroll-mt-7 pt-12 md:pt-16">
        <span className="inline-flex items-center gap-2 text-[9px] leading-relaxed font-semibold tracking-[.18em] text-brand uppercase">
          DO NOSSO CANTINHO PARA O SEU
        </span>
        <h2 className="mt-3 mb-7">Envio e retirada</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-xl border border-line p-6 md:p-8">
            <Truck className="mb-5 text-brand" size={25} />
            <h3 className="mb-4 font-serif text-xl font-medium">
              Envios para todo o Brasil
            </h3>
            <p className="mt-3 text-xs text-muted">
              Na demonstração, o envio custa R$ 14,90 e tem prazo ilustrativo de
              5 a 8 dias úteis. Informe um CEP de 8 dígitos no checkout. Não há
              consulta a transportadoras.
            </p>
          </article>
          <article className="rounded-xl border border-line p-6 md:p-8">
            <MapPin className="mb-5 text-brand" size={25} />
            <h3 className="mb-4 font-serif text-xl font-medium">
              Retire na loja
            </h3>
            <p className="mt-3 text-xs text-muted">
              A retirada simulada é gratuita.
            </p>
            <p className="mt-3 text-xs text-muted">{PICKUP_ADDRESS}.</p>
          </article>
        </div>
      </section>
      <section id="duvidas" className="scroll-mt-7 pt-12 md:pt-16">
        <span className="inline-flex items-center gap-2 text-[9px] leading-relaxed font-semibold tracking-[.18em] text-brand uppercase">
          PODEMOS AJUDAR?
        </span>
        <h2 className="mt-3 mb-7">Dúvidas frequentes</h2>
        {[
          {
            q: "Posso fazer uma compra real?",
            a: "Esta é uma loja de demonstração. Produtos, preços, estoque, pedidos e pagamentos são fictícios. O checkout não cobra nenhum valor nem solicita dados bancários.",
          },
          {
            q: "Onde meus favoritos e pedidos ficam salvos?",
            a: "Apenas neste navegador e dispositivo. Limpar os dados do navegador remove suas alterações. Use informações fictícias para experimentar o perfil e o endereço.",
          },
          {
            q: "Como acompanho meu pedido?",
            a: "Entre no perfil de demonstração e acesse Meus pedidos. Você também pode alterar o andamento de um pedido no painel administrativo para testar a experiência.",
          },
          {
            q: "Como falo com a loja?",
            a: (
              <>
                Conheça as peças e fale com a Debinatos pelo{" "}
                <a
                  className="inline-flex items-center gap-2 p-0 text-xs leading-relaxed font-semibold text-brand hover:underline hover:underline-offset-4"
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram @debinatos
                  <span className="sr-only"> (abre em nova aba)</span>
                </a>
                .
              </>
            ),
          },
          {
            q: "Como recomeço a demonstração?",
            a: "Acesse o painel administrativo e use Restaurar demonstração. Após a confirmação, o catálogo, o estoque e os pedidos iniciais serão recuperados e as alterações locais serão removidas.",
          },
        ].map(({ q, a }) => (
          <details className="group border-b border-line py-5" key={q}>
            <summary className="flex cursor-pointer list-none justify-between gap-5 text-xs [&::-webkit-details-marker]:hidden">
              {q}
              <span
                className="text-xl leading-none text-brand group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-4 max-w-[750px] text-xs text-muted">{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
