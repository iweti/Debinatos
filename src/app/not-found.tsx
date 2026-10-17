"use client";
import { Package } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
      <EmptyState
        icon={<Package size={32} />}
        title="Esse caminho não levou a um encanto."
      >
        A página que você procura não foi encontrada. Vamos voltar à coleção?
      </EmptyState>
    </div>
  );
}
