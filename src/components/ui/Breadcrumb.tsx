"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; to?: string }>;
}) {
  return (
    <nav
      className="mb-8 flex flex-wrap items-center gap-1.5 text-[10px] leading-relaxed text-muted"
      aria-label="Caminho da página"
    >
      <Link className="hover:text-brand" href="/">
        Início
      </Link>
      {items.map((item, index) => (
        <span className="inline-flex items-center gap-1.5" key={index}>
          <ChevronRight size={12} />
          {item.to ? (
            <Link className="hover:text-brand" href={item.to}>
              {item.label}
            </Link>
          ) : (
            <span className="text-ink" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
