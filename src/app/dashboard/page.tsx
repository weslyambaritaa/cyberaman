import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, KeyRound, Fish, Search, BookOpen, ImageOff, ShieldHalf, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BadgeGrid } from "@/components/dashboard/BadgeGrid";
import { SecurityScoreCard } from "@/components/dashboard/SecurityScoreCard";
import { learningModules } from "@/lib/content/modules";
import {
  getAllBadges,
  getCompletedModuleSlugs,
  getCurrentUser,
  getEarnedBadgeIds,
  getProfile,
  getSecurityScore,
} from "@/lib/queries";

export const metadata = { title: "Dashboard — CyberAman" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [profile, badges, earnedIds, completedSlugs, securityScore] = await Promise.all([
    getProfile(user.id),
    getAllBadges(),
    getEarnedBadgeIds(user.id),
    getCompletedModuleSlugs(user.id),
    getSecurityScore(user.id),
  ]);

  const points = profile?.points ?? 0;
  const nextBadge = badges
    .filter((b) => b.points_threshold !== null && b.points_threshold > points)
    .sort((a, b) => (a.points_threshold ?? 0) - (b.points_threshold ?? 0))[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-bold text-white">
        Halo, {profile?.username ?? "Pengguna"} 👋
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Ini progres literasi keamanan digitalmu sejauh ini.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <SecurityScoreCard score={securityScore} />

        <Card>
          <div className="flex items-center gap-2 text-slate-400">
            <Trophy className="h-5 w-5 text-emerald-400" />
            <span className="text-sm">Total Poin</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-white">{points}</p>
          {nextBadge ? (
            <div className="mt-3">
              <ProgressBar value={points} max={nextBadge.points_threshold ?? 0} />
              <p className="mt-1.5 text-xs text-slate-400">
                {(nextBadge.points_threshold ?? 0) - points} poin lagi menuju lencana
                &ldquo;{nextBadge.name}&rdquo;
              </p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-emerald-400">
              Semua lencana berbasis poin berhasil diraih! 🎉
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="h-5 w-5 text-emerald-400" />
            <span className="text-sm">Modul Belajar Selesai</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-white">
            {completedSlugs.size} / {learningModules.length}
          </p>
          <Link
            href="/learn"
            className="mt-3 inline-block text-sm font-medium text-emerald-400 hover:underline"
          >
            Lanjutkan belajar &rarr;
          </Link>
        </Card>
      </div>

      <h2 className="mt-10 mb-4 text-lg font-semibold text-white">Lencana</h2>
      <BadgeGrid badges={badges} earnedIds={earnedIds} />

      <h2 className="mt-10 mb-4 text-lg font-semibold text-white">Coba Tools Lagi</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Link href="/tools/password-checker">
          <Card className="flex flex-col items-center gap-2 text-center transition hover:border-emerald-500/50">
            <KeyRound className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">Cek Kata Sandi</span>
          </Card>
        </Link>
        <Link href="/tools/phishing-simulator">
          <Card className="flex flex-col items-center gap-2 text-center transition hover:border-emerald-500/50">
            <Fish className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">Simulasi Phishing</span>
          </Card>
        </Link>
        <Link href="/tools/footprint-checklist">
          <Card className="flex flex-col items-center gap-2 text-center transition hover:border-emerald-500/50">
            <Search className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">Jejak Digital</span>
          </Card>
        </Link>
        <Link href="/tools/metadata-checker">
          <Card className="flex flex-col items-center gap-2 text-center transition hover:border-emerald-500/50">
            <ImageOff className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">Cek Metadata Foto</span>
          </Card>
        </Link>
        <Link href="/tools/2fa-simulator">
          <Card className="flex flex-col items-center gap-2 text-center transition hover:border-emerald-500/50">
            <ShieldHalf className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">Simulator 2FA</span>
          </Card>
        </Link>
        <Link href="/tools/ai-assistant">
          <Card className="flex flex-col items-center gap-2 text-center transition hover:border-emerald-500/50">
            <Sparkles className="h-6 w-6 text-emerald-400" />
            <span className="text-sm font-medium text-slate-200">AI Assistant</span>
          </Card>
        </Link>
      </div>
    </div>
  );
}
