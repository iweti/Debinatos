import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { INSTAGRAM_URL } from "@/lib/constants/brand";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container grid grid-cols-2 gap-x-6 gap-y-7 pb-9 md:grid-cols-[1.5fr_.9fr_.9fr_1fr] md:gap-8 md:pb-12">
        <div className="footer-brand">
          <Link className="brand" href="/">
            <span>
              Debinatos
              <span className="brand-subtitle">DETALHES QUE ENCANTAM</span>
            </span>
          </Link>
          <p>
            Artesanatos, bijuterias e itens personalizados.
            <br />
            Feitos com amor, qualidade e exclusividade.
            <br />
            Envios para todo o Brasil.
          </p>
          <span className="footer-love">
            Feito com carinho <Heart size={13} />
          </span>
        </div>
        <div>
          <h3>Explore</h3>
          <Link href="/catalogo">Todos os produtos</Link>
        </div>
        <div>
          <h3>Seu espaço</h3>
          <Link href="/perfil">Minha conta</Link>
          <Link href="/perfil?aba=pedidos">Meus pedidos</Link>
          <Link href="/favoritos">Itens salvos</Link>
          <Link href="/admin">Painel de demonstração</Link>
        </div>
        <div>
          <h3>Estamos por aqui</h3>
          <Link href="/sobre">Sobre a Debinatos</Link>
          <Link href="/sobre#entregas">Envio e retirada</Link>
          <Link href="/sobre#duvidas">Dúvidas frequentes</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            Instagram @debinatos
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <div className="footer-demo">
            <Sparkles size={17} />
            <span>
              Explore à vontade.
              <br />
              Esta é uma loja demonstrativa.
            </span>
          </div>
        </div>
      </div>
      <div className="site-container flex flex-col gap-2 border-t border-line py-5 text-[9px] text-muted md:flex-row md:justify-between">
        <span>
          © {new Date().getFullYear()} Debinatos. Feito para encantar.
        </span>
        <span>Dados e imagens ilustrativos • Nenhuma compra é real.</span>
      </div>
    </footer>
  );
}
