import type { ReactNode } from "react";

type StatsCardProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint: ReactNode;
};

export function StatsCard({ icon, label, value, hint }: StatsCardProps) {
  return (
    <article className="rounded-xl border border-line bg-white p-5 md:p-7">
      <span className="grid size-9 place-items-center rounded-xl bg-cream text-brand">
        {icon}
      </span>
      <span className="mt-4 block text-[10px] text-muted md:text-[11px]">
        {label}
      </span>
      <strong className="mt-2.5 block text-[25px] font-medium tracking-tight md:text-[30px]">
        {value}
      </strong>
      <small className="mt-2.5 block text-[8px] leading-relaxed text-muted md:text-[9px]">
        {hint}
      </small>
    </article>
  );
}
