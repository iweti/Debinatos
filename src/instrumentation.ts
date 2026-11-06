export async function register() {
    // Exceções de plataforma: o Next define esses marcadores; não são secrets.
    if (process.env.NEXT_PHASE === 'phase-production-build') return

    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { registerNode } = await import('./lib/server/instrumentation')
        registerNode()
    }
}
