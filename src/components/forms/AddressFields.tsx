"use client";
import type { Address } from "@/lib/types/store";

export function AddressFields({
  address,
  setAddress,
  prefix = "address",
}: {
  address: Address;
  setAddress: (address: Address) => void;
  prefix?: string;
}) {
  const change = (key: keyof Address, value: string) =>
    setAddress({
      ...address,
      [key]: key === "state" ? value.toUpperCase() : value,
    });
  return (
    <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 md:gap-5">
      {[
        {
          key: "cep",
          label: "CEP",
          placeholder: "01001-000",
          max: 9,
          half: true,
        },
        {
          key: "street",
          label: "Rua / Avenida",
          placeholder: "Rua das Flores",
          half: false,
        },
        { key: "number", label: "Número", placeholder: "123", half: true },
        {
          key: "complement",
          label: "Complemento (opcional)",
          placeholder: "Apto, bloco…",
          half: true,
        },
        { key: "district", label: "Bairro", placeholder: "Centro", half: true },
        { key: "city", label: "Cidade", placeholder: "São Paulo", half: true },
        { key: "state", label: "UF", placeholder: "SP", max: 2, half: true },
      ].map((field) => (
        <label
          key={field.key}
          className={field.half ? "" : "span-two"}
          htmlFor={`${prefix}-${field.key}`}
        >
          {field.label}
          <input
            id={`${prefix}-${field.key}`}
            required={field.key !== "complement"}
            maxLength={field.max}
            inputMode={field.key === "cep" ? "numeric" : "text"}
            pattern={
              field.key === "cep"
                ? "[0-9]{5}-?[0-9]{3}"
                : field.key === "state"
                  ? "[A-Za-z]{2}"
                  : undefined
            }
            placeholder={field.placeholder}
            value={address[field.key as keyof Address]}
            onChange={(e) => change(field.key as keyof Address, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
