import Link from "next/link";
import { ArrowRight, ArrowUpRight, Flower2, Heart, Truck } from "lucide-react";
import { Photo } from "@/components/product/Photo";

export function Hero() {
  return (
    <section className="hero">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="short-line" /> AMOR EM CADA DETALHE
          </span>
          <h1>
            Pequenos detalhes,
            <br />
            <em>grandes encantos.</em>
          </h1>
          <p>
            Artesanatos, bijuterias e itens personalizados,
            <br className="desktop-only" /> feitos com amor, qualidade e
            exclusividade.
          </p>
          <div className="hero-buttons">
            <Link className="button" href="/catalogo">
              Encontre seu encanto <ArrowUpRight size={19} />
            </Link>
            <Link className="text-link" href="/sobre">
              Conheça a Debinatos <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-note">
            <span className="little-flower">
              <Truck size={21} />
            </span>
            <span>Envios para todo o Brasil.</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-oval">
            <Photo
              source="/images/earrings.jpg"
              alt="Bijuterias douradas em uma composição delicada. Imagem ilustrativa."
            />
          </div>
          <div className="hero-mini">
            <Photo
              source="/images/bracelet.jpg"
              alt="Pulseira dourada. Imagem ilustrativa."
            />
            <span>
              Um toque de <em>encanto.</em>
            </span>
          </div>
          <div className="hero-stamp">
            <Flower2 size={25} />
            <span>
              DETALHES
              <br />
              COM AFETO
            </span>
          </div>
          <span className="hero-sparkle one">✧</span>
          <span className="hero-sparkle two">✧</span>
          <div className="hero-floating">
            <Heart size={17} />
            <span>
              Seu novo favorito
              <br />
              <strong>está por aqui.</strong>
            </span>
          </div>
          <span className="hero-image-note">
            Composição com imagens ilustrativas
          </span>
        </div>
      </div>
    </section>
  );
}
