"use client";
import { Check, Sparkles, X } from "lucide-react";
import { useStore } from "@/lib/state/store-context";

export function Toast() {
  const { toast, dismissToast } = useStore();
  return (
    toast && (
      <div
        className="group/toast fixed right-4 bottom-4 left-4 z-100 flex items-center gap-3 rounded-xl bg-ink py-3.5 pr-3 pl-4 text-[11px] leading-relaxed text-[#fff8ed] shadow-xl md:right-6 md:bottom-6 md:left-auto md:max-w-[430px] md:text-xs [animation:toast-in_0.2s_ease] data-[error=true]:bg-[#8e2018]"
        data-error={toast.error}
        role={toast.error ? "alert" : "status"}
      >
        {toast.error ? (
          <Sparkles
            className="text-gold group-data-[error=true]/toast:text-white"
            size={20}
          />
        ) : (
          <Check
            className="text-gold group-data-[error=true]/toast:text-white"
            size={20}
          />
        )}
        <span>{toast.message}</span>
        <button
          className="relative inline-flex shrink-0 items-center justify-center rounded-full transition ml-auto size-7 hover:bg-white/10"
          aria-label="Fechar aviso"
          onClick={dismissToast}
        >
          <X size={16} />
        </button>
      </div>
    )
  );
}
