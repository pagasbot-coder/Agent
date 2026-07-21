import { readFile } from "node:fs/promises";
import path from "node:path";

import Link from "next/link";
import { notFound } from "next/navigation";

import { mdLite } from "@/lib/mdLite";
import { CHEATSHEETS } from "@/lib/stages/registers";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CHEATSHEETS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const sheet = CHEATSHEETS.find((c) => c.slug === slug);
  return {
    title: sheet ? `${sheet.title} — Пульт этапов` : "Шпаргалка",
    robots: { index: false, follow: false },
  };
}

export default async function CheatSheetPage({ params }: Props) {
  const { slug } = await params;
  const sheet = CHEATSHEETS.find((c) => c.slug === slug);
  if (!sheet) notFound();

  const filePath = path.join(
    process.cwd(),
    "content",
    "projectm",
    sheet.file,
  );
  let raw: string;
  try {
    raw = await readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  const html = mdLite(raw);

  return (
    <div className="min-h-full bg-background">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b bg-card/90 px-4 py-3 backdrop-blur-sm sm:px-6">
        <Link
          href="/stages"
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Пульт
        </Link>
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          Режимы
        </Link>
        <span className="ml-auto text-xs text-muted-foreground">{sheet.file}</span>
      </div>
      <article
        className="mx-auto max-w-3xl px-4 py-8 sm:px-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
