import type { Metadata } from "next";

import { AnalyticsProvider } from "@/components/AnalyticsProvider";

import "./globals.css";

const SITE_URL = "https://quiet-partner.vercel.app";

export const metadata: Metadata = {
  title: "Тихий напарник · Quiet Partner",
  description:
    "PMBOK 7 co-pilot: DomainRadar, health commentary, onboarding — без иллюзии сертификации.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Тихий напарник · Quiet Partner",
    description:
      "PMBOK 7 co-pilot: DomainRadar, HealthCommentary, onboarding — co-pilot для PM, не сертификация PMI.",
    url: SITE_URL,
    siteName: "Тихий напарник",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Тихий напарник · Quiet Partner",
    description:
      "PMBOK 7 co-pilot для PM агентств: 8 доменов, AI questions-first, без экзамена PMP.",
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
