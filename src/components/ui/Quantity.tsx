"use client";
import { Minus, Plus } from "lucide-react";

export function Quantity({
  value,
  max,
  onChange,
  name,
  compact = false,
}: {
  value: number;
  max: number;
  onChange: (quantity: number) => void;
  name: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`inline-flex shrink-0 items-center overflow-hidden rounded-lg border border-[#dfd4c8] bg-white ${compact ? "h-8 md:h-10" : "h-11"}`}
    >
      <button
        className="grid h-full w-7 place-items-center p-0 hover:bg-cream md:w-8"
        type="button"
        aria-label={`Diminuir quantidade de ${name}`}
        disabled={value <= 1}
        onClick={() => onChange(Math.min(value - 1, Math.max(1, max)))}
      >
        <Minus size={14} />
      </button>
      <span className="min-w-6 text-center text-xs" aria-live="polite">
        {value}
      </span>
      <button
        className="grid h-full w-7 place-items-center p-0 hover:bg-cream md:w-8"
        type="button"
        aria-label={`Aumentar quantidade de ${name}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
