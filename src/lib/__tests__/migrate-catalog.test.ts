import { describe, expect, it, vi, afterEach } from "vitest";
import { initialState } from "../data/demo";
import { migrateCatalog } from "../storage/migrate-catalog";
import { readState } from "../storage/local-state";

afterEach(() => vi.unstubAllGlobals());

function legacyState() {
  const state = initialState();
  state.products[0] = {
    ...state.products[0],
    id: "argolas-aurora",
    name: "Argolas Aurora",
    price: 3990,
    images: ["/images/earrings.jpg"],
    stock: 3,
    active: false,
  };
  state.favorites = ["argolas-aurora"];
  state.cart = [{ productId: "argolas-aurora", quantity: 2 }];
  return state;
}

describe("Atualização do catálogo salvo", () => {
  it("carrega as fotos novas preservando favoritos, carrinho, estoque e histórico", () => {
    const state = legacyState();
    vi.stubGlobal("localStorage", { getItem: () => JSON.stringify(state) });
    const loaded = readState().state;
    expect(loaded.products[0]).toMatchObject({
      id: "terrario-ursos-polares",
      images: ["/images/products/terrario-ursos-polares.webp"],
      stock: 3,
      active: false,
    });
    expect(loaded.favorites).toEqual(["terrario-ursos-polares"]);
    expect(loaded.cart).toEqual([
      { productId: "terrario-ursos-polares", quantity: 2 },
    ]);
    expect(loaded.profile).toEqual(state.profile);
    expect(loaded.orders).toEqual(state.orders);
    expect(state.favorites).toEqual(["argolas-aurora"]);
    expect(migrateCatalog(loaded)).toBe(loaded);
  });

  it("preserva produtos com nome, preço ou fotos personalizados no painel", () => {
    for (const change of [
      { name: "Minha peça" },
      { price: 9990 },
      { images: ["idb:foto-personalizada"] },
    ]) {
      const state = legacyState();
      Object.assign(state.products[0], change);
      expect(migrateCatalog(state)).toBe(state);
    }
  });

  it("não duplica um produto do novo catálogo que já existe", () => {
    const state = legacyState();
    state.products.push(initialState().products[0]);
    expect(migrateCatalog(state)).toBe(state);
  });
});
