"use client";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useModal } from "../_lib/use-modal";

export function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  const { dialog } = useModal();
  return (
    <dialog
      ref={dialog}
      className="modal"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      aria-labelledby="modal-title"
    >
      <div className="modal-header">
        <h2 id="modal-title">{title}</h2>
        <button
          type="button"
          className="icon-button"
          onClick={close}
          aria-label="Fechar janela"
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
