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
                Entre em contato com a Debinatos e faça seu pedido.
            </PageHeading>
            <section className="rounded-xl border border-line bg-cream p-6 md:p-10" aria-labelledby="fale-com-a-gente">
                <Gift className="mb-5 text-brand" size={30} aria-hidden="true" />
                <h2 id="fale-com-a-gente" className="mb-5">
                    Fale com a gente
                </h2>
                <p className="mb-7 max-w-2xl text-xs text-muted md:text-[13px]">
                    Este é o espaço para entrar em contato, tirar suas dúvidas e fazer seu pedido. Fale com a gente pelo WhatsApp para combinar os detalhes,
                    a entrega e os prazos.
                </p>
                <div className="max-w-xl">
                    <ContactAction phone={process.env.WHATSAPP_PHONE?.trim()} />
                </div>
            </section>
        </div>
    )
}
