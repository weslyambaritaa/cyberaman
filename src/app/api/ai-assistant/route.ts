import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { learningModules } from "@/lib/content/modules";

// "gemini-flash-latest" is a stable alias Google keeps pointed at whichever
// flash model is current — avoids re-pinning this every time a dated model
// name (e.g. gemini-2.0-flash) ages out of the free tier.
const MODEL = "gemini-flash-latest";

const ANALYZE_SYSTEM_PROMPT = `Kamu adalah asisten keamanan siber yang membantu pengguna awam mengenali pesan phishing/social engineering. Untuk teks yang diberikan, evaluasi tanda-tanda berikut: (1) bahasa mendesak/urgency ("segera", "24 jam", akun akan diblokir), (2) tautan atau kontak yang mencurigakan/tidak resmi, (3) permintaan data sensitif (OTP, kata sandi, data kartu, KTP), (4) tawaran yang tidak wajar (hadiah, diskon ekstrem). Mulai jawabanmu dengan kesimpulan tebal: "Kemungkinan Phishing", "Kemungkinan Aman", atau "Perlu Kehati-hatian" — lalu jelaskan alasannya dalam poin-poin singkat berbahasa Indonesia. Jangan menjawab hal di luar analisis keamanan pesan ini.`;

const ASK_SYSTEM_PROMPT = `Kamu adalah asisten belajar untuk platform edukasi keamanan siber "CyberAman". Jawab HANYA berdasarkan konten modul belajar yang disertakan di bawah, dengan bahasa Indonesia yang singkat dan jelas. Jika pertanyaan pengguna di luar topik modul atau di luar topik keamanan siber/privasi digital secara umum, katakan dengan sopan bahwa kamu hanya bisa membantu seputar materi CyberAman — jangan mengarang jawaban di luar konteks yang diberikan.`;

const MODULE_CONTEXT = learningModules
  .map(
    (m) =>
      `## ${m.title}\n${m.sections.map((s) => `${s.heading}: ${s.body}`).join("\n")}`,
  )
  .join("\n\n");

const requestSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("analyze"), text: z.string().trim().min(1).max(4000) }),
  z.object({ mode: z.literal("ask"), question: z.string().trim().min(1).max(500) }),
]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Masuk dulu untuk memakai AI Security Assistant." },
      { status: 401 },
    );
  }

  if (!rateLimit(`ai:${user.id}`, 10, 60_000)) {
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

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents:
        parsed.data.mode === "analyze"
          ? `Analisis pesan berikut:\n"""${parsed.data.text}"""`
          : parsed.data.question,
      config: {
        systemInstruction:
          parsed.data.mode === "analyze"
            ? ANALYZE_SYSTEM_PROMPT
            : `${ASK_SYSTEM_PROMPT}\n\nKonten modul CyberAman:\n${MODULE_CONTEXT}`,
        temperature: parsed.data.mode === "analyze" ? 0.3 : 0.4,
      },
    });

    return NextResponse.json({ result: response.text ?? "" });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Gagal menghubungi layanan AI. Coba lagi sebentar lagi." },
      { status: 502 },
    );
  }
}
