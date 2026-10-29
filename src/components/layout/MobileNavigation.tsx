'use client'

import { Grid2X2, Heart, House, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useStore } from '@/lib/state/store-context'

export function MobileNavigation() {
    const pathname = usePathname()
    const { state } = useStore()
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0)
    const items = [
        { href: '/', label: 'Home', icon: House },
        { href: '/catalogo', label: 'Catálogo', icon: Grid2X2 },
        { href: '/contato', label: 'Contato' },
        { href: '/carrinho', label: 'Carrinho', icon: ShoppingBag, count: cartCount },
        { href: '/favoritos', label: 'Favoritos', icon: Heart, count: state.favorites.length },
    ]

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[#fffdf9] pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_#350f0c0a] lg:hidden"
            aria-label="Navegação no celular"
        >
            <div className="mx-auto grid h-19 max-w-lg grid-cols-5 items-start px-2">
                {items.map(({ href, label, icon: Icon, count }) => {
                    const active = pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
                    const contact = href === '/contato'

                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? 'page' : undefined}
                            aria-label={count ? `${label}, ${count} ${count === 1 ? 'item' : 'itens'}` : label}
                            className={
                                contact
                                    ? 'group -mt-6 flex min-h-24 flex-col items-center gap-1 rounded-2xl text-[11px] font-semibold text-brand'
                                    : 'flex min-h-17 flex-col items-center justify-center gap-1.5 rounded-xl px-1 text-[10px] font-medium text-muted transition-colors hover:bg-cream hover:text-brand aria-[current=page]:bg-cream/70 aria-[current=page]:text-brand'
                            }
                        >
                            {contact ? (
                                <span className="grid size-17 place-items-center rounded-full border-4 border-[#fffdf9] bg-brand shadow-[0_4px_14px_#b42a1d35] ring-1 ring-brand/15 transition-transform group-hover:-translate-y-1 group-aria-[current=page]:ring-2 group-aria-[current=page]:ring-brand">
                                    <span className="size-full overflow-hidden rounded-full">
                                        <img
                                            src="/images/marca-debinatos.jpg"
                                            alt=""
                                            width={1280}
                                            height={1280}
                                            className="size-full origin-[50%_35%] scale-125 object-cover"
                                        />
                                    </span>
                                </span>
                            ) : (
                                <span className="relative inline-flex">
                                    {Icon && <Icon size={22} aria-hidden="true" />}
                                    {!!count && (
                                        <span
                                            className="absolute -top-1.5 -right-2.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-semibold text-white"
                                            aria-hidden="true"
                                        >
                                            {count > 99 ? '99+' : count}
                                        </span>
                                    )}
                                </span>
                            )}
                            <span>{label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
