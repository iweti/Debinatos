import type { DemoState } from "@/lib/types/store";

export function getStats(state: DemoState) {
  return {
    activeProducts: state.products.filter((p) => p.active).length,
    totalOrders: state.orders.length,
    pendingOrders: state.orders.filter((o) => o.status !== "completed").length,
    revenue: state.orders.reduce((sum, o) => sum + o.total, 0),
    lowStock: state.products.filter((p) => p.active && p.stock <= 3).length,
  };
}
