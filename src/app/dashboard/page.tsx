import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, BookOpen, Link2, ShieldAlert, ArrowRight } from "lucide-react";
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
        Halo, {profile?.username ?? "Pengguna"} 
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

      <div className="mt-10 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Tools Unggulan</h2>
        <Link href="/tools" className="flex items-center gap-1 text-sm text-emerald-400 hover:underline">
          Lihat semua tools <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/tools/url-scanner">
          <Card className="flex items-center gap-3 transition hover:border-emerald-500/50">
            <Link2 className="h-6 w-6 shrink-0 text-emerald-400" />
            <div>
              <span className="text-sm font-medium text-slate-200">Pemindai Link</span>
              <p className="text-xs text-slate-400">Cek link apa pun secara real-time</p>
            </div>
          </Card>
        </Link>
        <Link href="/tools/roleplay">
          <Card className="flex items-center gap-3 transition hover:border-emerald-500/50">
            <ShieldAlert className="h-6 w-6 shrink-0 text-emerald-400" />
            <div>
              <span className="text-sm font-medium text-slate-200">Roleplay Penipu (AI)</span>
              <p className="text-xs text-slate-400">Latih insting waspadamu real-time</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
