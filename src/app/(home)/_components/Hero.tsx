import { ArrowRight, ArrowUpRight, Flower2, Heart, Truck } from 'lucide-react'
import Link from 'next/link'

import { Photo } from '@/components/product/Photo'

export function Hero() {
    return (
        <section className="overflow-hidden bg-linear-to-br from-[#fbf7ef] to-cream">
            <div className="mx-auto w-[calc(100%-36px)] max-w-310 md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)] grid items-center md:min-h-135 md:grid-cols-[1.05fr_1fr] xl:min-h-150">
                <div className="relative z-2 pt-10 text-center md:py-12 md:text-left">
                    <span className="inline-flex items-center gap-2 leading-relaxed font-semibold text-brand uppercase mb-5 text-[7px] tracking-[.16em] xl:text-[9px]">
                        <span className="mr-1 h-px w-5 bg-brand md:w-7" /> AMOR EM CADA DETALHE
                    </span>
                    <h1 className="mb-5 text-[38px] leading-tight tracking-[-1.5px] md:whitespace-nowrap md:text-[40px] lg:text-[48px] xl:text-[56px] min-[768px]:max-[1100px]:text-[40px]">
                        Pequenos detalhes,
                        <br />
                        <em>grandes encantos.</em>
                    </h1>
                    <p className="mb-6 text-xs leading-[1.9] text-muted lg:text-sm">
                        Artesanatos, bijuterias e itens personalizados,
                        <br className="max-md:hidden" /> feitos com amor, qualidade e exclusividade.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start lg:gap-6">
                        <Link
                            className="inline-flex items-center justify-center gap-3 rounded-lg border border-brand bg-brand py-3 leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 min-h-11 px-4 text-[11px] lg:px-5 lg:text-xs"
                            href="/catalogo"
                        >
                            Encontre seu encanto <ArrowUpRight size={19} />
                        </Link>
                        <Link
                            className="inline-flex items-center gap-2 p-0 leading-relaxed font-semibold text-brand hover:underline hover:underline-offset-4 text-[10px] lg:text-[11px]"
                            href="/sobre"
                        >
                            Conheça a Debinatos <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-2 text-[8px] text-[#816b5d] md:justify-start lg:mt-8 lg:text-[10px]">
                        <span className="grid place-items-center text-brand">
                            <Truck size={21} />
                        </span>
                        <span>Envios para todo o Brasil.</span>
                    </div>
                </div>
                <div className="h-137.5 relative isolate min-[768px]:max-[1100px]:h-125 min-[768px]:max-[1100px]:scale-[0.8] min-[768px]:max-[1100px]:origin-[center_left] min-[768px]:max-[1100px]:-mr-17.5 max-md:h-92.5 max-md:w-[min(355px,100%)] max-md:m-[6px_auto_0] before:content-[''] before:absolute before:size-107.5  before:[border:1px_solid_#e3cec0] before:rounded-[50%] before:top-12.5 before:left-16.25 before:z-[-1] max-md:before:size-69.5  max-md:before:top-6.5 max-md:before:left-12.5">
                    <div className="absolute w-81.25 h-102.5 left-26.25 top-8.75 rounded-[180px_180px_100px_100px] overflow-hidden shadow-[0_15px_45px_#76522d0b] max-md:w-55.5 max-md:h-68.75 max-md:left-25 max-md:top-5.5 max-md:rounded-[140px_140px_75px_75px]">
                        <Photo
                            className="size-full  object-cover object-[50%_48%]"
                            source="/images/products/terrario-ursos-polares.webp"
                            alt="Terrário decorativo com ursos polares e tampa amadeirada da Debinatos."
                        />
                    </div>
                    <div className="absolute left-0 bottom-13.75 w-51.5 p-[8px_8px_14px] bg-white rounded-[90px_90px_9px_9px] rotate-[-8deg] shadow-[0_14px_35px_#62432212] max-md:w-36.25 max-md:left-4.5 max-md:bottom-7.5 max-md:p-[6px_6px_10px]">
                        <Photo
                            className="h-47.5 w-full object-cover rounded-[84px_84px_3px_3px] max-md:h-32"
                            source="/images/products/mini-aquario-axolote.webp"
                            alt="Mini aquário decorativo de axolote da Debinatos."
                        />
                        <span className="font-serif text-[14px] block text-center pt-2.75 max-md:pt-1.75 max-md:text-[11px]">
                            Um toque de <em>encanto.</em>
                        </span>
                    </div>
                    <div className="absolute left-13.75 top-12.5 size-23  flex flex-col items-center justify-center gap-1.75 [border:1px_dashed_#b42a1d80] rounded-[50%] text-brand bg-cream rotate-[-15deg] max-md:size-17.25  max-md:left-13.25 max-md:top-5.75 max-md:gap-1">
                        <Flower2 className="max-md:w-5" size={25} />
                        <span className="text-[8px] leading-[1.6] tracking-[1.7px] text-center max-md:text-[6px]">
                            DETALHES
                            <br />
                            COM AFETO
                        </span>
                    </div>
                    <span className="absolute text-brand font-[Georgia,serif] text-[48px] right-0 top-23 max-md:right-0 max-md:top-11.25 max-md:text-[33px]">
                        ✧
                    </span>
                    <span className="absolute text-brand font-[Georgia,serif] text-[33px] left-11.75 top-53.75 max-md:left-4.25 max-md:top-30.25 max-md:text-[27px]">
                        ✧
                    </span>
                    <div className="absolute bottom-21.25 right-1.25 bg-[#fffaf3] [border:1px_solid_#fff] rounded-[9px] p-[15px_18px] flex gap-3.25 items-center shadow-[0_10px_30px_#62432212] max-md:bottom-10 max-md:right-1.25 max-md:p-[11px_13px]">
                        <Heart className="text-brand max-md:w-3.75" size={17} />
                        <span className="text-[10px] leading-[1.7] text-muted">
                            Seu novo favorito
                            <br />
                            <strong className="text-ink font-medium">está por aqui.</strong>
                        </span>
                    </div>
                    <span className="absolute bottom-4 left-35 text-[8px] text-[#86766b] max-md:bottom-2.5 max-md:left-auto max-md:w-full max-md:text-center max-md:text-[6px]">
                        Peças da Debinatos
                    </span>
                </div>
            </div>
        </section>
    )
}
