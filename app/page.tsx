import { Button } from "@/components/ui/button";

/** Home page — Muster Next.js + shadcn scaffold demo */
export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24">
      <main className="flex max-w-lg flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Agent</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Next.js 16, Tailwind CSS v4, and shadcn/ui are ready. Pick a Muster
          subagent and a task from <code className="text-sm">orchestration-queue.md</code>.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button render={<a href="https://nextjs.org/docs" target="_blank" rel="noreferrer" />}>
            Next.js docs
          </Button>
          <Button variant="outline" render={<a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" />}>
            shadcn/ui
          </Button>
        </div>
      </main>
    </div>
  );
}
