import { Suspense } from "react";
import { About } from "./_components/About";
import Loading from "@/components/ui/Loading";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nossa história" };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <About />
    </Suspense>
  );
}
