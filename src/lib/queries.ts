import { createClient } from "@/lib/supabase/server";
import type { Badge, LeaderboardRow, Profile, SecurityScore } from "@/lib/types";

// Next.js signals control flow (redirects, notFound, "this route must be
// dynamic") by throwing errors tagged with a `digest`. Those must propagate
// untouched — only a genuine Supabase failure should be swallowed here.
function isNextInternalSignal(error: unknown): boolean {
  const digest = (error as { digest?: unknown } | null)?.digest;
  return typeof digest === "string" && (digest === "DYNAMIC_SERVER_USAGE" || digest.startsWith("NEXT_"));
}

// Supabase is an external service: misconfiguration or an outage should
// degrade the site to its logged-out state, not crash every page.
async function safely<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (isNextInternalSignal(error)) throw error;
    console.warn("Supabase query failed:", error);
    return fallback;
  }
}

export async function getCurrentUser() {
  return safely(async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }, null);
}

export async function getProfile(userId: string): Promise<Profile | null> {
  return safely(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data;
  }, null);
}

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  return safely(async () => {
    const supabase = await createClient();
    const { data } = await supabase.from("leaderboard").select("*");
    return data ?? [];
  }, []);
}

export async function getAllBadges(): Promise<Badge[]> {
  return safely(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("badges")
      .select("*")
      .order("points_threshold", { nullsFirst: false });
    return data ?? [];
  }, []);
}

export async function getEarnedBadgeIds(userId: string): Promise<Set<string>> {
  return safely(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("user_badges")
      .select("badge_id")
      .eq("user_id", userId);
    return new Set((data ?? []).map((row) => row.badge_id));
  }, new Set<string>());
}

export async function getCompletedModuleSlugs(userId: string): Promise<Set<string>> {
  return safely(async () => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("learning_progress")
      .select("module_slug")
      .eq("user_id", userId);
    return new Set((data ?? []).map((row) => row.module_slug));
  }, new Set<string>());
}

// Composite "Skor Keamanan Digital": each of the 3 assessment tools
// contributes one component (0-100), and the overall score is the average
// of whichever components the user has actually tried. A tool the user
// hasn't touched yet contributes nothing (not a 0) so early users aren't
// punished for simply not having tried everything yet.
export async function getSecurityScore(userId: string): Promise<SecurityScore> {
  const fallback: SecurityScore = {
    overall: 0,
    components: { password: null, phishing: null, footprint: null },
  };

  return safely(async () => {
    const supabase = await createClient();

    const [passwordRes, phishingRes, footprintRes] = await Promise.all([
      supabase
        .from("password_checks")
        .select("score")
        .eq("user_id", userId)
        .order("score", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from("phishing_attempts").select("was_correct").eq("user_id", userId),
      supabase
        .from("footprint_results")
        .select("score, total")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const password = passwordRes.data ? Math.round((passwordRes.data.score / 4) * 100) : null;

    const phishingAttempts = phishingRes.data ?? [];
    const phishing =
      phishingAttempts.length > 0
        ? Math.round(
            (phishingAttempts.filter((a) => a.was_correct).length / phishingAttempts.length) * 100,
          )
        : null;

    const footprint = footprintRes.data
      ? Math.round((footprintRes.data.score / footprintRes.data.total) * 100)
      : null;

    const components = { password, phishing, footprint };
    const available = Object.values(components).filter((v): v is number => v !== null);
    const overall =
      available.length > 0 ? Math.round(available.reduce((a, b) => a + b, 0) / available.length) : 0;

    return { overall, components };
  }, fallback);
}
