'use client'
import { useRouter } from 'next/navigation'

import { useStore } from '@/lib/state/store-context'

export function useDemoLogin(next: string) {
    const { update, ready } = useStore()
    const router = useRouter()
    function login() {
        if (update((s) => ({ ...s, loggedIn: true }), 'Bem-vinda ao seu cantinho!')) router.replace(next)
    }
    return { ready, login }
}
