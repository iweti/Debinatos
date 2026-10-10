"use client";
import { useEffect } from "react";
import { Flower2 } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="mx-auto flex min-h-96 max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <Flower2 className="mb-6 size-10 text-brand" />
      <h1 className="mb-4 font-serif text-3xl">Um pequeno imprevisto.</h1>
      <p className="mb-6 text-sm text-muted">
        Não foi possível abrir este cantinho. Tente novamente; seus dados locais
        continuam no navegador.
      </p>
      <button className="button" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}
