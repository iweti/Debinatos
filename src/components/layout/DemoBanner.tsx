export function DemoBanner() {
  return (
    <div className="flex min-h-8 items-center justify-center gap-5 bg-brand px-4 py-2 text-[8px] tracking-wide text-[#fff8ed] md:justify-between md:px-8 md:text-[10px] xl:px-[max(48px,calc((100%-1240px)/2))]">
      <span className="first:flex first:items-center first:gap-2 last:hidden last:md:block">
        <span className="inline-block size-1 rounded-full bg-gold" /> Uma loja
        cheia de encantos, em versão de demonstração
      </span>
      <span className="first:flex first:items-center first:gap-2 last:hidden last:md:block">
        Compras simuladas • sem cobranças
      </span>
    </div>
  );
}
