"use client";

import dynamic from "next/dynamic";

const BrandShell = dynamic(
  () => import("@/components/brand/BrandShell").then((m) => m.BrandShell),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-full items-center justify-center p-8 text-sm text-muted-foreground">
        Загрузка пульта бренда…
      </div>
    ),
  },
);

/** Client wrapper — localStorage hydrate without SSR mismatch. */
export function BrandPageClient() {
  return <BrandShell />;
}
