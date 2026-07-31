import Link from "next/link";
import {
  KeyRound,
  Fish,
  Search,
  ImageOff,
  ShieldHalf,
  Sparkles,
  Wrench,
  Link2,
  ShieldAlert,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Tools — CyberAman" };

const TOOLS = [
  {
    href: "/tools/url-scanner",
    icon: Link2,
    title: "Pemindai Link",
    desc: "Cek link apa pun secara real-time untuk pola phishing (typosquatting, punycode, dll) + verifikasi Google Safe Browsing.",
    badge: "Unggulan",
  },
  {
    href: "/tools/roleplay",
    icon: ShieldAlert,
    title: "Simulasi Roleplay Penipu",
    desc: "Ngobrol langsung dengan AI yang berperan sebagai penipu — latih insting waspadamu secara real-time.",
    badge: "Unggulan",
  },
  {
    href: "/tools/password-checker",
    icon: KeyRound,
    title: "Cek Kekuatan Kata Sandi",
    desc: "Analisis kekuatan kata sandi + cek apakah pernah bocor di data publik.",
  },
  {
    href: "/tools/phishing-simulator",
    icon: Fish,
    title: "Simulasi Phishing",
    desc: "Uji kejelianmu menebak pesan phishing lewat contoh nyata.",
  },
  {
    href: "/tools/footprint-checklist",
    icon: Search,
    title: "Checklist Jejak Digital",
    desc: "Ukur kebiasaan privasi digitalmu lewat 10 pertanyaan reflektif.",
  },
  {
    href: "/tools/metadata-checker",
    icon: ImageOff,
    title: "Cek Metadata Foto",
    desc: "Lihat data GPS/perangkat tersembunyi di foto sebelum dibagikan.",
  },
  {
    href: "/tools/2fa-simulator",
    icon: ShieldHalf,
    title: "Simulator 2FA (TOTP)",
    desc: "Lihat cara kerja kode 6 digit aplikasi authenticator secara langsung.",
  },
  {
    href: "/tools/ai-assistant",
    icon: Sparkles,
    title: "AI Security Assistant",
    desc: "Analisis pesan mencurigakan atau tanya jawab seputar materi belajar.",
  },
];

export default function ToolsHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Wrench className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Tools</h1>
          <p className="text-sm text-slate-400">
            Semua tools interaktif CyberAman — coba langsung, masuk untuk menyimpan
            progres dan dapat poin.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ href, icon: Icon, title, desc, badge }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition hover:border-emerald-500/50 hover:bg-slate-900">
              <div className="flex items-start justify-between">
                <Icon className="h-7 w-7 text-emerald-400" aria-hidden />
                {badge && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    {badge}
                  </span>
                )}
              </div>
              <h2 className="mt-3 font-semibold text-white">{title}</h2>
              <p className="mt-1.5 text-sm text-slate-400">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
