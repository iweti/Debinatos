import { initialState } from "../data/demo";
import type { DemoState } from "../types/store";

// Match the previous demo records conservatively so admin-created products stay intact.
const legacyProducts: Array<[string, string, string, number]> = [
  ["argolas-aurora", "Argolas Aurora", "earrings", 3990],
  ["colar-essencia", "Colar Essência", "necklace", 5490],
  ["anel-luar", "Anel Luar", "rings", 2990],
  ["pulseira-elo", "Pulseira Elo", "bracelet", 4490],
  ["mix-encanto", "Mix Encanto", "jewels", 6990],
  ["vaso-sereno", "Vaso Sereno", "vase", 5990],
  ["vaso-aconchego", "Vaso Aconchego", "ceramic", 7490],
  ["porta-joias-afeto", "Porta-joias Afeto", "accessories", 4990],
  ["colar-perola", "Colar Pérola", "pearl", 6490],
  ["vela-bons-momentos", "Vela Bons Momentos", "home", 3590],
  ["kit-dourado", "Kit Dourado", "jewels", 8990],
  ["anel-flor", "Anel Flor", "rings", 3490],
];

export function migrateCatalog(state: DemoState): DemoState {
  const catalog = initialState().products;
  const changedIds = new Map<string, string>();
  const products = state.products.map((product) => {
    const index = legacyProducts.findIndex(
      ([id, name, photo, price]) =>
        product.id === id &&
        product.name === name &&
        product.price === price &&
        product.images.length === 1 &&
        product.images[0] === `/images/${photo}.jpg`,
    );
    if (index === -1) return product;
    const replacement = catalog[index];
    if (state.products.some((p) => p.id === replacement.id)) return product;
    changedIds.set(product.id, replacement.id);
    return {
      ...replacement,
      stock: product.stock,
      active: product.active,
      featured: product.featured,
    };
  });
  if (!changedIds.size) return state;
  return {
    ...state,
    products,
    favorites: state.favorites.map((id) => changedIds.get(id) ?? id),
    cart: state.cart.map((item) => ({
      ...item,
      productId: changedIds.get(item.productId) ?? item.productId,
    })),
  };
}
