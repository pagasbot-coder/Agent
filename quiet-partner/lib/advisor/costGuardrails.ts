/**
 * API cost guardrails — in-memory per ADR-001 (Phase 4).
 * Rate limit per IP; optional daily/weekly token budgets (instance-level until auth in Phase 5).
 * Redis / Upstash hot path: `redisRateLimit.ts` (T-036); falls back here when REDIS_URL empty.
 */

import {
  buildRateLimitKey,
  checkRedisRateLimit,
  getRedisRateLimitSnapshot,
  type RateLimitScope,
} from "./redisRateLimit";

const MS_PER_DAY = 86_400_000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

export function getRateLimitMax(): number {
  const raw = Number(process.env.ADVISOR_RATE_LIMIT_MAX ?? 20);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 20;
}

export function getRateLimitWindowMs(): number {
  const raw = Number(process.env.ADVISOR_RATE_LIMIT_WINDOW_MS ?? 900_000);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 900_000;
}

function getTokenBudget(envKey: string): number | null {
  const raw = Number(process.env[envKey] ?? 0);
  if (!Number.isFinite(raw) || raw <= 0) return null;
  return Math.floor(raw);
}

export function getDailyTokenBudget(): number | null {
  return getTokenBudget("ADVISOR_DAILY_TOKEN_BUDGET");
}

export function getWeeklyTokenBudget(): number | null {
  return getTokenBudget("ADVISOR_WEEKLY_TOKEN_BUDGET");
}

const ipHits = new Map<string, { count: number; resetAt: number }>();

let dailyTokensUsed = 0;
let dailyResetAt = Date.now() + MS_PER_DAY;
let weeklyTokensUsed = 0;
let weeklyResetAt = Date.now() + MS_PER_WEEK;

function rollTokenWindows(now: number): void {
  if (now >= dailyResetAt) {
    dailyTokensUsed = 0;
    dailyResetAt = now + MS_PER_DAY;
  }
  if (now >= weeklyResetAt) {
    weeklyTokensUsed = 0;
    weeklyResetAt = now + MS_PER_WEEK;
  }
}

/** Client IP for BFF rate limiting (Vercel x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return "local";
}

export type RateLimitCheck = {
  allowed: boolean;
  retryAfterSec: number;
};

function resolveRateLimitScope(
  ip: string,
  userId?: string | null,
): {
  scope: RateLimitScope;
  id: string;
} {
  if (userId?.trim()) return { scope: "user", id: userId.trim() };
  return { scope: "ip", id: ipOrUnknown(ip) };
}

function ipOrUnknown(ip: string): string {
  return ip.trim() || "unknown";
}

/**
 * Redis when configured; otherwise in-memory. Prefer this in async BFF routes.
 * Pass userId when AUTH is on for per-user budget (Phase 5).
 */
export async function checkRateLimitAsync(
  ip: string,
  userId?: string | null,
): Promise<RateLimitCheck> {
  const { scope, id } = resolveRateLimitScope(ip, userId);
  const redisResult = await checkRedisRateLimit(buildRateLimitKey(scope, id));
  if (redisResult !== null) return redisResult;

  const allowed = checkRateLimit(ip);
  return {
    allowed,
    retryAfterSec: getRateLimitRetryAfterSec(ip),
  };
}

/** Returns false when IP exceeded ADVISOR_RATE_LIMIT_* (ADR-001: 20 / 15 min default). */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = getRateLimitWindowMs();
  const max = getRateLimitMax();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

/** Seconds until rate-limit window resets for IP (429 Retry-After). */
export function getRateLimitRetryAfterSec(ip: string): number {
  const entry = ipHits.get(ip);
  if (!entry) return getRateLimitWindowMs() / 1000;
  const remainingMs = Math.max(0, entry.resetAt - Date.now());
  return Math.ceil(remainingMs / 1000);
}

/** True when daily or weekly token budget would be exceeded by another LLM call. */
export function isTokenBudgetExceeded(): boolean {
  const now = Date.now();
  rollTokenWindows(now);

  const daily = getDailyTokenBudget();
  if (daily !== null && dailyTokensUsed >= daily) return true;

  const weekly = getWeeklyTokenBudget();
  if (weekly !== null && weeklyTokensUsed >= weekly) return true;

  return false;
}

/** Record provider token usage after a successful LLM response (no PII). */
export function recordTokenUsage(tokens: number): void {
  if (!Number.isFinite(tokens) || tokens <= 0) return;
  const now = Date.now();
  rollTokenWindows(now);
  dailyTokensUsed += tokens;
  weeklyTokensUsed += tokens;
}

export type CostGuardSnapshot = {
  rate_limit_max: number;
  rate_limit_window_ms: number;
  redis_rate_limit_enabled: boolean;
  redis_url_configured: boolean;
  redis_token_configured: boolean;
  daily_token_budget: number | null;
  daily_tokens_used: number;
  weekly_token_budget: number | null;
  weekly_tokens_used: number;
  budget_exceeded: boolean;
};

/** Aggregate counters for /api/health — no secrets, no IP data. */
export function getCostGuardSnapshot(): CostGuardSnapshot {
  const now = Date.now();
  rollTokenWindows(now);

  return {
    rate_limit_max: getRateLimitMax(),
    rate_limit_window_ms: getRateLimitWindowMs(),
    ...getRedisRateLimitSnapshot(),
    daily_token_budget: getDailyTokenBudget(),
    daily_tokens_used: dailyTokensUsed,
    weekly_token_budget: getWeeklyTokenBudget(),
    weekly_tokens_used: weeklyTokensUsed,
    budget_exceeded: isTokenBudgetExceeded(),
  };
}
