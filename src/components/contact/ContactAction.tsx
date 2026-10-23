'use client'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useId } from 'react'

import { getContactSelection, whatsappUrl } from '@/lib/domain/contact'
import { useStore } from '@/lib/state/store-context'

export function ContactAction({ phone, showSelection = false }: { phone?: string; showSelection?: boolean }) {
    const { state, ready } = useStore()
    const { rows, invalid, message } = getContactSelection(state.products, state.cart)
    const href = ready ? whatsappUrl(phone, message) : undefined
    const statusId = useId()
    const className =
        'inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug  font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 disabled:opacity-60'
    return (
        <div>
            {ready && showSelection && rows.length > 0 && (
                <div className="mb-6 text-xs text-muted">
                    <p className="mb-3">Sua mensagem incluirá os produtos do carrinho:</p>
                    <ul className="list-disc space-y-2 pl-5">
                        {rows.map(({ item, product }) => (
                            <li key={item.productId}>
                                {product?.name ?? 'Produto removido'} — {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {href ? (
                <a className={className} href={href} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={18} aria-hidden="true" /> Consultar pelo WhatsApp
                    <span className="sr-only"> (abre em nova aba)</span>
                </a>
            ) : (
                <button className={className} type="button" disabled aria-describedby={statusId}>
                    <MessageCircle size={18} aria-hidden="true" /> Consultar pelo WhatsApp
                </button>
            )}
            <div id={statusId} className="mt-3 text-xs text-muted" aria-live="polite">
                {!ready ? (
                    <p>Carregando sua seleção…</p>
                ) : (
                    <>
                        {!whatsappUrl(phone, 'contato') && <p>WhatsApp em breve</p>}
                        {invalid && (
                            <p>
                                Há produtos fora do catálogo ou quantidades inválidas.{' '}
                                <Link className="text-brand underline underline-offset-4" href="/carrinho">
                                    Revise o carrinho
                                </Link>{' '}
                                antes de entrar em contato.
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
