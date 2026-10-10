import { Suspense } from "react";
import { ProductPage } from "./_components/ProductPage";
import Loading from "@/components/ui/Loading";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Um pequeno encanto" };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductPage />
    </Suspense>
  );
}
