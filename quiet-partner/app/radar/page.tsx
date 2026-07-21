import type { Metadata } from "next";

import { DashboardShell } from "@/components/DashboardShell";

export const metadata: Metadata = {
  title: "Радар — Тихий напарник",
  description:
    "DomainRadar по 8 доменам PMBOK 7 и AI-комментарий. Co-pilot, не сертификация.",
  robots: { index: false, follow: false },
};

export default function RadarPage() {
  return <DashboardShell />;
}
