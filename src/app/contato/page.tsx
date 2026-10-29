import { Gift, MapPin, Truck } from 'lucide-react'

import { ContactAction } from '@/components/contact/ContactAction'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PageHeading } from '@/components/ui/PageHeading'
import { INSTAGRAM_URL } from '@/lib/constants/brand'
import { PICKUP_ADDRESS } from '@/lib/constants/store'

export default function Page() {
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Contato' }]} />
            <PageHeading eyebrow="VAMOS CRIAR ALGO ESPECIAL?" title="Contato">
                Entre em contato com a Debinatos e faça seu pedido.
            </PageHeading>
            <section
                className="grid items-center gap-8 rounded-xl border border-line bg-cream p-6 md:grid-cols-[1.2fr_.8fr] md:gap-10 md:p-10 lg:gap-16 lg:p-12"
                aria-labelledby="fale-com-a-gente"
            >
                <div className="md:mr-20 xl:mr-30">
                    <Gift className="mb-5 text-brand" size={30} aria-hidden="true" />
                    <h2 id="fale-com-a-gente" className="mb-4">
                        Fale com a gente
                    </h2>
                    <div className="space-y-3 text-justify text-xs/relaxed text-muted md:text-[13px]">
                        <p>Tem uma dúvida ou uma ideia de presente? Vamos conversar e criar algo especial para você.</p>
                        <p>Pelo WhatsApp, você pode fazer seu pedido e combinar os detalhes, a entrega e os prazos diretamente com a Debinatos.</p>
                    </div>
                    <div className="mt-7 max-w-md mx-auto">
                        <ContactAction phone={process.env.WHATSAPP_PHONE?.trim()} />
                    </div>
                </div>
                <img
                    className="mx-auto h-auto w-full max-w-72 rounded-2xl object-contain md:max-w-96"
                    src="/images/marca-debinatos.jpg"
                    alt="Debinatos — detalhes que encantam"
                    width={1280}
                    height={1280}
                />
            </section>
            <section id="entregas" className="scroll-mt-7 pt-12 md:pt-16">
                <span className="inline-flex items-center gap-2 text-[9px] leading-relaxed font-semibold tracking-[.18em] text-brand uppercase">
                    DO NOSSO CANTINHO PARA O SEU
                </span>
                <h2 className="mt-3 mb-7">Envio e retirada</h2>
                <div className="grid gap-5 md:grid-cols-2">
                    <article className="rounded-xl border border-line p-6 md:p-8">
                        <Truck className="mb-5 text-brand" size={25} />
                        <h3 className="mb-4 font-serif text-xl font-medium">Envios para todo o Brasil</h3>
                        <p className="mt-3 text-xs text-muted">Entre em contato pelo WhatsApp para combinar as opções de envio e os prazos para sua região.</p>
                    </article>
                    <article className="rounded-xl border border-line p-6 md:p-8">
                        <MapPin className="mb-5 text-brand" size={25} />
                        <h3 className="mb-4 font-serif text-xl font-medium">Retire na loja</h3>
                        <p className="mt-3 text-xs text-muted">Combine a retirada diretamente com a Debinatos pelo WhatsApp.</p>
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
                        q: 'Onde meus favoritos e carrinho ficam salvos?',
                        a: 'Apenas neste navegador e dispositivo. Limpar os dados do navegador remove seus favoritos e carrinho.',
                    },
                    {
                        q: 'Como consulto os produtos que escolhi?',
                        a: 'Adicione os produtos ao carrinho e toque em Consultar pelo WhatsApp. A mensagem incluirá os nomes e as quantidades para combinar os detalhes com a Debinatos.',
                    },
                    {
                        q: 'Como falo com a loja?',
                        a: (
                            <>
                                Conheça as peças e fale com a Debinatos pelo{' '}
                                <a
                                    className="inline-flex items-center gap-2 p-0 text-xs/relaxed  font-semibold text-brand hover:underline hover:underline-offset-4"
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
                ].map(({ q, a }) => (
                    <details className="group border-b border-line py-5" key={q}>
                        <summary className="flex cursor-pointer list-none justify-between gap-5 text-xs [&::-webkit-details-marker]:hidden">
                            {q}
                            <span className="text-xl leading-none text-brand group-open:rotate-45" aria-hidden="true">
                                +
                            </span>
                        </summary>
                        <p className="mt-4 max-w-187.5 text-xs text-muted">{a}</p>
                    </details>
                ))}
            </section>
        </div>
    )
}
