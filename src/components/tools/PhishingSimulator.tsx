"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle, Fish, ShieldCheck, Mail, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { PhishingSample } from "@/lib/content/phishing-samples";
import {
  completePhishingQuiz,
  recordPhishingAnswer,
} from "@/lib/actions/gamification";

const CHANNEL_ICON = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: MessageSquare,
} as const;

const CHANNEL_LABEL = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
} as const;

export function PhishingSimulator({
  samples,
  isLoggedIn,
}: {
  samples: PhishingSample[];
  isLoggedIn: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isPending, startTransition] = useTransition();

  const sample = samples[index];
  const finished = index >= samples.length;
  const ChannelIcon = sample ? CHANNEL_ICON[sample.channel] : Fish;

  function choose(userSaysPhishing: boolean) {
    if (answer !== null || !sample) return;
    const correct = userSaysPhishing === sample.isPhishing;
    setAnswer(userSaysPhishing);
    if (correct) setScore((s) => s + 1);

    if (isLoggedIn) {
      startTransition(async () => {
        await recordPhishingAnswer(sample.id, correct);
      });
    }
  }

  function next() {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setAnswer(null);

    if (nextIndex >= samples.length && isLoggedIn) {
      const finalScore = score; // score already includes this question if correct
      startTransition(async () => {
        await completePhishingQuiz(finalScore === samples.length);
      });
    }
  }

  if (finished) {
    return (
      <Card className="text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-emerald-400" aria-hidden />
        <h2 className="mt-3 text-xl font-bold text-white">Simulasi Selesai!</h2>
        <p className="mt-1 text-slate-400">
          Skor kamu: <span className="font-semibold text-emerald-400">{score}</span> /{" "}
          {samples.length}
        </p>
        {score === samples.length && (
          <p className="mt-2 text-sm text-emerald-300">
            🏅 Lencana &ldquo;Anti Phishing&rdquo; berhasil diraih!
          </p>
        )}
        {!isLoggedIn && (
          <p className="mt-3 text-sm text-slate-400">
            <a href="/login" className="font-medium text-emerald-400 hover:underline">
              Masuk
            </a>{" "}
            untuk menyimpan skor dan mengumpulkan lencana.
          </p>
        )}
        <button
          onClick={() => {
            setIndex(0);
            setScore(0);
            setAnswer(null);
          }}
          className="mt-5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
        >
          Ulangi Simulasi
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>
          Pesan {index + 1} dari {samples.length}
        </span>
        <span>
          Skor: <span className="font-semibold text-emerald-400">{score}</span>
        </span>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-slate-800 pb-3 text-sm text-slate-400">
          <ChannelIcon className="h-4 w-4" aria-hidden />
          <span className="font-medium">{CHANNEL_LABEL[sample.channel]}</span>
          <span>&middot;</span>
          <span>Dari: {sample.from}</span>
        </div>
        <div className="pt-4">
          {sample.subject && (
            <p className="mb-2 font-semibold text-white">{sample.subject}</p>
          )}
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
            {sample.body}
          </p>
        </div>
      </Card>

      {answer === null ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => choose(true)}
            disabled={isPending}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
          >
            <Fish className="h-4 w-4" /> Ini Phishing
          </button>
          <button
            onClick={() => choose(false)}
            disabled={isPending}
            className="flex items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
          >
            <ShieldCheck className="h-4 w-4" /> Ini Aman
          </button>
        </div>
      ) : (
        <Card
          className={
            answer === sample.isPhishing
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-red-500/40 bg-red-500/5"
          }
        >
          <div className="flex items-center gap-2 font-semibold">
            {answer === sample.isPhishing ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-emerald-300">Tepat!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-300">
                  Kurang tepat — ini {sample.isPhishing ? "phishing" : "pesan aman"}.
                </span>
              </>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-400">{sample.explanation}</p>
          <button
            onClick={next}
            className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Lanjut
          </button>
        </Card>
      )}
    </div>
  );
}
