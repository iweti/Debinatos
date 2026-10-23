import { MessageCircle } from 'lucide-react'

import { whatsappUrl } from '@/lib/domain/contact'

export function ContactAction({ phone }: { phone?: string }) {
    const href = whatsappUrl(phone, 'Olá! Gostaria de entrar em contato e fazer um pedido.')
    const className =
        'inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 disabled:opacity-60'

    return (
        <div>
            {href ? (
                <a className={className} href={href} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} aria-hidden="true" /> Fale com a gente pelo WhatsApp
                    <span className="sr-only"> (abre em nova aba)</span>
                </a>
            ) : (
                <>
                    <button className={className} type="button" disabled aria-describedby="contact-unavailable">
                        <MessageCircle size={18} aria-hidden="true" /> Fale com a gente pelo WhatsApp
                    </button>
                    <p id="contact-unavailable" className="mt-3 text-xs text-muted">
                        WhatsApp em breve
                    </p>
                </>
            )}
        </div>
    )
}
