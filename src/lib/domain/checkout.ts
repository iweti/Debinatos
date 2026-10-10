import type { CheckoutInput, DemoState, Order } from "../types/store";
import { SHIPPING_FEE } from "../constants/store";
import { validAddress } from "./address";

export function createOrder(
  state: DemoState,
  input: CheckoutInput,
): { state: DemoState; order: Order } {
  if (!state.loggedIn)
    throw new Error("Entre no perfil de demonstração para continuar.");
  if (!state.cart.length) throw new Error("Seu carrinho está vazio.");
  if (!state.profile.name.trim())
    throw new Error("Informe seu nome no perfil.");
  if (input.delivery === "shipping" && !validAddress(input.address))
    throw new Error("Preencha o endereço e um CEP com 8 dígitos.");
  const items = state.cart.map((item) => {
    const product = state.products.find(
      (p) => p.id === item.productId && p.active,
    );
    if (
      !product ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      product.stock < item.quantity
    )
      throw new Error(
        "Um produto está indisponível ou tem estoque insuficiente. Revise o carrinho.",
      );
    return {
      productId: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: item.quantity,
    };
  });
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const shipping = input.delivery === "shipping" ? SHIPPING_FEE : 0;
  const order: Order = {
    id: `DEB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    items,
    subtotal,
    shipping,
    total: subtotal + shipping,
    delivery: input.delivery,
    payment: input.payment,
    status: "received",
    customerName: state.profile.name,
    address: input.delivery === "shipping" ? { ...input.address } : null,
  };
  return {
    order,
    state: {
      ...state,
      cart: [],
      orders: [order, ...state.orders],
      products: state.products.map((p) => ({
        ...p,
        stock:
          p.stock -
          (state.cart.find((i) => i.productId === p.id)?.quantity ?? 0),
      })),
    },
  };
}
