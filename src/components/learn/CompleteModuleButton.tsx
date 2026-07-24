"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { completeModule } from "@/lib/actions/gamification";

export function CompleteModuleButton({
  slug,
  isLoggedIn,
  initiallyCompleted,
}: {
  slug: string;
  isLoggedIn: boolean;
  initiallyCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [awarded, setAwarded] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-slate-400">
        <a href="/login" className="font-medium text-emerald-400 hover:underline">
          Masuk
        </a>{" "}
        untuk menandai modul ini selesai dan dapat poin.
      </p>
    );
  }

  if (completed) {
    return (
      <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-400">
        <CheckCircle2 className="h-4 w-4" /> Modul selesai
        {awarded ? ` — +${awarded} poin` : ""}
      </p>
    );
  }

  return (
    <button
      onClick={() =>
        startTransition(async () => {
          const result = await completeModule(slug);
          setCompleted(true);
          setAwarded(result.awarded);
        })
      }
      disabled={isPending}
      className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
    >
      {isPending ? "Menyimpan..." : "Tandai Selesai (+10 poin)"}
    </button>
  );
}
