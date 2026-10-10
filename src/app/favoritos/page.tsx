import { Suspense } from "react";
import { Favorites } from "./_components/Favorites";
import Loading from "@/components/ui/Loading";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Meus favoritos" };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Favorites />
    </Suspense>
  );
}
