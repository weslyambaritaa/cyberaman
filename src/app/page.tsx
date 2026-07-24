import Link from "next/link";
import {
  Shield,
  KeyRound,
  Fish,
  Search,
  ImageOff,
  ShieldHalf,
  Trophy,
  Lock,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const TOOLS = [
  {
    href: "/tools/password-checker",
    icon: KeyRound,
    title: "Cek Kekuatan Kata Sandi",
    desc: "Analisis kekuatan kata sandi + cek apakah pernah bocor di data publik — tanpa kata sandi asli pernah dikirim ke server.",
  },
  {
    href: "/tools/phishing-simulator",
    icon: Fish,
    title: "Simulasi Phishing",
    desc: "Uji kejelianmu mengenali pesan penipuan lewat contoh email, SMS, dan WhatsApp yang realistis.",
  },
  {
    href: "/tools/footprint-checklist",
    icon: Search,
    title: "Checklist Jejak Digital",
    desc: "Ukur seberapa aman kebiasaan digitalmu lewat 10 pertanyaan reflektif, lengkap dengan rekomendasi.",
  },
  {
    href: "/tools/metadata-checker",
    icon: ImageOff,
    title: "Cek Metadata Foto",
    desc: "Lihat data GPS & perangkat tersembunyi di foto sebelum kamu membagikannya — diproses 100% di browser.",
  },
  {
    href: "/tools/2fa-simulator",
    icon: ShieldHalf,
    title: "Simulator 2FA (TOTP)",
    desc: "Lihat langsung bagaimana kode 6 digit aplikasi authenticator sebenarnya dihasilkan.",
  },
  {
    href: "/tools/ai-assistant",
    icon: Sparkles,
    title: "AI Security Assistant",
    desc: "Analisis pesan mencurigakan atau tanya jawab seputar materi belajar, ditenagai AI.",
  },
];

const SUBTHEMES = [
  "Keamanan Siber dan Perlindungan Informasi Digital",
  "Privasi Data dan Perlindungan Identitas Digital",
  "Artificial Intelligence untuk Keamanan Informasi",
  "Platform Pembelajaran Digital yang Aman dan Inovatif",
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              FTI Festival 2026 — Tema PIXEL
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Belajar Keamanan Siber Sambil <span className="text-emerald-400">Mempraktikkannya</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-400">
              CyberAman adalah platform edukasi interaktif untuk melindungi informasi
              digital: cek kata sandi, kenali phishing, ukur jejak digitalmu, dan
              kumpulkan poin sambil belajar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Mulai Gratis
              </Link>
              <Link
                href="/tools/password-checker"
                className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
              >
                Coba Tools Tanpa Daftar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Enam Tools, Satu Tujuan: Lebih Aman Berinternet
            </h2>
            <p className="mt-2 text-slate-400">
              Semua tools bisa langsung dicoba — masuk untuk menyimpan progres dan
              mengumpulkan poin.
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ href, icon: Icon, title, desc }) => (
            <Link key={href} href={href}>
              <Card className="h-full transition hover:border-emerald-500/50 hover:bg-slate-900">
                <Icon className="h-8 w-8 text-emerald-400" aria-hidden />
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-400">{desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Tema: PIXEL
            </h2>
            <p className="mt-1 text-sm font-medium text-emerald-400">
              Protection Information Exploration in the Digital Era
            </p>
            <p className="mt-4 text-slate-400">
              CyberAman dirancang menjawab tantangan kebocoran data dan serangan siber
              lewat solusi yang bisa langsung dipakai masyarakat umum, bukan sekadar
              wacana. Cakupan subtema yang diangkat:
            </p>
            <ul className="mt-5 space-y-2">
              {SUBTHEMES.map((s) => (
                <li key={s} className="flex items-start gap-2 text-sm text-slate-300">
                  <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Keamanan Bukan Sekadar Fitur
            </h2>
            <p className="mt-4 text-slate-400">
              Karena topiknya keamanan siber, kami menerapkan praktik keamanan itu
              sendiri di dalam kode:
            </p>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                <p className="text-sm text-slate-300">
                  Autentikasi & Row Level Security lewat Supabase — setiap pengguna
                  hanya bisa mengakses datanya sendiri.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                <p className="text-sm text-slate-300">
                  Kata sandi asli tidak pernah disimpan atau dikirim — hanya skor
                  kekuatannya yang dicatat.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden />
                <p className="text-sm text-slate-300">
                  Validasi form di sisi klien & server, mencegah input berbahaya
                  maupun manipulasi poin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center md:px-6">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Siap Naikkan Level Keamanan Digitalmu?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-slate-400">
          Daftar gratis, kumpulkan poin dan lencana, lalu lihat posisimu di papan skor.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          Buat Akun Sekarang
        </Link>
      </section>
    </div>
  );
}
