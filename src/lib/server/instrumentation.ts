import 'server-only'

import { EnvironmentError } from '@/lib/config/env.mjs'
import { getServerEnv } from '@/lib/server/env'

export function registerNode() {
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
