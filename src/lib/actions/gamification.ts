"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { phishingSamples } from "@/lib/content/phishing-samples";
import { learningModules } from "@/lib/content/modules";
import { footprintChecklist } from "@/lib/content/footprint-checklist";
import { roleplayScenarios } from "@/lib/content/roleplay-scenarios";

const POINTS = {
  passwordCheckFirstTry: 5,
  phishingCorrectAnswer: 5,
  footprintCompleted: 15,
  moduleCompleted: 10,
  metadataCheckFirstTry: 5,
  urlScanFirstTry: 5,
  roleplaySessionFirstTry: 10,
} as const;

const ROLEPLAY_RESILIENT_THRESHOLD = 70;

const VALID_SAMPLE_IDS = new Set(phishingSamples.map((s) => s.id));
const VALID_MODULE_SLUGS = new Set(learningModules.map((m) => m.slug));
const VALID_CHECKLIST_IDS = new Set(footprintChecklist.map((c) => c.id));
const VALID_SCENARIO_IDS = new Set(roleplayScenarios.map((s) => s.id));

const passwordCheckSchema = z.object({
  score: z.number().int().min(0).max(4),
});

const phishingAnswerSchema = z.object({
  sampleId: z.string().refine((id) => VALID_SAMPLE_IDS.has(id), {
    message: "ID soal tidak dikenal.",
  }),
  correct: z.boolean(),
});

const footprintResultSchema = z
  .object({
    score: z.number().int().min(0),
    total: z.number().int().min(1),
    answers: z.record(z.string(), z.boolean()),
  })
  .refine((data) => data.score <= data.total, {
    message: "Skor tidak boleh melebihi total.",
  })
  .refine(
    (data) => Object.keys(data.answers).every((id) => VALID_CHECKLIST_IDS.has(id)),
    { message: "Jawaban mengandung pertanyaan yang tidak dikenal." },
  );

const moduleSlugSchema = z.string().refine((slug) => VALID_MODULE_SLUGS.has(slug), {
  message: "Modul tidak dikenal.",
});

const urlScanSchema = z.object({
  domain: z.string().trim().min(1).max(255),
  riskTier: z.enum(["aman", "waspada", "berisiko"]),
});

const roleplaySessionSchema = z.object({
  scenario: z.string().refine((id) => VALID_SCENARIO_IDS.has(id), {
    message: "Skenario tidak dikenal.",
  }),
  score: z.number().int().min(0).max(100),
});

// Every mutation below also requires an authenticated user, but a signed-in
// account is still cheap to script — this caps how often one account can
// hammer these actions regardless of what the (already-validated) payload says.
function withinGamificationLimit(userId: string) {
  return rateLimit(`gamify:${userId}`, 40, 60_000);
}

export async function recordPasswordCheck(score: number) {
  const parsed = passwordCheckSchema.safeParse({ score });
  if (!parsed.success) return { awarded: 0 };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !withinGamificationLimit(user.id)) return { awarded: 0 };

  const { count } = await supabase
    .from("password_checks")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase
    .from("password_checks")
    .insert({ user_id: user.id, score: parsed.data.score });

  let awarded = 0;
  if (!count) {
    await supabase.rpc("add_points", { p_amount: POINTS.passwordCheckFirstTry });
    awarded = POINTS.passwordCheckFirstTry;
  }

  revalidatePath("/dashboard");
  return { awarded };
}

export async function recordPhishingAnswer(sampleId: string, correct: boolean) {
  const parsed = phishingAnswerSchema.safeParse({ sampleId, correct });
  if (!parsed.success) return { awarded: 0, alreadyAnswered: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !withinGamificationLimit(user.id)) {
    return { awarded: 0, alreadyAnswered: false };
  }

  const { error } = await supabase.from("phishing_attempts").insert({
    user_id: user.id,
    sample_id: parsed.data.sampleId,
    was_correct: parsed.data.correct,
  });

  // unique(user_id, sample_id) violation means this sample was already scored
  const alreadyAnswered = Boolean(error);

  let awarded = 0;
  if (!alreadyAnswered && parsed.data.correct) {
    await supabase.rpc("add_points", { p_amount: POINTS.phishingCorrectAnswer });
    awarded = POINTS.phishingCorrectAnswer;
  }

  revalidatePath("/dashboard");
  return { awarded, alreadyAnswered };
}

export async function completePhishingQuiz(allCorrect: boolean) {
  if (!allCorrect) return;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !withinGamificationLimit(user.id)) return;

  await supabase.rpc("award_badge", { p_badge_id: "phishing-pro" });
  revalidatePath("/dashboard");
}

export async function recordFootprintResult(
  score: number,
  total: number,
  answers: Record<string, boolean>,
) {
  const parsed = footprintResultSchema.safeParse({ score, total, answers });
  if (!parsed.success) return { awarded: 0 };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !withinGamificationLimit(user.id)) return { awarded: 0 };

  const { count } = await supabase
    .from("footprint_results")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase.from("footprint_results").insert({
    user_id: user.id,
    score: parsed.data.score,
    total: parsed.data.total,
    answers: parsed.data.answers,
  });

  let awarded = 0;
  if (!count) {
    await supabase.rpc("add_points", { p_amount: POINTS.footprintCompleted });
    await supabase.rpc("award_badge", { p_badge_id: "footprint-checked" });
    awarded = POINTS.footprintCompleted;
  }

  revalidatePath("/dashboard");
  return { awarded };
}

export async function completeModule(slug: string) {
  const parsed = moduleSlugSchema.safeParse(slug);
  if (!parsed.success) return { awarded: 0, alreadyCompleted: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !withinGamificationLimit(user.id)) {
    return { awarded: 0, alreadyCompleted: false };
  }

  const { error } = await supabase
    .from("learning_progress")
    .insert({ user_id: user.id, module_slug: parsed.data });

  const alreadyCompleted = Boolean(error);

  let awarded = 0;
  if (!alreadyCompleted) {
    await supabase.rpc("add_points", { p_amount: POINTS.moduleCompleted });
    awarded = POINTS.moduleCompleted;
  }

  revalidatePath("/dashboard");
  revalidatePath("/learn");
  return { awarded, alreadyCompleted };
}

export async function recordMetadataCheck(hadGps: boolean) {
  const parsed = z.boolean().safeParse(hadGps);
  if (!parsed.success) return { awarded: 0 };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !withinGamificationLimit(user.id)) return { awarded: 0 };

  const { count } = await supabase
    .from("metadata_checks")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase
    .from("metadata_checks")
    .insert({ user_id: user.id, had_gps: parsed.data });

  let awarded = 0;
  if (!count) {
    await supabase.rpc("add_points", { p_amount: POINTS.metadataCheckFirstTry });
    awarded = POINTS.metadataCheckFirstTry;
  }

  revalidatePath("/dashboard");
  return { awarded };
}

export async function recordUrlScan(domain: string, riskTier: "aman" | "waspada" | "berisiko") {
  const parsed = urlScanSchema.safeParse({ domain, riskTier });
  if (!parsed.success) return { awarded: 0 };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !withinGamificationLimit(user.id)) return { awarded: 0 };

  const { count } = await supabase
    .from("url_scans")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase.from("url_scans").insert({
    user_id: user.id,
    domain: parsed.data.domain,
    risk_tier: parsed.data.riskTier,
  });

  let awarded = 0;
  if (!count) {
    await supabase.rpc("add_points", { p_amount: POINTS.urlScanFirstTry });
    awarded = POINTS.urlScanFirstTry;
  }

  revalidatePath("/dashboard");
  return { awarded };
}

export async function recordRoleplaySession(scenario: string, score: number) {
  const parsed = roleplaySessionSchema.safeParse({ scenario, score });
  if (!parsed.success) return { awarded: 0 };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !withinGamificationLimit(user.id)) return { awarded: 0 };

  const { count } = await supabase
    .from("roleplay_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  await supabase.from("roleplay_sessions").insert({
    user_id: user.id,
    scenario: parsed.data.scenario,
    score: parsed.data.score,
  });

  let awarded = 0;
  if (!count) {
    await supabase.rpc("add_points", { p_amount: POINTS.roleplaySessionFirstTry });
    awarded = POINTS.roleplaySessionFirstTry;
  }

  if (parsed.data.score >= ROLEPLAY_RESILIENT_THRESHOLD) {
    await supabase.rpc("award_badge", { p_badge_id: "roleplay-resilient" });
  }

  revalidatePath("/dashboard");
  return { awarded };
}
