'use client'
import { Check, Heart, LogOut, MapPin, Pencil } from 'lucide-react'
import Link from 'next/link'

import { LoginPanel } from '@/components/account/LoginPanel'
import { AddressFields } from '@/components/forms/AddressFields'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Loading } from '@/components/ui/Loading'
import { PageHeading } from '@/components/ui/PageHeading'

import { useProfile } from '../_lib/use-profile'

export function Profile() {
    const { ready, loggedIn, profile, favoriteCount, name, setName, address, setAddress, error, save, logout } = useProfile()
    if (!ready) return <Loading />
    if (!loggedIn)
        return (
            <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
                <LoginPanel next="/perfil" />
            </div>
        )
    return (
        <div className="mx-auto min-h-125 w-[calc(100%-36px)] max-w-310 pt-5 pb-12 md:w-[calc(100%-64px)] md:pt-7 md:pb-20 xl:w-[calc(100%-96px)]">
            <Breadcrumb items={[{ label: 'Meu perfil' }]} />
            <PageHeading eyebrow="BEM-VINDA AO SEU CANTINHO" title={`Olá, ${profile.name.split(' ')[0]}!`}>
                Seus dados e seus pequenos encantos favoritos.
            </PageHeading>
            <div className="grid items-start gap-7 md:grid-cols-[210px_minmax(0,1fr)] md:gap-9">
                <aside className="h-fit overflow-hidden rounded-xl border border-line">
                    <div className="border-b border-line bg-[#fcf8f1] px-4 py-6 text-center">
                        <span className="grid place-items-center rounded-full bg-[#f5e5d5] font-serif text-xl text-brand mx-auto mb-3 size-14 text-[27px]">
                            {profile.name.slice(0, 1).toUpperCase()}
                        </span>
                        <strong className="block text-[13px]">{profile.name}</strong>
                        <small className="mt-2 block text-[10px] text-muted">Meu perfil</small>
                    </div>
                    <nav className="grid grid-cols-2 gap-1 p-3 md:block" aria-label="Navegação do perfil">
                        <Link className="mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-3.5 text-left text-[11px] hover:bg-surface" href="/favoritos">
                            <Heart size={19} /> Itens salvos{' '}
                            <span className="ml-auto grid size-5 place-items-center rounded-full bg-[#f7ede3] text-[9px]">{favoriteCount}</span>
                        </Link>
                        <span className="mb-1 flex w-full items-center gap-2 rounded-md bg-[#f9eee3] px-2.5 py-3.5 text-[11px] text-brand" aria-current="page">
                            <Pencil size={18} /> Meus dados
                        </span>
                        <button
                            className="mb-1 flex w-full items-center gap-2 rounded-md px-2.5 py-3.5 text-left text-[11px] hover:bg-surface"
                            onClick={logout}
                        >
                            <LogOut size={18} /> Sair do perfil
                        </button>
                    </nav>
                </aside>
                <section>
                    <form className="rounded-xl border border-line bg-white p-5 md:p-7" onSubmit={save}>
                        <h2 className="mb-6 flex items-center gap-3 text-[22px]">Meus dados</h2>
                        <p className="mb-6 text-[11px] text-muted">Suas informações ficam salvas neste navegador.</p>
                        <label className="block max-w-112.5 text-[11px]" htmlFor="profile-name">
                            Nome
                            <input className="text-xs" id="profile-name" value={name} required maxLength={80} onChange={(e) => setName(e.target.value)} />
                        </label>
                        <h3 className="mt-7 mb-6 flex items-center gap-2 text-sm">
                            <MapPin size={18} /> Endereço de entrega
                        </h3>
                        <AddressFields address={address} setAddress={setAddress} prefix="profile" />
                        {error && (
                            <p className="my-3 text-[11px] leading-relaxed text-[#b32217]" role="alert">
                                {error}
                            </p>
                        )}
                        <button
                            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border border-brand bg-brand px-5 py-3 text-xs/snug  font-semibold text-white transition hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark disabled:translate-y-0 mt-6"
                            type="submit"
                        >
                            Salvar meus dados <Check size={16} />
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}
