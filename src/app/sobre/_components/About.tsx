"use client";
import Link from "next/link";
import { ArrowRight, MapPin, Truck } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeading } from "@/components/ui/PageHeading";
import { PICKUP_ADDRESS } from "@/lib/constants/store";
import { INSTAGRAM_URL } from "@/lib/constants/brand";

export function About() {
  return (
    <div className="page-container about-page">
      <Breadcrumb items={[{ label: "Sobre a Debinatos" }]} />
      <PageHeading
        eyebrow="FEITO DE DETALHES E AFETO"
        title="Prazer, Debinatos."
      >
        Artesanatos, bijuterias e itens personalizados feitos com amor.
      </PageHeading>
      <div className="about-grid">
        <img
          src="/images/marca-debinatos.jpg"
          alt="Logo e mascote da Debinatos"
        />
        <div>
          <h2>Amor, qualidade e exclusividade.</h2>
          <p>
            Na Debinatos, o carinho ganha forma em artesanatos, bijuterias e
            itens personalizados. Peças feitas com amor, qualidade e
            exclusividade para acompanhar você, presentear alguém especial e dar
            mais personalidade aos seus momentos.
          </p>
          <p>
            Enviamos para todo o Brasil. Nesta loja de demonstração, você pode
            conhecer esse universo, guardar seus favoritos e experimentar uma
            compra simulada.
          </p>
          <Link className="button" href="/catalogo">
            Conhecer a coleção <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <section id="entregas" className="info-section">
        <span className="eyebrow">DO NOSSO CANTINHO PARA O SEU</span>
        <h2>Envio e retirada</h2>
        <div className="info-cards grid gap-5 md:grid-cols-2">
          <article>
            <Truck size={25} />
            <h3>Envios para todo o Brasil</h3>
            <p>
              Na demonstração, o envio custa R$ 14,90 e tem prazo ilustrativo de
              5 a 8 dias úteis. Informe um CEP de 8 dígitos no checkout. Não há
              consulta a transportadoras.
            </p>
          </article>
          <article>
            <MapPin size={25} />
            <h3>Retire na loja</h3>
            <p>A retirada simulada é gratuita.</p>
            <p>{PICKUP_ADDRESS}.</p>
          </article>
        </div>
      </section>
      <section id="duvidas" className="info-section">
        <span className="eyebrow">PODEMOS AJUDAR?</span>
        <h2>Dúvidas frequentes</h2>
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
                  className="text-link"
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
          <details key={q}>
            <summary>
              {q}
              <PlusIcon />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}

function PlusIcon() {
  return <span aria-hidden="true">+</span>;
}
