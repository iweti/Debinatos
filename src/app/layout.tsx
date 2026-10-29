import './globals.css'

import type { Metadata, Viewport } from 'next'
import { connection } from 'next/server'
import type { ReactNode } from 'react'

import { DemoBanner } from '@/components/layout/DemoBanner'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
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
    icons: { icon: { url: '/favicon.png', sizes: '128x128', type: 'image/png' } },
    robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: '#B42A1D' }

export default async function RootLayout({ children }: { children: ReactNode }) {
    await connection()
    let products: Product[] = []
    let catalogError = false
    try {
        products = await getProducts()
    } catch (error) {
        // Log only the message: driver error objects can contain connection credentials.
        const message = error instanceof Error ? error.message : 'Erro desconhecido ao consultar os produtos.'
        console.error('error: ', message)
        catalogError = true
    }
    return (
        <html lang="pt-BR">
            <body className="pb-[calc(6rem+env(safe-area-inset-bottom))] lg:pb-0">
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
                    <MobileNavigation />
                    <Toast />
                </StoreProvider>
            </body>
        </html>
    )
}
