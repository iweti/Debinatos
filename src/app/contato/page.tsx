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
            <section
                className="grid items-center gap-8 rounded-xl border border-line bg-cream p-6 md:grid-cols-[1.2fr_.8fr] md:gap-10 md:p-10 lg:gap-16 lg:p-12"
                aria-labelledby="fale-com-a-gente"
            >
                <div>
                    <Gift className="mb-5 text-brand" size={30} aria-hidden="true" />
                    <h2 id="fale-com-a-gente" className="mb-4">
                        Fale com a gente
                    </h2>
                    <div className="max-w-lg space-y-3 text-justify text-xs/relaxed text-muted md:text-[13px]">
                        <p>Tem uma dúvida ou uma ideia de presente? Vamos conversar e criar algo especial para você.</p>
                        <p>Pelo WhatsApp, você pode fazer seu pedido e combinar os detalhes, a entrega e os prazos diretamente com a Debinatos.</p>
                    </div>
                    <div className="mt-7 max-w-md">
                        <ContactAction phone={process.env.WHATSAPP_PHONE?.trim()} />
                    </div>
                </div>
                <img
                    className="mx-auto aspect-4/3 w-full max-w-64 object-cover md:max-w-96"
                    src="/images/logo-debinatos-transparente.png"
                    alt="Debinatos — detalhes que encantam"
                    width={340}
                    height={120}
                />
            </section>
        </div>
    )
}
