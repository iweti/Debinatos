"use client";
import { Check, Sparkles, X } from "lucide-react";
import { useStore } from "@/lib/state/store-context";

export function Toast() {
  const { toast, dismissToast } = useStore();
  return (
    toast && (
      <div
        className={`toast ${toast.error ? "toast-error" : ""}`}
        role={toast.error ? "alert" : "status"}
      >
        {toast.error ? <Sparkles size={20} /> : <Check size={20} />}
        <span>{toast.message}</span>
        <button
          className="icon-button"
          aria-label="Fechar aviso"
          onClick={dismissToast}
        >
          <X size={16} />
        </button>
      </div>
    )
  );
}
