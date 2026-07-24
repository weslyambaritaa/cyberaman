import { Trophy, Medal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getCurrentUser, getLeaderboard } from "@/lib/queries";

export const metadata = { title: "Papan Skor — CyberAman" };

const MEDAL_COLORS = ["text-yellow-400", "text-slate-300", "text-amber-600"];

export default async function LeaderboardPage() {
  const [rows, user] = await Promise.all([getLeaderboard(), getCurrentUser()]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Trophy className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Papan Skor</h1>
          <p className="text-sm text-slate-400">
            50 pengguna dengan poin literasi keamanan digital tertinggi.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <Card className="text-center text-slate-400">
          Belum ada data. Jadilah yang pertama mengumpulkan poin!
        </Card>
      ) : (
        <Card className="divide-y divide-slate-800 p-0">
          {rows.map((row, i) => (
            <div
              key={row.user_id}
              className={`flex items-center justify-between px-5 py-3 ${
                user?.id === row.user_id ? "bg-emerald-500/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex w-6 items-center justify-center text-sm font-semibold text-slate-400">
                  {i < 3 ? (
                    <Medal className={`h-5 w-5 ${MEDAL_COLORS[i]}`} aria-hidden />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="text-sm font-medium text-slate-200">
                  {row.username}
                  {user?.id === row.user_id && (
                    <span className="ml-2 text-xs text-emerald-400">(Kamu)</span>
                  )}
                </span>
              </div>
              <span className="text-sm font-semibold text-emerald-400">
                {row.points} poin
              </span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
