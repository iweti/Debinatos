"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({
  items,
}: {
  items: Array<{ label: string; to?: string }>;
}) {
  return (
    <nav className="breadcrumb" aria-label="Caminho da página">
      <Link href="/">Início</Link>
      {items.map((item, index) => (
        <span key={index}>
          <ChevronRight size={12} />
          {item.to ? (
            <Link href={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
