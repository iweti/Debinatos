export async function register() {
    // Exceções de plataforma: o Next define esses marcadores; não são secrets.
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_RUNTIME !== 'nodejs') return

    const { getServerEnv } = await import('./lib/server/env')
    const { EnvironmentError } = await import('./lib/config/env.mjs')
    try {
        getServerEnv()
    } catch (error) {
        if (!(error instanceof EnvironmentError)) throw error
        console.error(error.message)
        // Next 16 mantém o listener após rejeitar register(); encerre o boot inválido
        // para a plataforma detectar a falha, sem atender uma instância só com 500.
        process.exit(1)
    }
}
