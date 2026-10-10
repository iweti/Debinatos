"use client";
import { Check } from "lucide-react";
import { STATUS_LABELS } from "@/lib/constants/store";
import type { Order } from "@/lib/types/store";

export function StatusBadge({ order }: { order: Order }) {
  return (
    <span className={`status-badge status-${order.status}`}>
      {order.status === "completed" && <Check size={12} />}
      {STATUS_LABELS[order.status]}
    </span>
  );
}
