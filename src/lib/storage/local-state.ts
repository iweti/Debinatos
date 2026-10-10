import { initialState } from "../data/demo";
import type { DemoState } from "../types/store";
import { isDemoState } from "./validate-state";

export const STORAGE_KEY = "debinatos-demo-v1";

export function readState(): { state: DemoState; warning?: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { state: initialState() };
    const state = JSON.parse(raw) as DemoState;
    if (!isDemoState(state)) throw new Error("Formato inválido");
    return { state };
  } catch {
    return {
      state: initialState(),
      warning:
        "Não foi possível recuperar os dados locais. Você pode explorar a demonstração ou restaurá-la no painel.",
    };
  }
}

export function writeState(state: DemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    throw new Error(
      "Não foi possível salvar no navegador. Verifique o espaço disponível e permita o armazenamento local.",
    );
  }
}
