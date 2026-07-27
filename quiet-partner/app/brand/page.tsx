import type { Metadata } from "next";

import { BrandPageClient } from "@/components/brand/BrandPageClient";

export const metadata: Metadata = {
  title: "Пульт бренда — Тихий напарник",
  description:
    "Этапы 0–6 линейки, реестры и шпаргалки. Данные в браузере, экспорт Markdown.",
  robots: { index: false, follow: false },
};

export default function BrandPage() {
  return <BrandPageClient />;
}
