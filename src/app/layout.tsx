import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Debinatos • Pequenos detalhes, grandes encantos",
    template: "%s | Debinatos",
  },
  description:
    "Artesanatos, bijuterias e itens personalizados feitos com amor, qualidade e exclusividade. Envios para todo o Brasil. Explore a loja de demonstração Debinatos.",
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#B42A1D" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <a className="skip-link" href="#conteudo">
            Pular para o conteúdo
          </a>
          <DemoBanner />
          <Header />
          <main id="conteudo" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
