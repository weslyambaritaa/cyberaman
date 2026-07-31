import { KNOWN_BRAND_DOMAINS, SUSPICIOUS_TLDS, URL_SHORTENERS } from "@/lib/content/known-brands";

export type UrlScanFinding = {
  label: string;
  severity: "info" | "warning" | "danger";
};

export type UrlScanResult = {
  url: string;
  domain: string;
  riskScore: number;
  tier: "aman" | "waspada" | "berisiko";
  findings: UrlScanFinding[];
};

const SUSPICIOUS_KEYWORDS = ["login", "verify", "verifikasi", "secure", "update", "confirm", "akun", "aktivasi"];
const IPV4_PATTERN = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function parseUrl(rawUrl: string): URL | null {
  const trimmed = rawUrl.trim();
  try {
    return new URL(trimmed);
  } catch {
    try {
      return new URL(`https://${trimmed}`);
    } catch {
      return null;
    }
  }
}

export function scanUrl(rawUrl: string): UrlScanResult | null {
  const parsed = parseUrl(rawUrl);
  if (!parsed) return null;

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const findings: UrlScanFinding[] = [];
  let riskScore = 0;

  if (parsed.protocol !== "https:") {
    riskScore += 15;
    findings.push({ label: "Tidak menggunakan HTTPS — koneksi tidak terenkripsi.", severity: "warning" });
  }

  if (IPV4_PATTERN.test(hostname) || hostname.includes(":")) {
    riskScore += 30;
    findings.push({
      label: "Alamat memakai IP langsung, bukan nama domain — sangat tidak lazim untuk situs resmi.",
      severity: "danger",
    });
  }

  if (hostname.includes("xn--")) {
    riskScore += 25;
    findings.push({
      label: "Domain memakai encoding Punycode — sering dipakai meniru huruf domain asli (homograph attack).",
      severity: "danger",
    });
  }

  if (URL_SHORTENERS.some((s) => hostname === s)) {
    riskScore += 10;
    findings.push({
      label: "Memakai jasa pemendek URL — tujuan asli link ini disembunyikan sampai diklik.",
      severity: "warning",
    });
  }

  if (SUSPICIOUS_TLDS.some((tld) => hostname.endsWith(`.${tld}`))) {
    riskScore += 10;
    findings.push({
      label: "Domain akhiran (.xyz/.top/dsb) yang sering disalahgunakan untuk phishing.",
      severity: "warning",
    });
  }

  const labelCount = hostname.split(".").length;
  if (labelCount > 4) {
    riskScore += 15;
    findings.push({
      label: "Subdomain berlapis-lapis — pola umum untuk menyamarkan domain asli di belakang teks yang meyakinkan.",
      severity: "warning",
    });
  }

  const hasSuspiciousKeyword = SUSPICIOUS_KEYWORDS.some((kw) => hostname.includes(kw));
  const mentionsBrandAsSubstring = KNOWN_BRAND_DOMAINS.some((brand) => {
    const brandName = brand.split(".")[0];
    return hostname.includes(brandName) && hostname !== brand;
  });
  if (hasSuspiciousKeyword && mentionsBrandAsSubstring) {
    riskScore += 20;
    findings.push({
      label: "Domain menggabungkan kata seperti 'verifikasi/login' dengan nama brand — pola umum phishing.",
      severity: "danger",
    });
  }

  let closestBrand: { brand: string; distance: number } | null = null;
  for (const brand of KNOWN_BRAND_DOMAINS) {
    if (hostname === brand) {
      closestBrand = null;
      break;
    }
    const distance = levenshtein(hostname, brand);
    if (distance <= 3 && (!closestBrand || distance < closestBrand.distance)) {
      closestBrand = { brand, distance };
    }
  }
  if (closestBrand) {
    riskScore += 35;
    findings.push({
      label: `Domain sangat mirip dengan "${closestBrand.brand}" tapi bukan domain resminya — indikasi kuat typosquatting.`,
      severity: "danger",
    });
  }

  riskScore = Math.min(100, riskScore);

  if (findings.length === 0) {
    findings.push({ label: "Tidak ditemukan pola mencurigakan dari pemeriksaan heuristik.", severity: "info" });
  }

  const tier: UrlScanResult["tier"] = riskScore <= 20 ? "aman" : riskScore <= 50 ? "waspada" : "berisiko";

  return { url: parsed.toString(), domain: hostname, riskScore, tier, findings };
}
