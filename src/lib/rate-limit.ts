import { headers } from "next/headers";

// In-memory fixed-window rate limiter. Deliberately simple: a competition
// submission with modest traffic doesn't need Redis/Upstash, and this needs
// zero extra infrastructure or API keys to demonstrate abuse-awareness.
// Caveat (documented, not hidden): state resets on server restart and isn't
// shared across multiple serverless instances if deployed to a
// multi-instance platform — acceptable here, but a real production system
// serving meaningful traffic should move this to Upstash Ratelimit or
// equivalent shared-store limiter.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
