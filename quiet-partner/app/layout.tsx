import type { Metadata } from "next";

import { AnalyticsProvider } from "@/components/AnalyticsProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Тихий напарник · Quiet Partner",
  description:
    "PMBOK 7 co-pilot: DomainRadar, health commentary, onboarding — без иллюзии сертификации.",
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
