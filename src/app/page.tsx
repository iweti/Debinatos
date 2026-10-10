import { Suspense } from "react";
import { Home } from "./_components/Home";
import Loading from "@/components/ui/Loading";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Home />
    </Suspense>
  );
}
