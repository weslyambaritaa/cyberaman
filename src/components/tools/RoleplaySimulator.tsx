"use client";

import { useRef, useState, useEffect } from "react";
import Markdown from "react-markdown";
import { Send, Loader2, Flag, RotateCcw, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { roleplayScenarios, type RoleplayScenario } from "@/lib/content/roleplay-scenarios";
import { recordRoleplaySession } from "@/lib/actions/gamification";

type ChatMessage = { role: "user" | "model"; text: string };
type Phase = "select" | "chat" | "evaluating" | "result";

async function callRoleplay(payload: {
  action: "reply" | "evaluate";
  scenarioId: string;
  history: ChatMessage[];
}) {
  const res = await fetch("/api/roleplay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Terjadi kesalahan.");
  return data;
}

export function RoleplaySimulator() {
  const [phase, setPhase] = useState<Phase>("select");
  const [scenario, setScenario] = useState<RoleplayScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startScenario(s: RoleplayScenario) {
    setScenario(s);
    setMessages([{ role: "model", text: s.openingMessage }]);
    setPhase("chat");
    setError("");
  }

  async function sendMessage() {
    if (!input.trim() || !scenario || loading) return;
    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");
    try {
      const data = await callRoleplay({ action: "reply", scenarioId: scenario.id, history: nextMessages });
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  async function endSession() {
    if (!scenario) return;
    setPhase("evaluating");
    setError("");
    try {
      const data = await callRoleplay({ action: "evaluate", scenarioId: scenario.id, history: messages });
      setEvaluation(data.evaluation);
      setScore(data.score);
      setPhase("result");
      await recordRoleplaySession(scenario.id, data.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      setPhase("chat");
    }
  }

  function reset() {
    setPhase("select");
    setScenario(null);
    setMessages([]);
    setEvaluation("");
    setScore(null);
    setError("");
  }

  if (phase === "select") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-400">
          Pilih skenario — AI akan berperan sebagai penipu dan mencoba memanipulasimu
          lewat chat. Balas seperti biasa, lalu akhiri sesi kapan saja untuk lihat skor
          ketahananmu.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {roleplayScenarios.map((s) => (
            <button key={s.id} onClick={() => startScenario(s)} className="text-left">
              <Card className="h-full transition hover:border-emerald-500/50 hover:bg-slate-900">
                <ShieldAlert className="h-6 w-6 text-red-400" aria-hidden />
                <h3 className="mt-2 font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{s.description}</p>
              </Card>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <Card>
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-slate-400">Skor Ketahananmu</p>
          <p
            className={`text-5xl font-bold ${
              (score ?? 0) >= 70 ? "text-emerald-400" : (score ?? 0) >= 40 ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {score}
          </p>
          {score !== null && score >= 70 && (
            <p className="mt-1 text-sm text-emerald-400">🏅 Lencana &ldquo;Anti Manipulasi&rdquo; diraih!</p>
          )}
        </div>
        <div className="prose prose-invert prose-sm mt-4 max-w-none border-t border-slate-800 pt-4 prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white prose-headings:text-white">
          <Markdown>{evaluation}</Markdown>
        </div>
        <button
          onClick={reset}
          className="mt-5 flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
        >
          <RotateCcw className="h-4 w-4" /> Coba Skenario Lain
        </button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">{scenario?.title}</p>
        <button
          onClick={endSession}
          disabled={phase === "evaluating" || messages.filter((m) => m.role === "user").length === 0}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {phase === "evaluating" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menilai...
            </>
          ) : (
            <>
              <Flag className="h-3.5 w-3.5" /> Akhiri &amp; Lihat Skor
            </>
          )}
        </button>
      </div>

      <Card className="flex max-h-[420px] flex-col gap-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-emerald-500 text-slate-950"
                  : "border border-red-500/30 bg-red-500/10 text-slate-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-slate-400">
              mengetik...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </Card>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={loading}
          placeholder="Balas seperti biasa..."
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
