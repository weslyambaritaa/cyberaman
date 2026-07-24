"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Eye, EyeOff, CheckCircle2, ShieldAlert, ShieldX, DatabaseZap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { recordPasswordCheck } from "@/lib/actions/gamification";
import { checkPwnedPassword } from "@/lib/pwned-check";
import type zxcvbnFn from "zxcvbn";

type ZxcvbnResult = ReturnType<typeof zxcvbnFn>;

const STRENGTH_LABELS = ["Sangat Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-emerald-500",
];

let zxcvbnLoader: Promise<typeof zxcvbnFn> | null = null;
function loadZxcvbn() {
  if (!zxcvbnLoader) {
    zxcvbnLoader = import("zxcvbn").then((mod) => mod.default);
  }
  return zxcvbnLoader;
}

export function PasswordChecker({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<ZxcvbnResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pwned, setPwned] = useState<
    { status: "idle" } | { status: "loading" } | { status: "error" } | { status: "done"; count: number }
  >({ status: "idle" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup only — scheduling happens in the input's onChange handler below,
  // never inside an effect body, so recomputation stays tied to user input.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handlePasswordChange(value: string) {
    setPassword(value);
    setSaved(false);
    setPwned({ status: "idle" });

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value) {
      setResult(null);
      return;
    }

    debounceRef.current = setTimeout(() => {
      loadZxcvbn().then((zxcvbn) => setResult(zxcvbn(value)));
    }, 200);
  }

  async function handlePwnedCheck() {
    setPwned({ status: "loading" });
    try {
      const count = await checkPwnedPassword(password);
      setPwned({ status: "done", count });
    } catch {
      setPwned({ status: "error" });
    }
  }

  const strengthLabel = useMemo(
    () => (result ? STRENGTH_LABELS[result.score] : ""),
    [result],
  );

  function handleSave() {
    if (!result) return;
    startTransition(async () => {
      await recordPasswordCheck(result.score);
      setSaved(true);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <label htmlFor="password-input" className="mb-1.5 block text-sm font-medium text-slate-300">
          Masukkan kata sandi untuk dicek
        </label>
        <div className="relative">
          <input
            id="password-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder="Ketik di sini..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 pr-11 text-sm text-slate-100 outline-none transition focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
          Dihitung 100% di perangkatmu — kata sandi asli tidak pernah dikirim ke server.
        </p>
      </Card>

      {result && (
        <Card>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-300">Tingkat Kekuatan</span>
            <span className="font-semibold text-white">{strengthLabel}</span>
          </div>
          <div className="mt-2">
            <ProgressBar
              value={result.score + 1}
              max={5}
              colorClassName={STRENGTH_COLORS[result.score]}
            />
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-400">Estimasi waktu dibobol (offline)</dt>
              <dd className="mt-0.5 font-medium text-slate-200">
                {result.crack_times_display.offline_slow_hashing_1e4_per_second}
              </dd>
            </div>
          </dl>

          {(result.feedback.warning || result.feedback.suggestions.length > 0) && (
            <div className="mt-4 space-y-1.5 rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">
              {result.feedback.warning && <p>⚠️ {result.feedback.warning}</p>}
              {result.feedback.suggestions.map((s) => (
                <p key={s}>💡 {s}</p>
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-slate-800 pt-4">
            {pwned.status === "idle" && (
              <button
                onClick={handlePwnedCheck}
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:underline"
              >
                <DatabaseZap className="h-4 w-4" /> Cek apakah kata sandi ini pernah bocor
              </button>
            )}
            {pwned.status === "loading" && (
              <p className="text-sm text-slate-400">Mengecek ke basis data kebocoran publik...</p>
            )}
            {pwned.status === "error" && (
              <p className="text-sm text-slate-400">
                Gagal mengecek (layanan sedang tidak bisa diakses). Coba lagi sebentar lagi.
              </p>
            )}
            {pwned.status === "done" && pwned.count === 0 && (
              <p className="flex items-center gap-1.5 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Tidak ditemukan di basis data kebocoran publik yang diketahui.
              </p>
            )}
            {pwned.status === "done" && pwned.count > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-red-400">
                <ShieldX className="h-4 w-4" /> Pernah muncul di kebocoran data publik sebanyak{" "}
                {pwned.count.toLocaleString("id-ID")} kali — jangan gunakan kata sandi ini.
              </p>
            )}
            <p className="mt-1.5 text-xs text-slate-400">
              Dicek lewat API gratis Have I Been Pwned (k-anonymity) — hanya 5 karakter awal
              hash yang dikirim, kata sandi aslinya tidak pernah meninggalkan browser.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleSave}
                disabled={isPending || saved}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Skor Tersimpan
                  </>
                ) : isPending ? (
                  "Menyimpan..."
                ) : (
                  "Simpan & Dapatkan Poin"
                )}
              </button>
            ) : (
              <p className="text-sm text-slate-400">
                <a href="/login" className="font-medium text-emerald-400 hover:underline">
                  Masuk
                </a>{" "}
                untuk menyimpan progres dan dapat poin.
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
