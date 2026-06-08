import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";

/** Acquisition landing — indexable (T-053). */
export const metadata: Metadata = {
  title: "Ранний доступ — Тихий напарник",
  description:
    "Один экран — здоровье проекта. Запишитесь в waitlist для PM в агентстве и SMB.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ранний доступ — Тихий напарник",
    description:
      "Один экран — здоровье проекта. DomainRadar по 8 доменам PMBOK 7, AI co-pilot без экзамена PMP.",
    url: `${SITE_URL}/waitlist`,
    siteName: "Тихий напарник",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ранний доступ — Тихий напарник",
    description:
      "DomainRadar + HealthCommentary для PM. Не сертификация PMI — инструмент для реальных проектов.",
  },
};

/** Server layout — OG/meta for shareable waitlist URL. */
export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
