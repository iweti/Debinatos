export function DemoBanner() {
  return (
    <div className="flex min-h-8 items-center justify-center gap-5 bg-brand px-4 py-2 text-[8px] tracking-wide text-[#fff8ed] md:justify-between md:px-8 md:text-[10px] xl:px-[max(48px,calc((100%-1240px)/2))]">
      <span className="flex items-center gap-2">
        <span className="inline-block size-1 rounded-full bg-gold" /> 
        Uma loja cheia de encantos
      </span>
    </div>
  );
}
