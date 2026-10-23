import { ArrowRight, ArrowUpRight, Truck } from 'lucide-react'
import Link from 'next/link'

import { HeroArtwork } from '@/components/product/HeroArtwork'
import { DEFAULT_HERO_PHOTOS } from '@/lib/domain/highlights'
import type { HeroPhotos } from '@/lib/types/store'

export function Hero({ photos = DEFAULT_HERO_PHOTOS }: { photos?: HeroPhotos }) {
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
                <HeroArtwork photos={photos} />
            </div>
        </section>
    )
}
