import './globals.css'

import type { Metadata, Viewport } from 'next'
import { connection } from 'next/server'
import type { ReactNode } from 'react'

import { DemoBanner } from '@/components/layout/DemoBanner'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { CatalogContent } from '@/components/providers/CatalogContent'
import { StoreProvider } from '@/components/providers/StoreProvider'
import { Toast } from '@/components/ui/Toast'
import { getProducts } from '@/lib/server/products'
import type { Product } from '@/lib/types/store'

export const metadata: Metadata = {
    title: {
        default: 'Debinatos • Pequenos detalhes, grandes encantos',
        template: 'Debinatos | %s',
    },
    description: 'Artesanatos, bijuterias e itens personalizados feitos com amor, qualidade e exclusividade. Envios para todo o Brasil.',
    icons: { icon: '/favicon.svg' },
    robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#B42A1D' }

export default async function RootLayout({ children }: { children: ReactNode }) {
    await connection()
    let products: Product[] = []
    let catalogError = false
    try {
        products = await getProducts()
    } catch {
        catalogError = true
    }
    return (
        <html lang="pt-BR">
            <body>
                <StoreProvider products={products} catalogError={catalogError}>
                    <a className="fixed -top-24 left-4 z-100 bg-white p-4 focus:top-3" href="#conteudo">
                        Pular para o conteúdo
                    </a>
                    <DemoBanner />
                    <Header />
                    <main id="conteudo" tabIndex={-1}>
                        <CatalogContent>{children}</CatalogContent>
                    </main>
                    <Footer />
                    <Toast />
                </StoreProvider>
            </body>
        </html>
    )
}
