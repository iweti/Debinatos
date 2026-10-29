'use client'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PageHeading } from '@/components/ui/PageHeading'

import { AboutCard } from './AboutCard'

export function About() {
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Sobre a Debinatos' }]} />
            <div className="grid items-center gap-8 rounded-xl bg-[#fcf8f2] p-6 md:grid-cols-[220px_1fr] md:gap-10 md:p-10 lg:grid-cols-[260px_1fr] lg:gap-14">
                <img className="mx-auto w-52 rounded-t-[140px] rounded-b-xl md:w-full" src="/images/marca-debinatos.jpg" alt="Logo e mascote da Debinatos" />
                <div>
                    <PageHeading eyebrow="DEBINATOS" title="Nossa história, nossa essência e nosso futuro">
                        De um projeto universitário a um sonho em família: a Debinatos une o conhecimento de um filho à criatividade de uma mãe, transformando
                        pequenos detalhes em grandes sentimentos.
                    </PageHeading>
                </div>
            </div>
            <article className="flex max-w-full flex-col gap-8 pt-10 text-sm text-muted md:gap-10 md:pt-14 md:text-[15px]">
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
                            encontrou na criatividade e na união familiar a inspiração para construir seu próprio caminho.
                        </p>
                    </div>
                </section>
                <div className="grid gap-5 my-30 md:grid-cols-3">
                    <AboutCard title="Missão">
                        <p className="text-pretty">
                            Criar produtos e personalizados que encantam e aproximam pessoas, com originalidade, carinho e cuidado em cada detalhe.
                        </p>
                    </AboutCard>
                    <AboutCard title="Visão">
                        <p>
                            Ser reconhecida pela criatividade e qualidade, levando nossas criações a novos públicos sem perder as raízes familiares e a
                            autenticidade.
                        </p>
                    </AboutCard>
                    <AboutCard title="Valores">
                        <p>
                            Família, união e valorização das pessoas orientam nosso trabalho, com criatividade, carinho, ética, transparência, qualidade e
                            compromisso em aprender e empreender.
                        </p>
                    </AboutCard>
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
                <div className="flex justify-center pt-8 md:pt-10">
                    <Link
                        className="flex min-h-14 w-fit items-center justify-center rounded-lg border border-brand bg-brand px-7 py-4 text-sm/snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark"
                        href="/catalogo"
                    >
                        Conheça o encanto
                    </Link>
                </div>
            </article>
        </div>
    )
}
