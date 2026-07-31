import { NextResponse } from "next/server";
import { z } from "zod";
import { scanUrl } from "@/lib/url-scanner";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const requestSchema = z.object({ url: z.string().trim().min(1).max(2048) });

export async function POST(request: Request) {
  // No login required — this tool works like password-checker/phishing-simulator
  // (free to try, saving progress needs an account). Anonymous callers still
  // get IP-based rate limiting since the optional Safe Browsing call has a quota.
  const ip = await getClientIp();
  if (!rateLimit(`urlscan:${ip}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
  }

  const result = scanUrl(parsed.data.url);
  if (!result) {
    return NextResponse.json({ error: "Format URL tidak bisa dibaca." }, { status: 400 });
  }

  const safeBrowsingKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  let safeBrowsingVerdict: "terdeteksi" | "bersih" | null = null;

  if (safeBrowsingKey) {
    try {
      const sbRes = await fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${safeBrowsingKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client: { clientId: "cyberaman", clientVersion: "1.0.0" },
            threatInfo: {
              threatTypes: [
                "MALWARE",
                "SOCIAL_ENGINEERING",
                "UNWANTED_SOFTWARE",
                "POTENTIALLY_HARMFUL_APPLICATION",
              ],
              platformTypes: ["ANY_PLATFORM"],
              threatEntryTypes: ["URL"],
              threatEntries: [{ url: result.url }],
            },
          }),
        },
      );

      if (sbRes.ok) {
        const data = await sbRes.json();
        if (Array.isArray(data.matches) && data.matches.length > 0) {
          safeBrowsingVerdict = "terdeteksi";
          result.riskScore = 100;
          result.tier = "berisiko";
          result.findings.unshift({
            label: "Terdaftar di database Google Safe Browsing sebagai ancaman aktif!",
            severity: "danger",
          });
        } else {
          safeBrowsingVerdict = "bersih";
        }
      }
    } catch (error) {
      // An unreachable Safe Browsing API shouldn't break the heuristic result.
      console.warn("Safe Browsing check failed:", error);
    }
  }

  return NextResponse.json({
    ...result,
    safeBrowsingVerdict,
    safeBrowsingConfigured: Boolean(safeBrowsingKey),
  });
}
