import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/** Waitlist persistence backends — OFF by default (noop); no Listmonk without keys. */
export type WaitlistBackend = "noop" | "file" | "postgres";

export interface WaitlistSignupInput {
  email: string;
  source?: string;
  role?: "pm" | "tech_lead" | "head_of_delivery";
}

export interface WaitlistSignupResult {
  ok: true;
  backend: WaitlistBackend;
  duplicate: boolean;
}

interface StoredSignup extends WaitlistSignupInput {
  createdAt: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FILE_PATH = ".data/waitlist-signups.json";

/** Resolve backend from env; postgres requires DATABASE_URL (not wired until Human scope). */
export function getWaitlistBackend(): WaitlistBackend {
  const raw = process.env.WAITLIST_BACKEND?.trim().toLowerCase();
  if (raw === "file") return "file";
  if (raw === "postgres" && process.env.DATABASE_URL?.trim()) return "postgres";
  return "noop";
}

export function normalizeWaitlistEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

function resolveFilePath(): string {
  const configured = process.env.WAITLIST_FILE_PATH?.trim();
  return configured || DEFAULT_FILE_PATH;
}

async function readSignups(filePath: string): Promise<StoredSignup[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is StoredSignup =>
        !!row &&
        typeof row === "object" &&
        typeof (row as StoredSignup).email === "string",
    );
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw err;
  }
}

async function writeSignups(filePath: string, rows: StoredSignup[]): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
}

/** Persist signup — noop accepts without storage; file appends local JSON. */
export async function saveWaitlistSignup(
  input: WaitlistSignupInput,
): Promise<WaitlistSignupResult> {
  const backend = getWaitlistBackend();
  const email = normalizeWaitlistEmail(input.email);
  if (!email) {
    throw new Error("invalid_email");
  }

  const record: StoredSignup = {
    email,
    source: input.source?.slice(0, 64) || "waitlist",
    role: input.role,
    createdAt: new Date().toISOString(),
  };

  if (backend === "noop") {
    return { ok: true, backend, duplicate: false };
  }

  if (backend === "postgres") {
    // Drizzle insert when DATABASE_URL + migrations are Human-approved (T-044 follow-up).
    throw new Error("postgres_not_ready");
  }

  const filePath = resolveFilePath();
  const existing = await readSignups(filePath);
  const duplicate = existing.some((row) => row.email === email);
  if (!duplicate) {
    existing.push(record);
    await writeSignups(filePath, existing);
  }

  return { ok: true, backend, duplicate };
}
