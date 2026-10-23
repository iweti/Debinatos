'use client'

import { LogIn } from 'lucide-react'
import { useActionState } from 'react'

import { login } from '../../_lib/actions'

export function LoginForm({ serviceError }: { serviceError: boolean }) {
    const [state, action, pending] = useActionState(login, {})
    return (
        <div className="mx-auto flex min-h-125 max-w-md items-center px-5 py-14">
            <form action={action} className="w-full rounded-xl border border-line bg-white p-6 md:p-8">
                <p className="mb-3 text-[10px] font-semibold tracking-widest text-brand uppercase">Área administrativa</p>
                <h1 className="mb-3 text-3xl">Entrar no painel</h1>
                <p className="mb-7 text-xs/relaxed  text-muted">Use seu e-mail e senha para cuidar da loja.</p>
                <label className="mb-5 block text-xs" htmlFor="admin-email">
                    E-mail
                    <input id="admin-email" name="email" type="email" autoComplete="username" maxLength={254} required disabled={pending} />
                </label>
                <label className="mb-5 block text-xs" htmlFor="admin-password">
                    Senha
                    <input id="admin-password" name="password" type="password" autoComplete="current-password" required disabled={pending} />
                </label>
                {(state.error || serviceError) && (
                    <p className="mb-5 text-xs/relaxed  text-brand" role="alert">
                        {state.error || 'Não foi possível verificar sua sessão. Tente entrar novamente.'}
                    </p>
                )}
                <button
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
                    type="submit"
                    disabled={pending}
                >
                    <LogIn size={17} /> {pending ? 'Entrando…' : 'Entrar'}
                </button>
            </form>
        </div>
    )
}
