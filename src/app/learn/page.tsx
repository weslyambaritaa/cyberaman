import Link from "next/link";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { learningModules } from "@/lib/content/modules";
import { getCompletedModuleSlugs, getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Modul Belajar — CyberAman" };

export default async function LearnPage() {
  const user = await getCurrentUser();
  const completed = user ? await getCompletedModuleSlugs(user.id) : new Set<string>();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Modul Belajar</h1>
          <p className="text-sm text-slate-400">
            Materi singkat seputar keamanan siber dan literasi digital. Selesaikan
            untuk mengumpulkan poin.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {learningModules.map((mod) => {
          const isDone = completed.has(mod.slug);
          return (
            <Link key={mod.slug} href={`/learn/${mod.slug}`}>
              <Card className="h-full transition hover:border-emerald-500/50 hover:bg-slate-900">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-emerald-300">
                    {mod.subtheme}
                  </span>
                  {isDone && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                </div>
                <h2 className="font-semibold text-white">{mod.title}</h2>
                <p className="mt-1.5 text-sm text-slate-400">{mod.summary}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" /> {mod.minutesRead} menit baca
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
