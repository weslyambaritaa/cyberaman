"use client";

import { useState } from "react";
import { Sparkles, ScanSearch, MessageCircleQuestion, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";

type Mode = "analyze" | "ask";

async function callAssistant(payload: { mode: Mode; text?: string; question?: string }) {
  const res = await fetch("/api/ai-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Terjadi kesalahan.");
  return data.result as string;
}

export function AiAssistant() {
  const [mode, setMode] = useState<Mode>("analyze");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setInput("");
    setResult("");
    setError("");
  }

  async function handleSubmit() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const output =
        mode === "analyze"
          ? await callAssistant({ mode, text: input })
          : await callAssistant({ mode, question: input });
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => switchMode("analyze")}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === "analyze"
              ? "bg-emerald-500 text-slate-950"
              : "border border-slate-700 text-slate-300 hover:border-slate-500"
          }`}
        >
          <ScanSearch className="h-4 w-4" /> Analisis Pesan
        </button>
        <button
          onClick={() => switchMode("ask")}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === "ask"
              ? "bg-emerald-500 text-slate-950"
              : "border border-slate-700 text-slate-300 hover:border-slate-500"
          }`}
        >
          <MessageCircleQuestion className="h-4 w-4" /> Tanya Modul
        </button>
      </div>

      <Card>
        <label htmlFor="ai-input" className="mb-1.5 block text-sm font-medium text-slate-300">
          {mode === "analyze"
            ? "Tempel pesan/email/SMS yang mencurigakan"
            : "Tanyakan sesuatu seputar materi modul CyberAman"}
        </label>
        <textarea
          id="ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={mode === "analyze" ? 6 : 3}
          placeholder={
            mode === "analyze"
              ? "Contoh: Selamat! Nomor Anda memenangkan hadiah Rp50.000.000..."
              : "Contoh: Kenapa kata sandi panjang lebih penting daripada rumit?"
          }
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Menganalisis...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {mode === "analyze" ? "Analisis" : "Tanya"}
            </>
          )}
        </button>
      </Card>

      {error && (
        <Card className="border-red-500/30 bg-red-500/5 text-sm text-red-300">{error}</Card>
      )}

      {result && (
        <Card>
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-sm font-medium text-emerald-400">
            <Sparkles className="h-4 w-4" /> Jawaban AI
          </div>
          <p className="whitespace-pre-line pt-3 text-sm leading-relaxed text-slate-300">
            {result}
          </p>
        </Card>
      )}
    </div>
  );
}
