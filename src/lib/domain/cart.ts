import type { DemoState } from "../types/store";

export function addToCart(
  state: DemoState,
  productId: string,
  quantity = 1,
): DemoState {
  const product = state.products.find((p) => p.id === productId && p.active);
  if (!product) throw new Error("Este produto não está mais disponível.");
  const existing =
    state.cart.find((i) => i.productId === productId)?.quantity ?? 0;
  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    existing + quantity > product.stock
  )
    throw new Error("A quantidade ultrapassa o estoque disponível.");
  return {
    ...state,
    cart: existing
      ? state.cart.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      : [...state.cart, { productId, quantity }],
  };
}

export function setQuantity(
  state: DemoState,
  productId: string,
  quantity: number,
): DemoState {
  if (!Number.isInteger(quantity) || quantity < 0)
    throw new Error("Quantidade inválida.");
  if (quantity === 0)
    return {
      ...state,
      cart: state.cart.filter((i) => i.productId !== productId),
    };
  const product = state.products.find((p) => p.id === productId && p.active);
  if (!product || quantity > product.stock)
    throw new Error("A quantidade ultrapassa o estoque disponível.");
  return {
    ...state,
    cart: state.cart.map((i) =>
      i.productId === productId ? { ...i, quantity } : i,
    ),
  };
}
