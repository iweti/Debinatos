import { afterEach, describe, expect, it, vi } from "vitest";
import { initialState } from "../data/demo";
import { readState } from "../storage/local-state";
import { migrateCopy } from "../storage/migrate-copy";

afterEach(() => vi.unstubAllGlobals());

describe("Atualização dos textos salvos", () => {
  it("atualiza o conteúdo antigo sem apagar favoritos, carrinho ou pedidos", () => {
    const state = initialState();
    const product = state.products[4];
    const description = product.description;
    product.description += " Valor fictício por unidade.";
    state.profile.address.street = "Rua das Flores (fictícia)";
    state.favorites = [product.id];
    state.cart = [{ productId: product.id, quantity: 2 }];
    state.orders[0].address = { ...state.profile.address };
    vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(state) });

    const loaded = readState().state;
    expect(loaded.products[4].description).toBe(description);
    expect(loaded.profile.address.street).toBe("Rua das Flores");
    expect(loaded.orders[0].address?.street).toBe("Rua das Flores");
    expect(loaded.favorites).toEqual(state.favorites);
    expect(loaded.cart).toEqual(state.cart);
    expect(loaded.products[4].stock).toBe(product.stock);
    expect(loaded.orders[0].total).toBe(state.orders[0].total);
    expect(state.profile.address.street).toBe("Rua das Flores (fictícia)");
    expect(migrateCopy(loaded)).toBe(loaded);
  });

  it("preserva descrições e endereços personalizados", () => {
    const state = initialState();
    state.products[4].description = "Minha descrição personalizada.";
    state.profile.address.street = "Rua das Palmeiras";
    expect(migrateCopy(state)).toBe(state);
  });
});
