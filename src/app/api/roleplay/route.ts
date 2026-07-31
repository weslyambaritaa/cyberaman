import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { roleplayScenarios, ROLEPLAY_EVALUATOR_PROMPT } from "@/lib/content/roleplay-scenarios";

const MODEL = "gemini-flash-latest";
const VALID_SCENARIO_IDS = new Set(roleplayScenarios.map((s) => s.id));

const messageSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z.string().trim().min(1).max(2000),
});

const requestSchema = z.object({
  action: z.enum(["reply", "evaluate"]),
  scenarioId: z.string().refine((id) => VALID_SCENARIO_IDS.has(id), {
    message: "Skenario tidak dikenal.",
  }),
  history: z.array(messageSchema).min(1).max(24),
});

function extractScore(text: string): number {
  const match = text.match(/Skor:\s*(\d{1,3})\s*\/\s*100/i);
  if (!match) return 50;
  return Math.max(0, Math.min(100, Number(match[1])));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Masuk dulu untuk memakai simulasi ini." },
      { status: 401 },
    );
  }

  if (!rateLimit(`roleplay:${user.id}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." },
      { status: 429 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Fitur AI belum dikonfigurasi (GEMINI_API_KEY belum diset)." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  }

  const scenario = roleplayScenarios.find((s) => s.id === parsed.data.scenarioId)!;
  const ai = new GoogleGenAI({ apiKey });

  try {
    if (parsed.data.action === "reply") {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: parsed.data.history.map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
        config: { systemInstruction: scenario.systemPrompt, temperature: 0.8 },
      });
      return NextResponse.json({ reply: response.text ?? "" });
    }

    const transcript = parsed.data.history
      .map((m) => `${m.role === "model" ? "PENIPU" : "KORBAN"}: ${m.text}`)
      .join("\n");

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Transkrip percakapan simulasi (skenario: ${scenario.title}):\n\n${transcript}`,
      config: { systemInstruction: ROLEPLAY_EVALUATOR_PROMPT, temperature: 0.3 },
    });

    const evaluation = response.text ?? "";
    return NextResponse.json({ evaluation, score: extractScore(evaluation) });
  } catch (error) {
    console.error("Gemini API error (roleplay):", error);
    return NextResponse.json(
      { error: "Gagal menghubungi layanan AI. Coba lagi sebentar lagi." },
      { status: 502 },
    );
  }
}
