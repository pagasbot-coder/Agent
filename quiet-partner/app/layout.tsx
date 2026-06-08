import type { Metadata } from "next";

import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { SITE_URL } from "@/lib/site";

import "./globals.css";

/** Dashboard `/` — noindex until public beta (T-053). */
export const metadata: Metadata = {
  title: "Тихий напарник — здоровье проекта за один экран",
  description:
    "Co-pilot для PM: DomainRadar по 8 доменам PMBOK 7, AI-комментарий без экзамена PMP.",
  metadataBase: new URL(SITE_URL),
  robots: { index: false, follow: false },
  openGraph: {
    title: "Тихий напарник — co-pilot для PM",
    description:
      "Co-pilot для PM: DomainRadar по 8 доменам PMBOK 7, AI-комментарий без экзамена PMP.",
    url: SITE_URL,
    siteName: "Тихий напарник",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Тихий напарник — co-pilot для PM",
    description:
      "DomainRadar + HealthCommentary для PM агентств. Не сертификация PMI — инструмент для реальных проектов.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
