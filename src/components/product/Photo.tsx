"use client";
import type { ImgHTMLAttributes } from "react";
import { usePhoto } from "@/lib/hooks/use-photo";

export function Photo({
  source,
  alt,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { source: string }) {
  const { src } = usePhoto(source);
  return (
    <img
      {...props}
      src={src}
      alt={alt}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/images/placeholder.svg";
      }}
    />
  );
}
