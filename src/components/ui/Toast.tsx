'use client'
import { Check, Sparkles, X } from 'lucide-react'
import Link from 'next/link'

import { useStore } from '@/lib/state/store-context'

export function Toast() {
    const { toast, dismissToast } = useStore()
    return (
        toast && (
            <div
                className="group/toast fixed inset-x-4 bottom-[calc(7rem+env(safe-area-inset-bottom))] z-100 rounded-xl bg-ink py-3.5 pr-3 pl-4 text-[11px] leading-relaxed text-[#fff8ed] shadow-xl md:right-6 md:left-auto md:max-w-107.5 md:text-xs lg:bottom-6 animate-[toast-in_0.2s_ease] data-[error=true]:bg-[#8e2018]"
                data-error={toast.error}
            >
                <div className="flex items-center gap-3">
                    {toast.error ? (
                        <Sparkles className="text-gold group-data-[error=true]/toast:text-white" size={20} aria-hidden="true" />
                    ) : (
                        <Check className="text-gold group-data-[error=true]/toast:text-white" size={20} aria-hidden="true" />
                    )}
                    <span role={toast.error ? 'alert' : 'status'} aria-atomic="true">
                        {toast.message}
                    </span>
                    <button
                        type="button"
                        className="relative inline-flex shrink-0 items-center justify-center rounded-full transition ml-auto size-7 hover:bg-white/10"
                        aria-label="Fechar aviso"
                        onClick={dismissToast}
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>
                {toast.cartAdded && !toast.error && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            className="rounded-lg px-3 py-2.5 underline underline-offset-4 transition hover:bg-white/10"
                            onClick={dismissToast}
                        >
                            Continuar comprando
                        </button>
                        <Link
                            className="rounded-lg bg-[#fff8ed] px-3 py-2.5 font-semibold text-ink transition hover:bg-white"
                            href="/carrinho"
                            onClick={dismissToast}
                        >
                            Ver carrinho
                        </Link>
                    </div>
                )}
            </div>
        )
    )
}
