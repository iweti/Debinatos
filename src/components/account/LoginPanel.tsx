"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import { useDemoLogin } from "@/lib/hooks/use-demo-login";

export function LoginPanel({ next = "/perfil" }: { next?: string }) {
  const { ready, login } = useDemoLogin(next);
  return (
    <div className="login-panel">
      <div className="empty-icon">
        <UserRound size={30} />
      </div>
      <span className="eyebrow">UM CANTINHO SÓ SEU</span>
      <h1>Que bom ter você por aqui.</h1>
      <p>
        Entre no perfil de demonstração para acompanhar pedidos, editar seus
        dados e experimentar a loja.
      </p>
      <div className="demo-user">
        <span className="avatar">M</span>
        <div>
          <strong>Marina Oliveira</strong>
          <span>Perfil fictício para explorar a loja</span>
        </div>
      </div>
      <button className="button full" disabled={!ready} onClick={login}>
        Usar perfil de demonstração <ArrowRight size={17} />
      </button>
      <p className="demo-note">
        <ShieldCheck size={17} /> Não há senha ou conta real. Seus itens salvos
        e carrinho serão preservados.
      </p>
      <Link className="text-link" href="/catalogo">
        Continuar explorando a loja
      </Link>
    </div>
  );
}
