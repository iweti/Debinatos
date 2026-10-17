import type { Metadata } from "next";
import { Gift, MessageCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PageHeading } from "@/components/ui/PageHeading";

export const metadata: Metadata = { title: "Contato" };

export default function Page() {
  const phone = process.env.WHATSAPP_PHONE?.trim();
  const message = "Olá! Gostaria de saber mais sobre pedidos personalizados.";
  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : undefined;
  const buttonClassName =
    "inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 sm:w-auto";

  return (
    <div className="mx-auto min-h-[500px] w-[calc(100%-36px)] max-w-[1240px] pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
      <Breadcrumb items={[{ label: "Contato" }]} />
      <PageHeading eyebrow="VAMOS CRIAR ALGO ESPECIAL?" title="Contato">
        Sua ideia pode ganhar um toque de carinho da Debinatos.
      </PageHeading>
      <section
        className="rounded-xl border border-line bg-cream p-6 md:p-10"
        aria-labelledby="pedidos-personalizados"
      >
        <Gift className="mb-5 text-brand" size={30} aria-hidden="true" />
        <h2 id="pedidos-personalizados" className="mb-5">
          Pedidos personalizados
        </h2>
        <p className="mb-7 max-w-2xl text-xs text-muted md:text-[13px]">
          Tem uma ideia especial? Conte para a gente! Criamos peças
          personalizadas para presentear e deixar seus momentos ainda mais
          especiais. Fale conosco pelo WhatsApp para conversar sobre sua ideia,
          possibilidades, valores e prazos.
        </p>
        {whatsappUrl ? (
          <a
            className={buttonClassName}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Conversar pelo WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        ) : (
          <>
            <button
              className={buttonClassName}
              type="button"
              disabled
              aria-describedby="whatsapp-status"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Conversar pelo WhatsApp
            </button>
            <p id="whatsapp-status" className="mt-3 text-xs text-muted">
              WhatsApp em breve
            </p>
          </>
        )}
      </section>
    </div>
  );
}
