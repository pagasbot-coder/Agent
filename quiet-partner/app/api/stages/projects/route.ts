import { NextResponse } from "next/server";

import {
  ensureMtsProjectSeeded,
  getStagesBackend,
  listStagesProjects,
} from "@/lib/stages/stagesStore";

/** Список проектов Пульта + гарантия сида МТС. */
export async function GET() {
  try {
    await ensureMtsProjectSeeded();
    const { backend, projects } = await listStagesProjects();
    return NextResponse.json({
      ok: true,
      backend,
      projects,
      defaultProjectId: "mts-exolve",
    });
  } catch (err) {
    console.error("[stages/projects]", err);
    return NextResponse.json(
      { ok: false, error: "list_failed" },
      { status: 500 },
    );
  }
}

export async function HEAD() {
  return NextResponse.json({
    ok: true,
    backend: getStagesBackend(),
  });
}
