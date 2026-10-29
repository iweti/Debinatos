import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getAdmin } from '@/lib/server/auth'

import { LoginForm } from './_components/LoginForm'

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default async function Page() {
    let admin = null
    let serviceError = false
    try {
        admin = await getAdmin()
    } catch {
        serviceError = true
    }
    if (admin) redirect('/admin')
    return <LoginForm serviceError={serviceError} />
}
