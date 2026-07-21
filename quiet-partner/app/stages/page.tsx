import type { Metadata } from "next";

import { StagesPageClient } from "@/components/stages/StagesPageClient";

export const metadata: Metadata = {
  title: "Пульт этапов — Тихий напарник",
  description:
    "Этапы 0–6, реестры проекта и шпаргалки. Данные в браузере, экспорт Markdown.",
  robots: { index: false, follow: false },
};

export default function StagesPage() {
  return <StagesPageClient />;
}
