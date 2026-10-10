import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import { Checkout } from "./_components/Checkout";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Compra simulada" };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Checkout />
    </Suspense>
  );
}
