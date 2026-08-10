import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";

import { getDb, isDatabaseConfigured } from "@/lib/db";
import { stagesProjects } from "@/lib/db/schema";
import {
  MTS_EXOLVE_SEED,
  MTS_PROJECT_ID,
  MTS_PROJECT_NAME,
  MTS_STAGE_ID,
} from "@/lib/stages/mtsExolveSeed";
import {
  normalizeRegisterCache,
  type RegisterRow,
} from "@/lib/stages/registers";

/** Ключ канонического проекта МТС в хранилище. */
export { MTS_PROJECT_ID };

export type StagesBackend = "file" | "postgres" | "noop";

export type StagesCache = Record<string, RegisterRow[]>;

export type StagesProjectRecord = {
  id: string;
  name: string;
  stageId: number;
  cache: StagesCache;
  updatedAt: string;
};

export type StagesProjectSummary = {
  id: string;
  name: string;
  stageId: number;
  updatedAt: string;
};

const DEFAULT_FILE_PATH = ".data/stages-projects.json";

type FileStore = Record<string, Omit<StagesProjectRecord, "cache"> & { cache: StagesCache }>;

/** file по умолчанию — локально не теряем реестры; postgres при флаге + DATABASE_URL. */
export function getStagesBackend(): StagesBackend {
  const raw = process.env.STAGES_BACKEND?.trim().toLowerCase();
  if (raw === "noop") return "noop";
  if (raw === "postgres") {
    return isDatabaseConfigured() ? "postgres" : "file";
  }
  if (raw === "file") return "file";
  return "file";
}

function resolveFilePath(): string {
  return process.env.STAGES_FILE_PATH?.trim() || DEFAULT_FILE_PATH;
}

function mtsSeedRecord(): StagesProjectRecord {
  const now = new Date().toISOString();
  return {
    id: MTS_PROJECT_ID,
    name: MTS_PROJECT_NAME,
    stageId: MTS_STAGE_ID,
    cache: normalizeRegisterCache({ ...MTS_EXOLVE_SEED }),
    updatedAt: now,
  };
}

/** Доливает пустые реестры из сида (напр. новый «Артефакты»), не затирая правки. */
export function mergeMissingMtsRegisters(
  record: StagesProjectRecord,
): { record: StagesProjectRecord; changed: boolean } {
  if (record.id !== MTS_PROJECT_ID) {
    return { record, changed: false };
  }
  const seedCache = normalizeRegisterCache({ ...MTS_EXOLVE_SEED });
  const cache: StagesCache = { ...record.cache };
  let changed = false;
  for (const [key, rows] of Object.entries(seedCache)) {
    const existing = cache[key];
    const empty =
      !existing ||
      existing.length === 0 ||
      !existing.some((row) =>
        Object.values(row).some((v) => String(v ?? "").trim().length > 0),
      );
    if (empty && rows.length > 0) {
      cache[key] = rows;
      changed = true;
    }
  }
  if (!changed) return { record, changed: false };
  return {
    record: {
      ...record,
      cache,
      updatedAt: new Date().toISOString(),
    },
    changed: true,
  };
}

async function readFileStore(): Promise<FileStore> {
  const filePath = resolveFilePath();
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as FileStore;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return {};
    throw err;
  }
}

async function writeFileStore(store: FileStore): Promise<void> {
  const filePath = resolveFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function rowToRecord(row: {
  id: string;
  name: string;
  stageId: number;
  cacheJson: string;
  updatedAt: Date;
}): StagesProjectRecord {
  let cache: StagesCache = {};
  try {
    cache = normalizeRegisterCache(JSON.parse(row.cacheJson) as StagesCache);
  } catch {
    cache = {};
  }
  return {
    id: row.id,
    name: row.name,
    stageId: row.stageId,
    cache,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Гарантирует, что сид МТС есть в хранилище (file/postgres). */
export async function ensureMtsProjectSeeded(): Promise<StagesProjectRecord> {
  const existing = await getStagesProject(MTS_PROJECT_ID);
  if (existing) {
    const { record, changed } = mergeMissingMtsRegisters(existing);
    if (changed) return saveStagesProject(record);
    return existing;
  }
  const seed = mtsSeedRecord();
  return saveStagesProject(seed);
}

export async function listStagesProjects(): Promise<{
  backend: StagesBackend;
  projects: StagesProjectSummary[];
}> {
  const backend = getStagesBackend();
  if (backend === "noop") {
    const seed = mtsSeedRecord();
    return {
      backend,
      projects: [
        {
          id: seed.id,
          name: seed.name,
          stageId: seed.stageId,
          updatedAt: seed.updatedAt,
        },
      ],
    };
  }

  await ensureMtsProjectSeeded();

  if (backend === "postgres") {
    const db = getDb();
    if (!db) {
      return { backend: "file", projects: [] };
    }
    const rows = await db.select().from(stagesProjects);
    return {
      backend,
      projects: rows.map((r) => ({
        id: r.id,
        name: r.name,
        stageId: r.stageId,
        updatedAt: r.updatedAt.toISOString(),
      })),
    };
  }

  const store = await readFileStore();
  return {
    backend,
    projects: Object.values(store).map((p) => ({
      id: p.id,
      name: p.name,
      stageId: p.stageId,
      updatedAt: p.updatedAt,
    })),
  };
}

export async function getStagesProject(
  id: string,
): Promise<StagesProjectRecord | null> {
  const backend = getStagesBackend();
  if (backend === "noop") {
    if (id === MTS_PROJECT_ID) return mtsSeedRecord();
    return null;
  }

  if (backend === "postgres") {
    const db = getDb();
    if (!db) return null;
    const rows = await db
      .select()
      .from(stagesProjects)
      .where(eq(stagesProjects.id, id))
      .limit(1);
    const row = rows[0];
    return row ? rowToRecord(row) : null;
  }

  const store = await readFileStore();
  const hit = store[id];
  if (!hit) return null;
  return {
    ...hit,
    cache: normalizeRegisterCache(hit.cache ?? {}),
  };
}

export async function saveStagesProject(
  input: Omit<StagesProjectRecord, "updatedAt"> & { updatedAt?: string },
): Promise<StagesProjectRecord> {
  const backend = getStagesBackend();
  const updatedAt = input.updatedAt ?? new Date().toISOString();
  const record: StagesProjectRecord = {
    id: input.id.trim() || MTS_PROJECT_ID,
    name: input.name.trim() || "Без названия",
    stageId: Math.min(6, Math.max(0, Number(input.stageId) || 0)),
    cache: normalizeRegisterCache(input.cache ?? {}),
    updatedAt,
  };

  if (backend === "noop") {
    return record;
  }

  if (backend === "postgres") {
    const db = getDb();
    if (!db) {
      throw new Error("database_unavailable");
    }
    const cacheJson = JSON.stringify(record.cache);
    const updated = new Date(record.updatedAt);
    await db
      .insert(stagesProjects)
      .values({
        id: record.id,
        name: record.name,
        stageId: record.stageId,
        cacheJson,
        updatedAt: updated,
      })
      .onConflictDoUpdate({
        target: stagesProjects.id,
        set: {
          name: record.name,
          stageId: record.stageId,
          cacheJson,
          updatedAt: updated,
        },
      });
    return record;
  }

  const store = await readFileStore();
  store[record.id] = record;
  await writeFileStore(store);
  return record;
}

/** Сброс МТС к каноническому сиду (кнопка «перезагрузить шаблон»). */
export async function resetMtsProjectFromSeed(): Promise<StagesProjectRecord> {
  return saveStagesProject(mtsSeedRecord());
}
