import { initialState } from '../data/demo'
import type { DemoState } from '../types/store'
import { migrateInterest } from './migrate-interest'
import { isDemoState, isLegacyState } from './validate-state'

export const STORAGE_KEY = 'debinatos-demo-v2'
export const LEGACY_STORAGE_KEY = 'debinatos-demo-v1'

export function readState(): { state: DemoState; warning?: string } {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw !== null) {
            const state: unknown = JSON.parse(raw)
            if (!isDemoState(state)) throw new Error('Formato inválido')
            return { state }
        }
        const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
        if (legacyRaw === null) return { state: initialState() }
        const legacy: unknown = JSON.parse(legacyRaw)
        if (!isLegacyState(legacy)) throw new Error('Formato antigo inválido')
        const state = migrateInterest(legacy)
        if (!isDemoState(state)) throw new Error('Migração inválida')
        try {
            writeState(state)
            return { state }
        } catch {
            return { state, warning: 'Seus dados foram recuperados, mas não foi possível salvar a atualização neste navegador.' }
        }
    } catch {
        return {
            state: initialState(),
            warning: 'Não foi possível recuperar os dados locais. Você pode continuar navegando ou restaurar os dados no painel.',
        }
    }
}

export function writeState(state: DemoState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
        throw new Error('Não foi possível salvar no navegador. Verifique o espaço disponível e permita o armazenamento local.')
    }
}
