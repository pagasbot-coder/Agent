import { NextResponse } from "next/server";

import {
  ensureMtsProjectSeeded,
  getStagesProject,
  MTS_PROJECT_ID,
  saveStagesProject,
  type StagesCache,
} from "@/lib/stages/stagesStore";

type Ctx = { params: Promise<{ id: string }> };

/** Загрузить снимок проекта Пульта. */
export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const decoded = decodeURIComponent(id);
    if (decoded === MTS_PROJECT_ID) {
      await ensureMtsProjectSeeded();
    }
    const project = await getStagesProject(decoded);
    if (!project) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error("[stages/projects/id GET]", err);
    return NextResponse.json(
      { ok: false, error: "get_failed" },
      { status: 500 },
    );
  }
}

/** Сохранить / обновить снимок (автосохранение Пульта). */
export async function PUT(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as {
      name?: string;
      stageId?: number;
      cache?: StagesCache;
    };
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "invalid_body" },
        { status: 400 },
      );
    }
    const project = await saveStagesProject({
      id: decodeURIComponent(id),
      name: body.name ?? "Без названия",
      stageId: body.stageId ?? 0,
      cache: body.cache ?? {},
    });
    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error("[stages/projects/id PUT]", err);
    return NextResponse.json(
      { ok: false, error: "save_failed" },
      { status: 500 },
    );
  }
}
