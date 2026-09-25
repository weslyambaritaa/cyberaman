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
  Link2,
  ShieldAlert,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const TOOLS = [
  {
    href: "/tools/url-scanner",
    icon: Link2,
    title: "Pemindai Link",
    desc: "Cek link apa pun secara real-time — bukan contoh karangan — untuk pola phishing, plus verifikasi Google Safe Browsing.",
  },
  {
    href: "/tools/roleplay",
    icon: ShieldAlert,
    title: "Roleplay Penipu (AI)",
    desc: "Ngobrol langsung dengan AI yang berperan sebagai penipu — latih insting waspadamu secara real-time, bukan cuma tebak-tebakan.",
  },
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
      <section
        className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden border-b border-white/15 bg-contain bg-no-repeat bg-[position:72%_center] md:bg-right"
        style={{ backgroundImage: "url('/images/cyberaman-bg-hero.png')" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/25 md:from-black/95 md:via-black/80 md:to-black/15" />
        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 py-20 md:px-6 md:py-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center md:mx-0 md:items-start md:text-left">
            <h1 className="text-4xl font-normal leading-[1.17] tracking-[-0.24px] text-white md:text-5xl">
              Belajar Keamanan Siber Sambil{" "}
              <span className="text-[#7B66FF]">Mempraktikkannya</span>
            </h1>
            <p className="hidden">
              CyberAman adalah platform edukasi interaktif untuk melindungi
              informasi digital: cek kata sandi, kenali phishing, ukur jejak
              digitalmu, dan kumpulkan poin sambil belajar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="min-h-12 rounded-full bg-[#673DE6] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#7B66FF]"
              >
                Mulai Gratis
              </Link>
              <Link
                href="/tools/password-checker"
                className="min-h-12 rounded-xl border border-white/15 bg-[#222225] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#18181A]"
              >
                Coba Tools Tanpa Daftar
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-white/15 bg-black">
        <div
          className="pointer-events-none absolute inset-0 bg-contain bg-no-repeat bg-[position:28%_center] opacity-45 md:bg-left"
          style={{
            backgroundImage: "url('/images/cyberaman-bg-threat-awareness.png')",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/85 md:bg-black/75" />
        <div className="relative z-10 mx-auto max-w-[1360px] px-4 py-20 md:px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-normal leading-[1.19] tracking-[-0.16px] text-white md:text-4xl">
              Delapan Tools, Satu Tujuan: Lebih Aman Berinternet
            </h2>
            <p className="hidden">
              Semua tools bisa langsung dicoba — masuk untuk menyimpan progres
              dan mengumpulkan poin.
            </p>
          </div>
        </div>
          <div className="grid gap-6 sm:grid-cols-3 xl:grid-cols-6">
          {TOOLS.map(({ href, icon: Icon, title }) => (
            <Link key={href} href={href}>
              <Card className="h-full rounded-xl border-0 bg-[#18181A]/95 p-6 shadow-none transition hover:bg-[#222225]/95">
                <Icon className="h-8 w-8 text-[#7B66FF]" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold leading-[1.33] tracking-[-0.12px] text-white">{title}</h3>
              </Card>
            </Link>
          ))}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-y border-white/15 bg-[#101011]">
        <div
          className="pointer-events-none absolute inset-0 bg-contain bg-no-repeat bg-[position:72%_center] opacity-50 md:bg-right"
          style={{
            backgroundImage: "url('/images/cyberaman-bg-digital-learning.png')",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/85 md:bg-black/75" />
        <div className="relative z-10 mx-auto grid max-w-[1360px] gap-12 px-4 py-20 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="text-2xl font-normal leading-[1.19] tracking-[-0.16px] text-white md:text-4xl">
              Tema: PIXEL
            </h2>
            <p className="mt-1 text-sm font-semibold text-[#9D99FF]">
              Protection Information Exploration in the Digital Era
            </p>
            <p className="hidden">
              CyberAman dirancang menjawab tantangan kebocoran data dan serangan
              siber lewat solusi yang bisa langsung dipakai masyarakat umum,
              bukan sekadar wacana. Cakupan subtema yang diangkat:
            </p>
            <ul className="mt-5 space-y-2">
              {SUBTHEMES.map((s) => (
                <li
                  key={s}
                  className="flex items-start gap-2 text-sm text-[#DEDEE2]"
                >
                  <Shield
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#7B66FF]"
                    aria-hidden
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-normal leading-[1.19] tracking-[-0.16px] text-white md:text-4xl">
              Keamanan Bukan Sekadar Fitur
            </h2>
            <p className="hidden">
              Karena topiknya keamanan siber, kami menerapkan praktik keamanan
              itu sendiri di dalam kode:
            </p>
            <div className="mt-5 space-y-3">
              <div className="flex items-start gap-3">
                <Lock
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#7B66FF]"
                  aria-hidden
                />
                <p className="text-sm text-[#DEDEE2]">
                  Autentikasi & Row Level Security lewat Supabase — setiap
                  pengguna hanya bisa mengakses datanya sendiri.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <KeyRound
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#7B66FF]"
                  aria-hidden
                />
                <p className="text-sm text-[#DEDEE2]">
                  Kata sandi asli tidak pernah disimpan atau dikirim — hanya
                  skor kekuatannya yang dicatat.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Trophy
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#7B66FF]"
                  aria-hidden
                />
                <p className="text-sm text-[#DEDEE2]">
                  Validasi form di sisi klien & server, mencegah input berbahaya
                  maupun manipulasi poin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-4 py-20 text-center md:px-6">
        <h2 className="text-2xl font-normal leading-[1.19] tracking-[-0.16px] text-white md:text-4xl">
          Siap Naikkan Level Keamanan Digitalmu?
        </h2>
        <p className="hidden">
          Daftar gratis, kumpulkan poin dan lencana, lalu lihat posisimu di
          papan skor.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block min-h-12 rounded-full bg-[#673DE6] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#7B66FF]"
        >
          Buat Akun Sekarang
        </Link>
      </section>
    </div>
  );
}
