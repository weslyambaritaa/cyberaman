import Link from "next/link";
import { KeyRound, Fish, Search, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { SecurityScore } from "@/lib/types";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreColor(score: number) {
  if (score >= 70) return "#34d399"; // emerald-400
  if (score >= 40) return "#facc15"; // yellow-400
  return "#f87171"; // red-400
}

const COMPONENTS = [
  { key: "password" as const, label: "Kata Sandi", icon: KeyRound, href: "/tools/password-checker" },
  { key: "phishing" as const, label: "Deteksi Phishing", icon: Fish, href: "/tools/phishing-simulator" },
  { key: "footprint" as const, label: "Jejak Digital", icon: Search, href: "/tools/footprint-checklist" },
];

export function SecurityScoreCard({ score }: { score: SecurityScore }) {
  const offset = CIRCUMFERENCE * (1 - score.overall / 100);
  const color = scoreColor(score.overall);

  return (
    <Card className="sm:col-span-2">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{score.overall}</span>
            <span className="text-xs text-slate-400">dari 100</span>
          </div>
        </div>

        <div className="w-full flex-1">
          <h3 className="font-semibold text-white">Skor Keamanan Digital</h3>
          <p className="mt-1 text-sm text-slate-400">
            Gabungan hasil dari tiga tools yang sudah kamu coba.
          </p>

          <div className="mt-4 space-y-2.5">
            {COMPONENTS.map(({ key, label, icon: Icon, href }) => {
              const value = score.components[key];
              return (
                <div key={key} className="flex items-center gap-3 text-sm">
                  <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                  <span className="w-24 shrink-0 text-slate-300 sm:w-32">{label}</span>
                  {value === null ? (
                    <Link
                      href={href}
                      className="flex items-center gap-1 text-emerald-400 hover:underline"
                    >
                      Belum dicoba <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <div className="flex flex-1 items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${value}%`, backgroundColor: scoreColor(value) }}
                        />
                      </div>
                      <span className="w-9 shrink-0 text-right text-slate-400">{value}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
