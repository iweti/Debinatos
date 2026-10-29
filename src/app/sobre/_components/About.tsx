'use client'
import { ArrowRight, MapPin, Truck } from 'lucide-react'
import Link from 'next/link'

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PageHeading } from '@/components/ui/PageHeading'
import { INSTAGRAM_URL } from '@/lib/constants/brand'
import { PICKUP_ADDRESS } from '@/lib/constants/store'

export function About() {
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Sobre a Debinatos' }]} />
            <div className="grid items-center gap-8 rounded-xl bg-[#fcf8f2] p-6 md:grid-cols-[220px_1fr] md:gap-10 md:p-10 lg:grid-cols-[260px_1fr] lg:gap-14">
                <img className="mx-auto w-52 rounded-t-[140px] rounded-b-xl md:w-full" src="/images/marca-debinatos.jpg" alt="Logo e mascote da Debinatos" />
                <div>
                    <PageHeading eyebrow="DEBINATOS" title="Nossa história, nossa essência e nosso futuro">
                        Pequenos detalhes, grandes sentimentos.
                    </PageHeading>
                </div>
            </div>
            <article className="max-w-full space-y-8 pt-10 text-sm text-muted md:space-y-10 md:pt-14 md:text-[15px]">
                <section>
                    <h2 className="mb-4 text-ink">Nossa história</h2>
                    <div className="space-y-3">
                        <p>
                            <span className="font-medium text-ink">Uma ideia que nasceu na universidade e ganhou vida em família.</span> Toda grande história
                            tem um começo. A nossa começou de uma maneira especial: por meio de um projeto de extensão universitária. O que inicialmente surgiu
                            como uma iniciativa acadêmica tornou-se uma oportunidade de unir conhecimento, criatividade e empreendedorismo, dando os primeiros
                            passos para a construção de algo que pudesse ir além das salas de aula.
                        </p>
                        <p>
                            Foi nesse contexto que nasceu a Debinatos, uma marca que carrega em sua essência não apenas o desejo de empreender, mas também o
                            valor dos laços familiares. De um lado, Vitor, um jovem universitário que encontrou no projeto uma oportunidade de transformar
                            conhecimento em uma iniciativa empreendedora. Do outro, sua mãe, Débora, responsável pelo coração criativo da Debinatos, dando vida
                            aos produtos por meio de suas habilidades, dedicação e sensibilidade. Essa união representa muito do que acreditamos: que diferentes
                            talentos, quando caminham juntos, podem transformar ideias em realizações.
                        </p>
                        <p>
                            Na Debinatos, cada criação carrega um pouco dessa história. Por trás dos produtos, existem mãos que criam, ideias que se desenvolvem
                            e uma família que participa da construção de um sonho. Nosso trabalho vai além da produção e comercialização de artigos artesanais,
                            presentes e produtos personalizados. Buscamos oferecer peças que despertem sentimentos, transmitam carinho e façam parte de momentos
                            especiais. Acreditamos que a criatividade é uma forma de expressão e que os pequenos detalhes têm o poder de transformar
                            experiências simples em lembranças significativas.
                        </p>
                        <p>
                            Hoje, a Debinatos representa o encontro entre gerações, conhecimentos e sonhos. Uma marca que nasceu de uma oportunidade acadêmica e
                            encontrou na criatividade e na união familiar a inspiração para construir seu próprio caminho. E, embora nossa história ainda esteja
                            sendo escrita, temos a certeza de que cada novo produto, cada cliente e cada conquista representam mais um capítulo dessa
                            trajetória. Somos a Debinatos. Uma história de família, criatividade e sonhos que ganham forma.
                        </p>
                    </div>
                </section>
                <div className="grid gap-5 md:grid-cols-3">
                    <section className="group rounded-xl border border-line bg-[#fcf8f2] p-6 transition duration-300 ease-out hover:-translate-y-2 hover:border-brand hover:bg-brand hover:text-white hover:shadow-xl hover:shadow-brand/25 motion-reduce:transform-none motion-reduce:transition-none md:p-8">
                        <h2 className="mb-4 text-ink transition-colors duration-300 group-hover:text-white motion-reduce:transition-none">Missão</h2>
                        <p>
                            Criar produtos artesanais e personalizados que encantam e aproximam pessoas, com originalidade, carinho e cuidado em cada detalhe.
                        </p>
                    </section>
                    <section className="group rounded-xl border border-line bg-[#fcf8f2] p-6 transition duration-300 ease-out hover:-translate-y-2 hover:border-brand hover:bg-brand hover:text-white hover:shadow-xl hover:shadow-brand/25 motion-reduce:transform-none motion-reduce:transition-none md:p-8">
                        <h2 className="mb-4 text-ink transition-colors duration-300 group-hover:text-white motion-reduce:transition-none">Visão</h2>
                        <p>
                            Ser reconhecida pela criatividade e qualidade, levando nossas criações a novos públicos sem perder as raízes familiares e a
                            autenticidade.
                        </p>
                    </section>
                    <section className="group rounded-xl border border-line bg-[#fcf8f2] p-6 transition duration-300 ease-out hover:-translate-y-2 hover:border-brand hover:bg-brand hover:text-white hover:shadow-xl hover:shadow-brand/25 motion-reduce:transform-none motion-reduce:transition-none md:p-8">
                        <h2 className="mb-4 text-ink transition-colors duration-300 group-hover:text-white motion-reduce:transition-none">Valores</h2>
                        <p>
                            Família, união e valorização das pessoas orientam nosso trabalho, com criatividade, carinho, ética, transparência, qualidade e
                            compromisso em aprender e empreender.
                        </p>
                    </section>
                </div>
                <section>
                    <h2 className="mb-4 text-ink">Nosso propósito</h2>
                    <div className="space-y-3">
                        <p>
                            <span className="font-medium text-ink">
                                Transformar ideias em criações que carregam sentimentos, valorizando a criatividade, os laços familiares e a beleza dos pequenos
                                detalhes.
                            </span>{' '}
                            A Debinatos existe para mostrar que o trabalho feito com dedicação pode ir além de um produto. Queremos participar de celebrações,
                            demonstrar carinho por meio de nossas criações e levar um pouco da nossa história para a vida de outras pessoas. Porque, para nós,
                            cada criação representa mais do que aquilo que se vê: representa dedicação, afeto e a realização de um sonho.
                        </p>
                    </div>
                </section>
                <section className="rounded-xl bg-[#fcf8f2] p-6 md:p-8">
                    <h2 className="mb-4 text-ink">O significado da Debinatos</h2>
                    <div className="space-y-3">
                        <p>
                            A Debinatos representa a união entre o conhecimento de um filho e a criatividade de uma mãe. Nossa essência está nessa história
                            verdadeira, com pessoas reais por trás de cada produto.
                        </p>
                        <blockquote className="border-l-2 border-brand pl-5 font-serif text-xl text-brand md:text-2xl">
                            <p>“De um projeto universitário a um sonho em família.”</p>
                        </blockquote>
                        <p>Essa frase traduz nossa origem e os laços familiares que inspiram cada criação.</p>
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
