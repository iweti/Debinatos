"use client";
import { Minus, Plus } from "lucide-react";

export function Quantity({
  value,
  max,
  onChange,
  name,
}: {
  value: number;
  max: number;
  onChange: (quantity: number) => void;
  name: string;
}) {
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label={`Diminuir quantidade de ${name}`}
        disabled={value <= 1}
        onClick={() => onChange(Math.min(value - 1, Math.max(1, max)))}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
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
