"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import { useDemoLogin } from "@/lib/hooks/use-demo-login";

export function LoginPanel({ next = "/perfil" }: { next?: string }) {
  const { ready, login } = useDemoLogin(next);
  return (
    <div className="mx-auto my-5 max-w-[470px] rounded-xl border border-line bg-[#fffcf7] px-6 py-8 text-center md:my-9 md:p-9">
      <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-cream text-brand">
        <UserRound size={30} />
      </div>
      <span className="inline-flex items-center gap-2 text-[9px] leading-relaxed font-semibold tracking-[.18em] text-brand uppercase">
        UM CANTINHO SÓ SEU
      </span>
      <h1 className="my-3 text-[28px] md:text-[30px]">
        Que bom ter você por aqui.
      </h1>
      <p className="text-xs text-muted">
        Entre no perfil de demonstração para acompanhar pedidos, editar seus
        dados e experimentar a loja.
      </p>
      <div className="my-6 flex items-center gap-3 rounded-lg border border-[#eadccf] bg-white p-4 text-left">
        <span className="grid size-10 place-items-center rounded-full bg-[#f5e5d5] font-serif text-xl text-brand">
          M
        </span>
        <div>
          <strong className="block text-xs">Marina Oliveira</strong>
          <span className="mt-1 block text-[10px] text-muted">
            Perfil fictício para explorar a loja
          </span>
        </div>
      </div>
      <button
        className="min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs leading-snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 flex w-full"
        disabled={!ready}
        onClick={login}
      >
        Usar perfil de demonstração <ArrowRight size={17} />
      </button>
      <p className="mt-5 flex items-start gap-2 text-[10px] leading-relaxed text-[#856e5f] mb-5 text-left">
        <ShieldCheck className="mt-px text-brand" size={17} /> Não há senha ou
        conta real. Seus itens salvos e carrinho serão preservados.
      </p>
      <Link
        className="inline-flex items-center gap-2 p-0 leading-relaxed font-semibold text-brand hover:underline hover:underline-offset-4 text-[11px]"
        href="/catalogo"
      >
        Continuar explorando a loja
      </Link>
    </div>
  );
}
