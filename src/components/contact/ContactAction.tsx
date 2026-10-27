import { MessageCircle } from 'lucide-react'

import { whatsappUrl } from '@/lib/domain/contact'

export function ContactAction({
    phone,
    label = 'Fale com a gente pelo WhatsApp',
    message = 'Olá! Gostaria de entrar em contato e fazer um pedido.',
}: {
    phone?: string
    label?: string
    message?: string
}) {
    const href = whatsappUrl(phone, message)
    const className =
        'inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 disabled:opacity-60'

    return (
        <div>
            {href ? (
                <a className={className} href={href} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} aria-hidden="true" /> {label}
                    <span className="sr-only"> (abre em nova aba)</span>
                </a>
            ) : (
                <>
                    <button className={className} type="button" disabled aria-describedby="contact-unavailable">
                        <MessageCircle size={18} aria-hidden="true" /> {label}
                    </button>
                    <p id="contact-unavailable" className="mt-3 text-xs text-muted">
                        WhatsApp em breve
                    </p>
                </>
            )}
        </div>
    )
}
