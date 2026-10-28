'use client'
import { ArrowRight, Eye, Heart, MapPin, Target, Truck } from 'lucide-react'
import Link from 'next/link'

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PageHeading } from '@/components/ui/PageHeading'
import { INSTAGRAM_URL } from '@/lib/constants/brand'
import { PICKUP_ADDRESS } from '@/lib/constants/store'

export function About() {
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Sobre a Debinatos' }]} />
            <div className="grid items-center gap-8 rounded-2xl border border-brand/15 bg-cream p-6 md:grid-cols-[220px_1fr] md:gap-10 md:p-10 lg:grid-cols-[260px_1fr] lg:gap-14">
                <img className="mx-auto w-52 rounded-t-[140px] rounded-b-xl md:w-full" src="/images/marca-debinatos.jpg" alt="Logo e mascote da Debinatos" />
                <div>
                    <PageHeading eyebrow="DEBINATOS" title="Nossa história, nossa essência e nosso futuro">
                        Pequenos detalhes, grandes sentimentos.
                    </PageHeading>
                    <div className="mt-6 space-y-4 text-sm text-muted md:text-[15px]">
                        <p>
                            A Debinatos representa a união entre o conhecimento de um filho e a criatividade de uma mãe. Nossa essência está nessa história
                            verdadeira, com pessoas reais por trás de cada produto.
                        </p>
                        <blockquote className="border-l-2 border-brand pl-5 font-serif text-xl text-brand md:text-2xl">
                            <p>“De um projeto universitário a um sonho em família.”</p>
                        </blockquote>
                        <p>Essa frase traduz nossa origem e os laços familiares que inspiram cada criação.</p>
                    </div>
                </div>
            </div>
            <article className="space-y-10 pt-10 text-sm text-muted md:space-y-14 md:pt-14 md:text-[15px]">
                <section className="mx-auto max-w-3xl">
                    <h2 className="mb-5 text-ink">Nossa história</h2>
                    <div className="space-y-4">
                        <p className="font-medium text-ink">Uma ideia que nasceu na universidade e ganhou vida em família.</p>
                        <p>Toda grande história tem um começo. A nossa começou de uma maneira especial: por meio de um projeto de extensão universitária.</p>
                        <p>
                            O que inicialmente surgiu como uma iniciativa acadêmica tornou-se uma oportunidade de unir conhecimento, criatividade e
                            empreendedorismo, dando os primeiros passos para a construção de algo que pudesse ir além das salas de aula.
                        </p>
                        <p>
                            Foi nesse contexto que nasceu a Debinatos, uma marca que carrega em sua essência não apenas o desejo de empreender, mas também o
                            valor dos laços familiares.
                        </p>
                        <p>
                            De um lado, Vitor, um jovem universitário que encontrou no projeto uma oportunidade de transformar conhecimento em uma iniciativa
                            empreendedora. Do outro, sua mãe, Débora, responsável pelo coração criativo da Debinatos, dando vida aos produtos por meio de suas
                            habilidades, dedicação e sensibilidade.
                        </p>
                        <p>
                            Essa união representa muito do que acreditamos: que diferentes talentos, quando caminham juntos, podem transformar ideias em
                            realizações.
                        </p>
                        <p>
                            Na Debinatos, cada criação carrega um pouco dessa história. Por trás dos produtos, existem mãos que criam, ideias que se desenvolvem
                            e uma família que participa da construção de um sonho.
                        </p>
                        <p>
                            Nosso trabalho vai além da produção e comercialização de artigos artesanais, presentes e produtos personalizados. Buscamos oferecer
                            peças que despertem sentimentos, transmitam carinho e façam parte de momentos especiais.
                        </p>
                        <p>
                            Acreditamos que a criatividade é uma forma de expressão e que os pequenos detalhes têm o poder de transformar experiências simples
                            em lembranças significativas.
                        </p>
                        <p>
                            Hoje, a Debinatos representa o encontro entre gerações, conhecimentos e sonhos. Uma marca que nasceu de uma oportunidade acadêmica e
                            encontrou na criatividade e na união familiar a inspiração para construir seu próprio caminho.
                        </p>
                        <p>
                            E, embora nossa história ainda esteja sendo escrita, temos a certeza de que cada novo produto, cada cliente e cada conquista
                            representam mais um capítulo dessa trajetória.
                        </p>
                        <p>Somos a Debinatos. Uma história de família, criatividade e sonhos que ganham forma.</p>
                    </div>
                </section>
                {/* ponytail: CSS grid and hover cover presentation; no interaction state needed. */}
                <div className="grid items-start gap-6 lg:grid-cols-3">
                    <section className="rounded-2xl border border-line bg-surface p-6 transition-shadow duration-200 hover:border-brand/30 hover:shadow-xl motion-safe:transition-[transform,box-shadow,border-color] motion-safe:hover:-translate-y-2 md:p-7">
                        <h2 className="mb-6 flex items-center gap-3 text-xl text-ink md:text-2xl">
                            <span
                                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand font-sans text-lg font-semibold tracking-normal text-white"
                                aria-hidden="true"
                            >
                                <Target size={22} />
                            </span>
                            Nossa missão
                        </h2>
                        <div className="space-y-4">
                            <p className="font-medium text-ink">Transformar criatividade e dedicação em produtos que encantam e aproximam pessoas.</p>
                            <p>
                                Desenvolver e oferecer produtos artesanais, personalizados e criativos, valorizando o cuidado em cada detalhe, a originalidade e
                                o carinho presente em cada criação.
                            </p>
                            <p>
                                Buscamos proporcionar experiências que ultrapassem o ato de comprar, fazendo parte de momentos especiais e construindo relações
                                de confiança com nossos clientes.
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-line bg-surface p-6 transition-shadow duration-200 hover:border-brand/30 hover:shadow-xl motion-safe:transition-[transform,box-shadow,border-color] motion-safe:hover:-translate-y-2 md:p-7">
                        <h2 className="mb-6 flex items-center gap-3 text-xl text-ink md:text-2xl">
                            <span
                                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand font-sans text-lg font-semibold tracking-normal text-white"
                                aria-hidden="true"
                            >
                                <Eye size={22} />
                            </span>
                            Nossa visão
                        </h2>
                        <div className="space-y-4">
                            <p className="font-medium text-ink">
                                Ser uma marca reconhecida pela criatividade, autenticidade e pelo cuidado que transforma cada produto em algo especial.
                            </p>
                            <p>
                                Expandir nossa presença no mercado de produtos artesanais, criativos e personalizados, alcançando novos públicos e
                                oportunidades, sem perder nossas raízes familiares e o compromisso com a qualidade.
                            </p>
                            <p>
                                Queremos construir uma marca duradoura, capaz de inspirar pessoas e demonstrar que grandes realizações podem nascer de pequenas
                                iniciativas.
                            </p>
                        </div>
                    </section>
                    <section className="rounded-2xl border border-line bg-surface p-6 transition-shadow duration-200 hover:border-brand/30 hover:shadow-xl motion-safe:transition-[transform,box-shadow,border-color] motion-safe:hover:-translate-y-2 md:p-7">
                        <h2 className="mb-6 flex items-center gap-3 text-xl text-ink md:text-2xl">
                            <span
                                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand font-sans text-lg font-semibold tracking-normal text-white"
                                aria-hidden="true"
                            >
                                <Heart size={22} />
                            </span>
                            Nossos valores
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-2 text-ink">Família e união</h3>
                                <p>
                                    Nossa história nasceu da colaboração familiar. Acreditamos que o respeito, o apoio mútuo e a união são fundamentais para
                                    construir relações verdadeiras e duradouras.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-ink">Criatividade e originalidade</h3>
                                <p>
                                    Valorizamos a liberdade de imaginar, desenvolver e transformar ideias em produtos que expressem personalidade e despertem
                                    sentimentos.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-ink">Carinho em cada detalhe</h3>
                                <p>
                                    Reconhecemos que cada produto representa uma oportunidade de proporcionar alegria. Por isso, buscamos colocar dedicação e
                                    atenção em tudo o que fazemos.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-ink">Ética e transparência</h3>
                                <p>
                                    Conduzimos nossas atividades com honestidade, responsabilidade e respeito, valorizando a confiança de nossos clientes e
                                    parceiros.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-ink">Empreendedorismo e aprendizado</h3>
                                <p>
                                    Nascemos de uma iniciativa acadêmica e acreditamos no conhecimento como ferramenta de transformação. Buscamos aprender
                                    continuamente, superar desafios e encontrar novas oportunidades.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-ink">Qualidade e compromisso</h3>
                                <p>
                                    Trabalhamos para oferecer produtos que atendam às expectativas de nossos clientes, respeitando nossos compromissos e
                                    buscando a melhoria contínua.
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-ink">Valorização das pessoas</h3>
                                <p>
                                    Acreditamos que cada pessoa possui uma história única. Por isso, buscamos construir relações próximas, acolhedoras e
                                    humanas.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
                <section className="mx-auto max-w-3xl">
                    <h2 className="mb-5 text-ink">Nosso propósito</h2>
                    <div className="space-y-4">
                        <p className="font-medium text-ink">
                            Transformar ideias em criações que carregam sentimentos, valorizando a criatividade, os laços familiares e a beleza dos pequenos
                            detalhes.
                        </p>
                        <p>A Debinatos existe para mostrar que o trabalho feito com dedicação pode ir além de um produto.</p>
                        <p>
                            Queremos participar de celebrações, demonstrar carinho por meio de nossas criações e levar um pouco da nossa história para a vida de
                            outras pessoas.
                        </p>
                        <p>Porque, para nós, cada criação representa mais do que aquilo que se vê: representa dedicação, afeto e a realização de um sonho.</p>
                    </div>
                </section>
                <Link
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark"
                    href="/catalogo"
                >
                    Conhecer a coleção <ArrowRight size={16} />
                </Link>
            </article>
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
