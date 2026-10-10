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
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{children}</p>
      {action ?? (
        <Link className="button" href="/catalogo">
          Explorar a loja <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
