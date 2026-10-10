"use client";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export function NotFound() {
  return (
    <div className="page-container">
      <EmptyState
        icon={<Package size={32} />}
        title="Esse caminho não levou a um encanto."
      >
        A página que você procura não foi encontrada. Vamos voltar à coleção?
      </EmptyState>
    </div>
  );
}
