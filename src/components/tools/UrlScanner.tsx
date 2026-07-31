"use client";

import { useState, useTransition } from "react";
import { Link2, Search, CheckCircle2, AlertTriangle, ShieldX, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { recordUrlScan } from "@/lib/actions/gamification";

type UrlScanFinding = { label: string; severity: "info" | "warning" | "danger" };
type UrlScanResult = {
  url: string;
  domain: string;
  riskScore: number;
  tier: "aman" | "waspada" | "berisiko";
  findings: UrlScanFinding[];
  safeBrowsingVerdict: "terdeteksi" | "bersih" | null;
  safeBrowsingConfigured: boolean;
};

const TIER_STYLES: Record<UrlScanResult["tier"], { label: string; color: string; icon: typeof CheckCircle2 }> = {
  aman: { label: "Tampak Aman", color: "text-emerald-400", icon: CheckCircle2 },
  waspada: { label: "Perlu Kehati-hatian", color: "text-yellow-400", icon: AlertTriangle },
  berisiko: { label: "Berisiko Tinggi", color: "text-red-400", icon: ShieldX },
};

const SEVERITY_COLOR: Record<UrlScanFinding["severity"], string> = {
  info: "text-slate-400",
  warning: "text-yellow-400",
  danger: "text-red-400",
};

export function UrlScanner({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<UrlScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleScan() {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);
    try {
      const res = await fetch("/api/url-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Terjadi kesalahan.");
      setResult(data as UrlScanResult);

      if (isLoggedIn) {
        startTransition(async () => {
          await recordUrlScan(data.domain, data.tier);
          setSaved(true);
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  const tierInfo = result ? TIER_STYLES[result.tier] : null;
  const TierIcon = tierInfo?.icon ?? CheckCircle2;

  return (
    <div className="space-y-6">
      <Card>
        <label htmlFor="url-input" className="mb-1.5 block text-sm font-medium text-slate-300">
          Tempel URL yang mau dicek
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
              placeholder="https://contoh-link-mencurigakan.com/verifikasi"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
            />
          </div>
          <button
            onClick={handleScan}
            disabled={loading || !url.trim()}
            className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Cek
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Menganalisis pola domain (typosquatting, punycode, TLD mencurigakan, dll)
          {result?.safeBrowsingConfigured ? " + verifikasi Google Safe Browsing." : "."}
        </p>
      </Card>

      {error && <Card className="border-red-500/30 bg-red-500/5 text-sm text-red-300">{error}</Card>}

      {result && tierInfo && (
        <Card>
          <div className="flex items-center gap-2">
            <TierIcon className={`h-6 w-6 ${tierInfo.color}`} aria-hidden />
            <div>
              <p className={`font-semibold ${tierInfo.color}`}>{tierInfo.label}</p>
              <p className="text-xs text-slate-400">
                {result.domain} · skor risiko {result.riskScore}/100
              </p>
            </div>
          </div>

          {result.safeBrowsingVerdict === "terdeteksi" && (
            <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-sm text-red-300">
              ⚠ Terdaftar di database Google Safe Browsing sebagai ancaman aktif.
            </div>
          )}
          {result.safeBrowsingVerdict === "bersih" && (
            <div className="mt-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-sm text-emerald-300">
              ✓ Tidak terdaftar di database ancaman Google Safe Browsing.
            </div>
          )}

          <ul className="mt-4 space-y-1.5 text-sm">
            {result.findings.map((f) => (
              <li key={f.label} className={SEVERITY_COLOR[f.severity]}>
                • {f.label}
              </li>
            ))}
          </ul>

          <div className="mt-4 border-t border-slate-800 pt-3">
            {isLoggedIn ? (
              saved && (
                <p className="text-xs text-emerald-400">
                  {isPending ? "Menyimpan..." : "Hasil tersimpan ke profilmu."}
                </p>
              )
            ) : (
              <p className="text-xs text-slate-400">
                <a href="/login" className="font-medium text-emerald-400 hover:underline">
                  Masuk
                </a>{" "}
                untuk menyimpan progres dan dapat poin.
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
