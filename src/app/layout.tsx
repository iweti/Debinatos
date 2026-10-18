import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { StoreProvider } from "@/components/providers/StoreProvider";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/ui/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Debinatos • Pequenos detalhes, grandes encantos",
    template: "Debinatos | %s",
  },
  description:
    "Artesanatos, bijuterias e itens personalizados feitos com amor, qualidade e exclusividade. Envios para todo o Brasil.",
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#B42A1D" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <StoreProvider>
          <a
            className="fixed -top-24 left-4 z-100 bg-white p-4 focus:top-3"
            href="#conteudo"
          >
            Pular para o conteúdo
          </a>
          <DemoBanner />
          <Header />
          <main id="conteudo" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
