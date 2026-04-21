import { rateLimit } from "@/lib/rate-limit";
import type { NextRequest } from "next/server";

function makeRequest(ip = "1.2.3.4"): NextRequest {
  return {
    headers: {
      get: (key: string) => {
        if (key === "x-forwarded-for") return ip;
        return null;
      },
    },
  } as unknown as NextRequest;
}

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    const req = makeRequest("10.0.0.1");
    const result = rateLimit(req, "test-allow", { limit: 5, windowSec: 60 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("tracks remaining count correctly across multiple calls", () => {
    const req = makeRequest("10.0.0.2");
    const prefix = "test-track";
    const opts = { limit: 3, windowSec: 60 };

    const r1 = rateLimit(req, prefix, opts);
    const r2 = rateLimit(req, prefix, opts);
    const r3 = rateLimit(req, prefix, opts);

    expect(r1.remaining).toBe(2);
    expect(r2.remaining).toBe(1);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests after limit is exceeded", () => {
    const req = makeRequest("10.0.0.3");
    const prefix = "test-block";
    const opts = { limit: 2, windowSec: 60 };

    rateLimit(req, prefix, opts);
    rateLimit(req, prefix, opts);
    const blocked = rateLimit(req, prefix, opts);

    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it("isolates rate limits by prefix", () => {
    const req = makeRequest("10.0.0.4");
    const opts = { limit: 1, windowSec: 60 };

    const r1 = rateLimit(req, "prefix-a", opts);
    const r2 = rateLimit(req, "prefix-b", opts);

    // Both prefixes should allow the first request independently
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
  });

  it("isolates rate limits by IP", () => {
    const opts = { limit: 1, windowSec: 60 };
    const prefix = "test-ip-isolate";

    const r1 = rateLimit(makeRequest("10.1.1.1"), prefix, opts);
    const r2 = rateLimit(makeRequest("10.1.1.2"), prefix, opts);

    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
  });
});
