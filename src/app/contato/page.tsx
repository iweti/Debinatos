import { Gift } from 'lucide-react'
import type { Metadata } from 'next'

import { ContactAction } from '@/components/contact/ContactAction'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PageHeading } from '@/components/ui/PageHeading'

export const metadata: Metadata = { title: 'Contato' }

export default function Page() {
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Contato' }]} />
            <PageHeading eyebrow="VAMOS CRIAR ALGO ESPECIAL?" title="Contato">
                Sua ideia pode ganhar um toque de carinho da Debinatos.
            </PageHeading>
            <section className="rounded-xl border border-line bg-cream p-6 md:p-10" aria-labelledby="pedidos-personalizados">
                <Gift className="mb-5 text-brand" size={30} aria-hidden="true" />
                <h2 id="pedidos-personalizados" className="mb-5">
                    Pedidos personalizados
                </h2>
                <p className="mb-7 max-w-2xl text-xs text-muted md:text-[13px]">
                    Tem uma ideia especial? Conte para a gente! Criamos peças personalizadas para presentear e deixar seus momentos ainda mais especiais.
                    Escolha produtos no catálogo e adicione ao carrinho: a mensagem já incluirá sua seleção. Pelo WhatsApp, combinamos os detalhes, a entrega e
                    os prazos.
                </p>
                <div className="max-w-xl">
                    <ContactAction phone={process.env.WHATSAPP_PHONE?.trim()} showSelection />
                </div>
            </section>
        </div>
    )
}
