import { afterEach, describe, expect, it, vi } from "vitest";
import { initialState } from "../data/demo";
import { addToCart, setQuantity } from "../domain/cart";
import { createOrder } from "../domain/checkout";
import { validAddress } from "../domain/address";
import { readState, writeState, STORAGE_KEY } from "../storage/local-state";
import { SHIPPING_FEE } from "../constants/store";

afterEach(() => vi.unstubAllGlobals());

describe("Carrinho e estoque", () => {
  it("acumula quantidades sem ultrapassar estoque e permite remover um item", () => {
    const original = initialState();
    const first = original.products[0];
    const state = addToCart(addToCart(original, first.id, 2), first.id, 1);
    expect(state.cart).toEqual([{ productId: first.id, quantity: 3 }]);
    expect(original.cart).toEqual([]);
    expect(() => addToCart(state, first.id, first.stock)).toThrow("estoque");
    expect(() => setQuantity(state, first.id, 1.5)).toThrow("Quantidade");
    expect(setQuantity(state, first.id, 0).cart).toEqual([]);
  });
  it("bloqueia produto esgotado, desativado e quantidade negativa", () => {
    const state = initialState();
    expect(() => addToCart(state, "axolote-acrilico")).toThrow("estoque");
    state.products[0].active = false;
    expect(() => addToCart(state, state.products[0].id)).toThrow("disponível");
    expect(() => addToCart(state, state.products[1].id, -1)).toThrow("estoque");
  });
});

describe("Pedido de demonstração", () => {
  function cart() {
    return {
      ...addToCart(initialState(), "terrario-ursos-polares", 2),
      loggedIn: true,
    };
  }
  it.each(["shipping", "pickup"] as const)(
    "calcula totais para %s, baixa estoque e esvazia o carrinho",
    (delivery) => {
      const state = cart();
      const before = state.products[0].stock;
      const result = createOrder(state, {
        delivery,
        payment: "pix",
        address: state.profile.address,
      });
      expect(result.order.subtotal).toBe(7980);
      expect(result.order.shipping).toBe(
        delivery === "shipping" ? SHIPPING_FEE : 0,
      );
      expect(result.order.total).toBe(7980 + result.order.shipping);
      expect(result.order.status).toBe("received");
      expect(result.order.address).toEqual(
        delivery === "shipping" ? state.profile.address : null,
      );
      expect(result.state.products[0].stock).toBe(before - 2);
      expect(result.state.cart).toEqual([]);
      expect(result.state.orders).toHaveLength(state.orders.length + 1);
      expect(state.products[0].stock).toBe(before);
    },
  );
  it("preserva o histórico após edição de produto e endereço e gera números únicos", () => {
    const state = cart();
    const { order } = createOrder(state, {
      delivery: "shipping",
      payment: "card",
      address: state.profile.address,
    });
    state.products[0].price = 99900;
    state.products[0].name = "Produto alterado";
    state.profile.address.street = "Outro endereço";
    expect(order.items[0].name).toBe("Terrário Ursos Polares");
    expect(order.items[0].price).toBe(3990);
    expect(order.address?.street).not.toBe("Outro endereço");
    expect(
      createOrder(state, {
        delivery: "pickup",
        payment: "pix",
        address: state.profile.address,
      }).order.id,
    ).not.toBe(order.id);
  });
  it("exige perfil, carrinho e endereço válido para envio", () => {
    const state = cart();
    const input = {
      delivery: "shipping" as const,
      payment: "pix" as const,
      address: { ...state.profile.address, cep: "123" },
    };
    expect(() => createOrder({ ...state, loggedIn: false }, input)).toThrow(
      "perfil",
    );
    expect(() => createOrder({ ...state, cart: [] }, input)).toThrow("vazio");
    expect(() => createOrder(state, input)).toThrow("endereço");
    expect(validAddress(state.profile.address)).toBe(true);
    expect(() =>
      createOrder(state, { ...input, delivery: "pickup" }),
    ).not.toThrow();
  });
  it("revalida o estoque e a disponibilidade no momento da compra", () => {
    const state = cart();
    state.products[0].stock = 1;
    const input = {
      delivery: "pickup" as const,
      payment: "pix" as const,
      address: state.profile.address,
    };
    expect(() => createOrder(state, input)).toThrow("estoque");
    state.products[0].stock = 5;
    state.products[0].active = false;
    expect(() => createOrder(state, input)).toThrow("indisponível");
    expect(state.orders).toHaveLength(1);
  });
});

describe("Persistência local", () => {
  it("recupera favoritos, carrinho, perfil e pedidos salvos", () => {
    const state = {
      ...addToCart(initialState(), "terrario-ursos-polares"),
      favorites: ["terrario-ursos-polares"],
      loggedIn: true,
    };
    const data = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => data.get(key),
      setItem: (key: string, value: string) => data.set(key, value),
    });
    writeState(state);
    expect(readState().state).toEqual(state);
    expect(data.has(STORAGE_KEY)).toBe(true);
  });
  it.each([
    "{invalid",
    JSON.stringify({ ...initialState(), products: [null] }),
    JSON.stringify({ ...initialState(), orders: [{ createdAt: "invalid" }] }),
  ])("recupera o catálogo inicial se os dados estiverem corrompidos", (raw) => {
    vi.stubGlobal("localStorage", { getItem: () => raw });
    expect(readState().warning).toBeTruthy();
    expect(readState().state.products).toHaveLength(12);
  });
  it("explica falha ao gravar e não altera os dados anteriores", () => {
    const state = initialState();
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    });
    expect(() => writeState(state)).toThrow("Não foi possível salvar");
    expect(state).toEqual(initialState());
  });
});
