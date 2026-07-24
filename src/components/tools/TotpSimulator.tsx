"use client";

import { useEffect, useState } from "react";
import { Secret, TOTP } from "otpauth";
import { Copy, Check, ShieldHalf } from "lucide-react";
import { Card } from "@/components/ui/Card";

const PERIOD = 30;
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STEPS = [
  {
    title: "1. Kunci Rahasia (Secret)",
    body: "Saat kamu scan QR code setup 2FA, aplikasi authenticator dan server sama-sama menyimpan kunci rahasia yang sama — ini yang membuat keduanya bisa menghasilkan kode yang sama tanpa saling terhubung ke internet.",
  },
  {
    title: "2. Hitung Mundur Waktu (Counter)",
    body: `Waktu sekarang (Unix timestamp) dibagi ${PERIOD} detik, dibulatkan ke bawah. Angka inilah "counter" yang berubah setiap ${PERIOD} detik — bukan tiap detik.`,
  },
  {
    title: "3. HMAC-SHA1",
    body: "Kunci rahasia + counter dimasukkan ke fungsi hash HMAC-SHA1, menghasilkan 20 byte data acak yang unik untuk kombinasi kunci & waktu itu.",
  },
  {
    title: "4. Dynamic Truncation",
    body: "Dari 20 byte tadi, diambil 4 byte tertentu lalu diubah jadi angka, di-modulo 10⁶ supaya jadi 6 digit — inilah kode yang muncul di aplikasi authenticator-mu.",
  },
];

export function TotpSimulator() {
  const [totp] = useState(() => {
    const secret = new Secret({ size: 20 });
    return new TOTP({
      issuer: "CyberAman",
      label: "akun-demo",
      secret,
      algorithm: "SHA1",
      digits: 6,
      period: PERIOD,
    });
  });

  const [code, setCode] = useState("");
  const [remainingMs, setRemainingMs] = useState(PERIOD * 1000);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function tick() {
      setCode(totp.generate());
      setRemainingMs(totp.remaining());
    }
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [totp]);

  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const offset = CIRCUMFERENCE * (1 - remainingMs / (PERIOD * 1000));

  function copySecret() {
    navigator.clipboard.writeText(totp.secret.base32);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div className="relative shrink-0">
            <svg width="100" height="100" viewBox="0 0 88 88" className="-rotate-90">
              <circle cx="44" cy="44" r={RADIUS} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
              <circle
                cx="44"
                cy="44"
                r={RADIUS}
                fill="none"
                stroke={remainingSeconds <= 5 ? "#f87171" : "#34d399"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-300">
              {remainingSeconds}s
            </div>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-wide text-slate-400">Kode saat ini</p>
            <p className="font-mono text-4xl font-bold tracking-[0.2em] text-emerald-400">
              {code.slice(0, 3)} {code.slice(3)}
            </p>
            <p className="mt-1 text-xs text-slate-400">Berganti otomatis tiap {PERIOD} detik</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3">
          <div>
            <p className="text-xs text-slate-400">Kunci rahasia (base32) — biasanya di-encode jadi QR code</p>
            <p className="font-mono text-sm text-slate-300">{totp.secret.base32}</p>
          </div>
          <button
            onClick={copySecret}
            className="flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-white">
          <ShieldHalf className="h-5 w-5 text-emerald-400" /> Cara Kerja di Balik Layar
        </h2>
        <div className="space-y-4">
          {STEPS.map((step) => (
            <div key={step.title}>
              <p className="text-sm font-medium text-slate-200">{step.title}</p>
              <p className="mt-1 text-sm text-slate-400">{step.body}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
