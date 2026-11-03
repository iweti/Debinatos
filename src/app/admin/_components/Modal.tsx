'use client'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

import { useModal } from '../_lib/use-modal'

export function Modal({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
    const { dialog } = useModal()
    return (
        <dialog
            ref={dialog}
            className="m-auto max-h-[92dvh] w-[min(650px,calc(100%-24px))] overflow-y-auto rounded-xl border border-line bg-white p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-xs"
            onCancel={(event) => {
                event.preventDefault()
                close()
            }}
            aria-labelledby="modal-title"
        >
            <div className="sticky top-0 z-2 flex items-center justify-between gap-4 border-b border-line bg-[#fffaf4] px-5 py-4 md:px-6">
                <h2 className="text-xl md:text-2xl" id="modal-title">
                    {title}
                </h2>
                <button
                    type="button"
                    className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full transition hover:bg-cream"
                    onClick={close}
                    aria-label="Fechar janela"
                >
                    <X size={20} />
                </button>
            </div>
            {children}
        </dialog>
    )
}
