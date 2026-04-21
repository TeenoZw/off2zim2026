/**
 * Lightweight in-memory sliding-window rate limiter.
 *
 * Works per Node.js process. For multi-instance deployments replace the
 * `store` Map with a shared Redis store (e.g. Upstash). The public API
 * is intentionally identical to keep migration trivial.
 *
 * Usage:
 *   const result = await rateLimit(request, "login", { limit: 10, windowSec: 60 });
 *   if (!result.success) return rateLimitResponse(result);
 */

import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/http";

interface WindowEntry {
  count: number;
  resetAt: number; // epoch ms
}

// Single in-process store — intentionally module-scoped singleton
const store = new Map<string, WindowEntry>();

// Prune expired entries every 5 minutes to avoid unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  /** Requests remaining in the current window */
  remaining: number;
  /** Epoch ms when the window resets */
  resetAt: number;
  /** Retry-After seconds (only set when success === false) */
  retryAfter?: number;
}

export interface RateLimitOptions {
  /** Max requests allowed per window */
  limit: number;
  /** Window size in seconds */
  windowSec: number;
}

/**
 * Check and increment the rate-limit counter for the given key.
 * The key is `${prefix}:${ip}` so different routes share no state.
 */
export function rateLimit(
  request: NextRequest,
  prefix: string,
  opts: RateLimitOptions
): RateLimitResult {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const key = `${prefix}:${ip}`;
  const now = Date.now();
  const windowMs = opts.windowSec * 1000;

  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    // Start fresh window
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: opts.limit - 1, resetAt };
  }

  existing.count += 1;

  if (existing.count > opts.limit) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfter,
    };
  }

  return {
    success: true,
    remaining: opts.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Return a 429 response with standard headers. */
export function rateLimitResponse(result: RateLimitResult): NextResponse {
  const retryAfter = result.retryAfter ?? 60;
  const res = apiError("Too many requests. Please slow down.", 429);
  // apiError returns NextResponse — we need to clone with headers
  return new NextResponse(res.body, {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(retryAfter),
      "X-RateLimit-Limit": "0",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    },
  });
}

// ─── Pre-configured limiters ───────────────────────────────────────────────────

/** Auth endpoints: 10 attempts per minute */
export const AUTH_LIMIT: RateLimitOptions = { limit: 10, windowSec: 60 };

/** Payment/checkout endpoints: 20 per minute */
export const PAYMENT_LIMIT: RateLimitOptions = { limit: 20, windowSec: 60 };

/** Rating submission: 5 per minute (prevents spam) */
export const RATING_LIMIT: RateLimitOptions = { limit: 5, windowSec: 60 };

/** General API: 120 per minute */
export const GENERAL_LIMIT: RateLimitOptions = { limit: 120, windowSec: 60 };
