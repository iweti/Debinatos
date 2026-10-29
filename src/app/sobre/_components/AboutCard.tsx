import type { ReactNode } from 'react'

type AboutCardProps = {
    title: string
    children: ReactNode
}

export function AboutCard({ title, children }: AboutCardProps) {
    return (
        <section className="group flex flex-col items-center justify-center rounded-xl border border-line bg-[#fcf8f2] p-6 text-center transition duration-300 ease-out hover:-translate-y-2 hover:border-brand hover:bg-brand hover:text-white hover:shadow-xl hover:shadow-brand/25 motion-reduce:transform-none motion-reduce:transition-none md:p-8">
            <h2 className="mb-4 text-ink transition-colors duration-300 group-hover:text-white motion-reduce:transition-none">{title}</h2>
            {children}
        </section>
    )
}
