import { NextResponse } from "next/server";

import { resetMtsProjectFromSeed } from "@/lib/stages/stagesStore";

/** Сбросить Проект МТС к каноническому шаблону из кода. */
export async function POST() {
  try {
    const project = await resetMtsProjectFromSeed();
    return NextResponse.json({ ok: true, project });
  } catch (err) {
    console.error("[stages/mts/reset]", err);
    return NextResponse.json(
      { ok: false, error: "reset_failed" },
      { status: 500 },
    );
  }
}
