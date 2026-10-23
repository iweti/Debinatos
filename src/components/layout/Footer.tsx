import { Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { INSTAGRAM_URL } from '@/lib/constants/brand'

export function Footer() {
    return (
        <footer className="border-t border-line bg-[#fffdf9] pt-10 md:pt-14">
            <div className="mx-auto w-[calc(100%-36px)] max-w-310 md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)] grid grid-cols-2 gap-x-6 gap-y-7 pb-9 md:grid-cols-[1.5fr_.9fr_.9fr_1fr] md:gap-8 md:pb-12">
                <div className="col-span-2 md:col-span-1 max-md:last:col-[span_2]">
                    <Link className="inline-flex shrink-0 items-center gap-2.5" href="/">
                        <span className="font-serif text-[25px] leading-none font-semibold tracking-[-1px] text-brand italic md:text-[30px]">
                            Debinatos
                            <span className="mt-2 block font-sans text-[5px] leading-none font-medium tracking-[2px] text-muted not-italic md:text-[7px]">
                                DETALHES QUE ENCANTAM
                            </span>
                        </span>
                    </Link>
                    <p className="mt-5 mb-4 text-[11px] leading-[1.9] text-muted">
                        Artesanatos, bijuterias e itens personalizados.
                        <br />
                        Feitos com amor, qualidade e exclusividade.
                        <br />
                        Envios para todo o Brasil.
                    </p>
                    <span className="flex items-center gap-2 text-[9px] text-brand">
                        Feito com carinho <Heart size={13} />
                    </span>
                </div>
                <div className="max-md:last:col-[span_2]">
                    <h3 className="mt-1 mb-5 text-xs">Explore</h3>
                    <Link className="my-3 block text-[11px] text-muted hover:text-brand" href="/catalogo">
                        Todos os produtos
                    </Link>
                </div>
                <div className="max-md:last:col-[span_2]">
                    <h3 className="mt-1 mb-5 text-xs">Seu espaço</h3>
                    <Link className="my-3 block text-[11px] text-muted hover:text-brand" href="/carrinho">
                        Meu carrinho
                    </Link>
                    <Link className="my-3 block text-[11px] text-muted hover:text-brand" href="/favoritos">
                        Itens salvos
                    </Link>
                    <Link className="my-3 block text-[11px] text-muted hover:text-brand" href="/admin">
                        Painel administrativo
                    </Link>
                </div>
                <div className="max-md:last:col-[span_2]">
                    <h3 className="mt-1 mb-5 text-xs">Estamos por aqui</h3>
                    <Link className="my-3 block text-[11px] text-muted hover:text-brand" href="/sobre">
                        Sobre a Debinatos
                    </Link>
                    <Link className="my-3 block text-[11px] text-muted hover:text-brand" href="/contato">
                        Contato
                    </Link>
                    <Link className="my-3 block text-[11px] text-muted hover:text-brand" href="/sobre#entregas">
                        Envio e retirada
                    </Link>
                    <Link className="my-3 block text-[11px] text-muted hover:text-brand" href="/sobre#duvidas">
                        Dúvidas frequentes
                    </Link>
                    <a className="my-3 block text-[11px] text-muted hover:text-brand" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                        Instagram @debinatos
                        <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                    <div className="flex items-center gap-2 pt-3 text-brand">
                        <Sparkles size={17} />
                        <span className="text-[9px] leading-relaxed">Pequenos detalhes, grandes sentimentos.</span>
                    </div>
                </div>
            </div>
            <div className="mx-auto w-[calc(100%-36px)] max-w-310 md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)] border-t border-line py-5 text-[9px] text-muted">
                <span>
                    Debinatos © {new Date().getFullYear()} · Desenvolvido por{' '}
                    <a className="underline underline-offset-2 hover:text-brand" href="https://iweti.com">
                        IWETI
                    </a>
                </span>
            </div>
        </footer>
    )
}
