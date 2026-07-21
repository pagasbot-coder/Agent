"use client";

import dynamic from "next/dynamic";

const StagesShell = dynamic(
  () =>
    import("@/components/stages/StagesShell").then((m) => m.StagesShell),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-full items-center justify-center p-8 text-sm text-muted-foreground">
        Загрузка пульта…
      </div>
    ),
  },
);

/** Client wrapper — localStorage hydrate without SSR mismatch. */
export function StagesPageClient() {
  return <StagesShell />;
}
