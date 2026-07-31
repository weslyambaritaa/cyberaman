import { Shield, ShieldCheck, ShieldPlus, ShieldAlert, Fish, Search, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Badge } from "@/lib/types";

const ICONS: Record<string, typeof Shield> = {
  Shield,
  ShieldCheck,
  ShieldPlus,
  ShieldAlert,
  Fish,
  Search,
};

export function BadgeGrid({
  badges,
  earnedIds,
}: {
  badges: Badge[];
  earnedIds: Set<string>;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {badges.map((badge) => {
        const Icon = ICONS[badge.icon] ?? Shield;
        const earned = earnedIds.has(badge.id);
        return (
          <Card
            key={badge.id}
            className={earned ? "border-emerald-500/40 bg-emerald-500/5" : "opacity-60"}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              {earned ? (
                <Icon className="h-8 w-8 text-emerald-400" aria-hidden />
              ) : (
                <Lock className="h-8 w-8 text-slate-400" aria-hidden />
              )}
              <p className="text-sm font-semibold text-slate-200">{badge.name}</p>
              <p className="text-xs text-slate-400">{badge.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
