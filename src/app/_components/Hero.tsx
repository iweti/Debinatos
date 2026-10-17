import Link from "next/link";
import { ArrowRight, ArrowUpRight, Flower2, Heart, Truck } from "lucide-react";
import { Photo } from "@/components/product/Photo";

export function Hero() {
  return (
    <section className="overflow-hidden bg-linear-to-br from-[#fbf7ef] to-cream">
      <div className="mx-auto w-[calc(100%-36px)] max-w-[1240px] md:w-[calc(100%-64px)] xl:w-[calc(100%-96px)] grid items-center md:min-h-[540px] md:grid-cols-[1.05fr_1fr] xl:min-h-[600px]">
        <div className="relative z-2 pt-10 text-center md:py-12 md:text-left">
          <span className="inline-flex items-center gap-2 leading-relaxed font-semibold text-brand uppercase mb-5 text-[7px] tracking-[.16em] xl:text-[9px]">
            <span className="mr-1 h-px w-5 bg-brand md:w-7" /> AMOR EM CADA
            DETALHE
          </span>
          <h1 className="mb-5 text-[38px] leading-[1.25] tracking-[-1.5px] md:whitespace-nowrap md:text-[40px] lg:text-[48px] xl:text-[56px] min-[768px]:max-[1100px]:text-[40px]">
            Pequenos detalhes,
            <br />
            <em>grandes encantos.</em>
          </h1>
          <p className="mb-6 text-xs leading-[1.9] text-muted lg:text-sm">
            Artesanatos, bijuterias e itens personalizados,
            <br className="max-md:hidden" /> feitos com amor, qualidade e
            exclusividade.
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
        <div className="h-[550px] relative isolate min-[768px]:max-[1100px]:h-[500px] min-[768px]:max-[1100px]:scale-[0.8] min-[768px]:max-[1100px]:origin-[center_left] min-[768px]:max-[1100px]:mr-[-70px] max-md:h-[370px] max-md:w-[min(355px,_100%)] max-md:m-[6px_auto_0] before:content-[''] before:absolute before:w-[430px] before:h-[430px] before:[border:1px_solid_#e3cec0] before:rounded-[50%] before:top-[50px] before:left-[65px] before:z-[-1] max-md:before:w-[278px] max-md:before:h-[278px] max-md:before:top-[26px] max-md:before:left-[50px]">
          <div className="absolute w-[325px] h-[410px] left-[105px] top-[35px] rounded-[180px_180px_100px_100px] overflow-hidden shadow-[0_15px_45px_#76522d0b] max-md:w-[222px] max-md:h-[275px] max-md:left-[100px] max-md:top-[22px] max-md:rounded-[140px_140px_75px_75px]">
            <Photo
              className="w-[100%] h-[100%] object-cover object-[50%_48%]"
              source="/images/earrings.jpg"
              alt="Bijuterias douradas em uma composição delicada. Imagem ilustrativa."
            />
          </div>
          <div className="absolute left-[0] bottom-[55px] w-[206px] p-[8px_8px_14px] bg-[#fff] rounded-[90px_90px_9px_9px] rotate-[-8deg] shadow-[0_14px_35px_#62432212] max-md:w-[145px] max-md:left-[18px] max-md:bottom-[30px] max-md:p-[6px_6px_10px]">
            <Photo
              className="h-[190px] w-[100%] object-cover rounded-[84px_84px_3px_3px] max-md:h-[128px]"
              source="/images/bracelet.jpg"
              alt="Pulseira dourada. Imagem ilustrativa."
            />
            <span className="font-serif text-[14px] block text-center pt-[11px] max-md:pt-[7px] max-md:text-[11px]">
              Um toque de <em>encanto.</em>
            </span>
          </div>
          <div className="absolute left-[55px] top-[50px] w-[92px] h-[92px] flex flex-col items-center justify-center gap-[7px] [border:1px_dashed_#b42a1d80] rounded-[50%] text-[var(--color-brand)] bg-[var(--color-cream)] rotate-[-15deg] max-md:w-[69px] max-md:h-[69px] max-md:left-[53px] max-md:top-[23px] max-md:gap-[4px]">
            <Flower2 className="max-md:w-[20px]" size={25} />
            <span className="text-[8px] leading-[1.6] tracking-[1.7px] text-center max-md:text-[6px]">
              DETALHES
              <br />
              COM AFETO
            </span>
          </div>
          <span className="absolute text-[var(--color-brand)] font-[Georgia,serif] text-[48px] right-[0] top-[92px] max-md:right-[0] max-md:top-[45px] max-md:text-[33px]">
            ✧
          </span>
          <span className="absolute text-[var(--color-brand)] font-[Georgia,serif] text-[33px] left-[47px] top-[215px] max-md:left-[17px] max-md:top-[121px] max-md:text-[27px]">
            ✧
          </span>
          <div className="absolute bottom-[85px] right-[5px] bg-[#fffaf3] [border:1px_solid_#fff] rounded-[9px] p-[15px_18px] flex gap-[13px] items-center shadow-[0_10px_30px_#62432212] max-md:bottom-[40px] max-md:right-[5px] max-md:p-[11px_13px]">
            <Heart
              className="text-[var(--color-brand)] max-md:w-[15px]"
              size={17}
            />
            <span className="text-[10px] leading-[1.7] text-[var(--color-muted)]">
              Seu novo favorito
              <br />
              <strong className="text-[var(--color-ink)] font-medium">
                está por aqui.
              </strong>
            </span>
          </div>
          <span className="absolute bottom-[16px] left-[140px] text-[8px] text-[#86766b] max-md:bottom-[10px] max-md:left-[auto] max-md:w-[100%] max-md:text-center max-md:text-[6px]">
            Composição com imagens ilustrativas
          </span>
        </div>
      </div>
    </section>
  );
}
