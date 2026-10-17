"use client";
import { Check } from "lucide-react";
import { STATUS_LABELS } from "@/lib/constants/store";
import type { Order } from "@/lib/types/store";

export function StatusBadge({ order }: { order: Order }) {
  return (
    <span
      className="inline-flex items-center justify-center gap-1 rounded-full bg-[#fbecd9] px-2.5 py-1.5 text-[8px] leading-snug font-medium whitespace-nowrap text-[#805512] md:text-[9px] data-[status=completed]:bg-[#edf2e4] data-[status=completed]:text-[#436717] data-[status=sent]:bg-[#edf2ef] data-[status=sent]:text-[#3e6556] data-[status=ready]:bg-[#edf2ef] data-[status=ready]:text-[#3e6556] data-[status=preparing]:bg-[#f9e8df] data-[status=preparing]:text-[#9a4d28]"
      data-status={order.status}
    >
      {order.status === "completed" && <Check size={12} />}
      {STATUS_LABELS[order.status]}
    </span>
  );
}
