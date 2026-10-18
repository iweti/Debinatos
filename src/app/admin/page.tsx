import { Suspense } from "react";
import Loading from "@/components/ui/Loading";
import { Admin } from "./_components/Admin";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Painel administrativo" };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Admin />
    </Suspense>
  );
}
