/**
 * Redis / Upstash rate limit scaffold (T-036).
 * REDIS_URL + REDIS_TOKEN empty by default → caller falls back to in-memory in costGuardrails.
 * When both are set → shared counters across serverless instances (ADR-001 limits).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitScope = "ip" | "user";

export type RateLimitCheck = {
  allowed: boolean;
  retryAfterSec: number;
};

function getRateLimitMax(): number {
  const raw = Number(process.env.ADVISOR_RATE_LIMIT_MAX ?? 20);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 20;
}

function getRateLimitWindowMs(): number {
  const raw = Number(process.env.ADVISOR_RATE_LIMIT_WINDOW_MS ?? 900_000);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 900_000;
}

export function getRedisUrl(): string | null {
  const url = process.env.REDIS_URL?.trim();
  return url || null;
}

export function getRedisToken(): string | null {
  const token = process.env.REDIS_TOKEN?.trim();
  return token || null;
}

/** True when Upstash REST URL + token are configured (Human activation). */
export function isRedisRateLimitEnabled(): boolean {
  return Boolean(getRedisUrl() && getRedisToken());
}

export function getRateLimitBackend(): "redis" | "memory" {
  return isRedisRateLimitEnabled() ? "redis" : "memory";
}

export function buildRateLimitKey(scope: RateLimitScope, id: string): string {
  const normalized = id.trim() || "unknown";
  return `${scope}:${normalized}`;
}

export function getRedisRateLimitSnapshot(): {
  redis_rate_limit_enabled: boolean;
  redis_url_configured: boolean;
  redis_token_configured: boolean;
} {
  return {
    redis_rate_limit_enabled: isRedisRateLimitEnabled(),
    redis_url_configured: Boolean(getRedisUrl()),
    redis_token_configured: Boolean(getRedisToken()),
  };
}

function formatWindowDuration(windowMs: number): `${number} ms` | `${number} s` | `${number} m` {
  if (windowMs % 60_000 === 0) return `${windowMs / 60_000} m`;
  if (windowMs % 1000 === 0) return `${windowMs / 1000} s`;
  return `${windowMs} ms`;
}

let ratelimitClient: Ratelimit | null | undefined;

function getRatelimitClient(): Ratelimit | null {
  if (ratelimitClient !== undefined) return ratelimitClient;

  const url = getRedisUrl();
  const token = getRedisToken();
  if (!url || !token) {
    ratelimitClient = null;
    return null;
  }

  const windowMs = getRateLimitWindowMs();
  ratelimitClient = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(getRateLimitMax(), formatWindowDuration(windowMs)),
    prefix: "qp:advisor:rl",
    analytics: false,
  });
  return ratelimitClient;
}

/** Returns null when Redis is disabled — costGuardrails uses in-memory fallback. */
export async function checkRedisRateLimit(key: string): Promise<RateLimitCheck | null> {
  const client = getRatelimitClient();
  if (!client) return null;

  const result = await client.limit(key);
  return {
    allowed: result.success,
    retryAfterSec: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
  };
}
