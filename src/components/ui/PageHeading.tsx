"use client";
import type { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <span className="inline-flex items-center gap-2 text-[9px] leading-relaxed font-semibold tracking-[.18em] text-brand uppercase">
        {eyebrow}
      </span>
      <h1 className="my-3 md:text-[39px]">{title}</h1>
      {children && (
        <p className="text-xs text-muted md:text-[13px]">{children}</p>
      )}
    </div>
  );
}
