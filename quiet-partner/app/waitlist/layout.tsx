import type { Metadata } from "next";

const SITE_URL = "https://quiet-partner.vercel.app";

export const metadata: Metadata = {
  title: "Ранний доступ · Тихий напарник",
  description:
    "PMBOK 7 co-pilot для PM в агентстве: DomainRadar, HealthCommentary, без экзамена PMP. Запишитесь в waitlist.",
  openGraph: {
    title: "Тихий напарник — здоровье проекта без экзамена PMP",
    description:
      "8 доменов PMBOK 7 на одном экране. AI co-pilot для PM агентств и SMB. Ранний доступ.",
    url: `${SITE_URL}/waitlist`,
    siteName: "Тихий напарник",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Тихий напарник — PMBOK 7 co-pilot",
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
