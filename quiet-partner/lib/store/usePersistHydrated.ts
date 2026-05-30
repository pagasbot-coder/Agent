"use client";

import { useSyncExternalStore } from "react";

import { useProjectStore } from "@/lib/store/useProjectStore";

/** True after Zustand persist rehydrated from localStorage (avoids onboarding banner flash). */
export function usePersistHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => useProjectStore.persist.onFinishHydration(onStoreChange),
    () => useProjectStore.persist.hasHydrated(),
    () => false,
  );
}
