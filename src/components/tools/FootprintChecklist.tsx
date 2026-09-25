"use client";

import { useState, useTransition } from "react";
import { Search, CheckCircle2, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { FootprintItem } from "@/lib/content/footprint-checklist";
import { recordFootprintResult } from "@/lib/actions/gamification";

function tierFor(score: number, total: number) {
  const ratio = score / total;
  if (ratio >= 0.8) return { label: "Sangat Aman", color: "text-emerald-400" };
  if (ratio >= 0.5) return { label: "Cukup Aman", color: "text-yellow-400" };
  return { label: "Perlu Perhatian", color: "text-red-400" };
}

export function FootprintChecklist({
  items,
  isLoggedIn,
}: {
  items: FootprintItem[];
  isLoggedIn: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === items.length;
  const score = Object.values(answers).filter(Boolean).length;

  function setAnswer(id: string, value: boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    if (isLoggedIn) {
      startTransition(async () => {
        await recordFootprintResult(score, items.length, answers);
        setSaved(true);
      });
    }
  }

  if (submitted) {
    const tier = tierFor(score, items.length);
    const weakItems = items.filter((item) => answers[item.id] === false);

    return (
      <Card>
        <div className="text-center">
          <Search className="mx-auto h-10 w-10 text-emerald-400" aria-hidden />
          <h2 className="mt-3 text-xl font-bold text-white">Hasil Checklist Kamu</h2>
          <p className={`mt-1 text-lg font-semibold ${tier.color}`}>{tier.label}</p>
          <p className="text-sm text-slate-400">
            {score} dari {items.length} praktik keamanan sudah kamu terapkan
          </p>
        </div>
        <div className="mt-4">
          <ProgressBar value={score} max={items.length} />
        </div>

        {weakItems.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-300">
              <Lightbulb className="h-4 w-4 text-yellow-400" /> Rekomendasi untuk kamu
            </h3>
            <ul className="space-y-2">
              {weakItems.map((item) => (
                <li
                  key={item.id}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400"
                >
                  {item.hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {isLoggedIn ? (
          saved && (
            <p className="mt-5 flex items-center gap-1.5 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Hasil tersimpan ke profilmu.
            </p>
          )
        ) : (
          <p className="mt-5 text-sm text-slate-400">
            <a href="/login" className="font-medium text-emerald-400 hover:underline">
              Masuk
            </a>{" "}
            untuk menyimpan hasil dan mengumpulkan poin.
          </p>
        )}

        <button
          onClick={() => {
            setSubmitted(false);
            setSaved(false);
            setAnswers({});
          }}
          className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
        >
          Ulangi Checklist
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <Card key={item.id}>
          <p className="text-sm font-medium text-slate-200">
            {i + 1}. {item.label}
          </p>
          <div className="mt-3 flex gap-3">
            <button
              onClick={() => setAnswer(item.id, true)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                answers[item.id] === true
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              Ya
            </button>
            <button
              onClick={() => setAnswer(item.id, false)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                answers[item.id] === false
                  ? "border-red-500 bg-red-500/10 text-red-300"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              Belum
            </button>
          </div>
        </Card>
      ))}

      <div className="sticky bottom-4 flex items-center justify-between rounded-xl border border-white/15 bg-[#18181A] p-4">
        <span className="text-sm text-slate-400">
          {answeredCount} / {items.length} terjawab
        </span>
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isPending}
          className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lihat Hasil
        </button>
      </div>
    </div>
  );
}
