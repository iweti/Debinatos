"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EmptyState({
  icon,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mt-2.5 rounded-xl border border-dashed border-[#e4d3c4] bg-surface px-5 py-12 text-center md:py-16">
      <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-cream text-brand">
        {icon}
      </div>
      <h2 className="mb-3 text-2xl md:text-[27px]">{title}</h2>
      <p className="mx-auto mb-6 max-w-107.5 text-xs text-muted">
        {children}
      </p>
      {action ?? (
        <Link
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug  font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0"
          href="/catalogo"
        >
          Explorar a loja <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
