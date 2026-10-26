import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Fish,
  ImageOff,
  KeyRound,
  Link2,
  Search,
  Shield,
  ShieldAlert,
  ShieldHalf,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const TOOLS = [
  {
    href: "/tools/phishing-simulator",
    icon: Fish,
    title: "Simulasi Phishing",
    desc: "Latih kemampuan membedakan pesan penipuan dari pesan yang aman, lalu pelajari tanda bahayanya.",
    highlight: true,
  },
  {
    href: "/tools/roleplay",
    icon: ShieldAlert,
    title: "Roleplay Penipu (AI)",
    desc: "Berlatih merespons modus penipuan dalam skenario percakapan yang interaktif.",
    highlight: true,
  },
  {
    href: "/tools/url-scanner",
    icon: Link2,
    title: "Pemindai Link",
    desc: "Periksa sinyal risiko pada tautan sebelum membukanya.",
  },
  {
    href: "/tools/password-checker",
    icon: KeyRound,
    title: "Cek Kata Sandi",
    desc: "Pelajari kekuatan kata sandi; kata sandi dihitung di browser dan tidak dikirim ke server.",
  },
  {
    href: "/tools/footprint-checklist",
    icon: Search,
    title: "Checklist Jejak Digital",
    desc: "Tinjau kebiasaan privasi dan dapatkan saran yang bisa langsung dilakukan.",
  },
  {
    href: "/tools/metadata-checker",
    icon: ImageOff,
    title: "Cek Metadata Foto",
    desc: "Periksa informasi tersembunyi pada foto langsung di browser.",
  },
  {
    href: "/tools/2fa-simulator",
    icon: ShieldHalf,
    title: "Simulator 2FA",
    desc: "Lihat bagaimana kode autentikator enam digit dibuat.",
  },
  {
    href: "/tools/ai-assistant",
    icon: Sparkles,
    title: "AI Security Assistant",
    desc: "Minta penjelasan tentang sinyal phishing dan materi keamanan digital.",
  },
];

const IMPACT_PATH = [
  {
    label: "Fitur",
    title: "Latihan phishing",
    description: "Pesan simulasi dengan alasan di balik tiap jawaban.",
  },
  {
    label: "Manfaat pengguna",
    title: "Mengenali tanda bahaya",
    description: "Pengguna berlatih memeriksa pengirim, tautan, dan tekanan waktu.",
  },
  {
    label: "Dampak sosial yang dituju",
    title: "Literasi digital yang lebih kuat",
    description: "Pelajar lebih siap mengambil keputusan aman saat menerima pesan.",
  },
  {
    label: "SDG",
    title: "SDG 4 · Pendidikan Berkualitas",
    description: "Mendukung pembelajaran keterampilan digital yang relevan dan berkelanjutan.",
  },
];

const VALIDATION_METRICS = [
  "Perubahan skor benar pada percobaan pertama dan pengulangan",
  "Tingkat penyelesaian simulasi dan modul belajar",
  "Masukan pengguna tentang kejelasan penjelasan dan kemudahan penggunaan",
];

export default function Home() {
  return (
    <div>
      <section className="relative flex min-h-[calc(100svh-72px)] items-center overflow-hidden border-b border-white/15 bg-cover bg-[position:72%_center] md:bg-right" style={{ backgroundImage: "url('/images/cyberaman-bg-hero.png')" }}>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/35" />
        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 py-20 md:px-6 md:py-24">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#7B66FF]/40 bg-[#673DE6]/15 px-3 py-1.5 text-xs font-semibold text-[#C4BFFF]">
              <BookOpen className="h-4 w-4" aria-hidden />
              Literasi digital untuk pelajar
            </p>
            <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-white md:text-6xl">
              Belajar mengenali penipuan digital dengan latihan yang bisa langsung dicoba.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#DEDEE2] md:text-lg">
              CyberAman membantu pelajar melatih kebiasaan aman di internet melalui simulasi, pemeriksaan praktis, dan materi singkat. Fokus kami: membuat keamanan digital lebih mudah dipelajari dan diterapkan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/tools/phishing-simulator" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#673DE6] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#7B66FF]">
                Mulai latihan phishing <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/learn" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 bg-black/40 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Lihat modul belajar
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-300">Gratis dicoba tanpa akun. Masuk untuk menyimpan progres belajar.</p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#101011]">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-4 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-6 md:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9D99FF]">Masalah yang ingin kami uji</p>
            <h2 className="mt-3 text-2xl font-semibold leading-tight text-white md:text-3xl">Pelajar sering menerima pesan digital, tetapi belum tentu punya ruang aman untuk berlatih memeriksa risikonya.</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Ini adalah hipotesis masalah CyberAman. Kami perlu mengujinya bersama pelajar melalui wawancara, survei singkat, dan uji penggunaan sebelum menyimpulkan kebutuhan atau dampaknya.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-white/10 bg-[#18181A]">
              <Fish className="h-6 w-6 text-[#9D99FF]" aria-hidden />
              <h3 className="mt-3 font-semibold text-white">Belajar lewat praktik</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">Simulasi phishing memberi kesempatan mencoba, melihat alasan jawaban, lalu mengulang latihan.</p>
            </Card>
            <Card className="border-white/10 bg-[#18181A]">
              <Shield className="h-6 w-6 text-[#9D99FF]" aria-hidden />
              <h3 className="mt-3 font-semibold text-white">Kebiasaan yang bisa diterapkan</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">Materi dan tools mengubah konsep keamanan menjadi langkah praktis untuk akun dan aktivitas sehari-hari.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-4 py-16 md:px-6 md:py-20">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9D99FF]">Ruang latihan CyberAman</p>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-4xl">Delapan tools untuk belajar menjaga diri di ruang digital</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">Mulai dari latihan mengenali penipuan, lalu gunakan tools lain untuk memperkuat kebiasaan keamanan dan privasi.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {TOOLS.map(({ href, icon: Icon, title, desc, highlight }) => (
            <Link key={href} href={href} className="group h-full rounded-xl focus-visible:outline-offset-4">
              <Card className={`h-full border-white/10 bg-[#18181A] p-5 transition group-hover:border-[#7B66FF]/50 group-hover:bg-[#222225] ${highlight ? "ring-1 ring-inset ring-[#7B66FF]/25" : ""}`}>
                <div className="flex items-center justify-between gap-3">
                  <Icon className="h-7 w-7 text-[#9D99FF]" aria-hidden />
                  {highlight && <span className="rounded-full bg-[#673DE6]/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#C4BFFF]">Latihan utama</span>}
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#C4BFFF]">Coba tool <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden /></span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#101011]">
        <div className="mx-auto max-w-[1360px] px-4 py-16 md:px-6 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9D99FF]">Jalur dampak · SDG 4</p>
            <h2 className="mt-3 text-2xl font-semibold text-white md:text-4xl">Dari fitur belajar menuju manfaat bagi pelajar</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">Hubungan ini adalah target dampak yang akan divalidasi, bukan klaim hasil yang sudah terbukti.</p>
          </div>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {IMPACT_PATH.map(({ label, title, description }, index) => (
              <li key={label} className="relative rounded-xl border border-white/10 bg-[#18181A] p-5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#673DE6]/30 text-xs font-bold text-[#C4BFFF]">{index + 1}</span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <h3 className="mt-1 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1360px] gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9D99FF]">Validasi awal</p>
          <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">Kami akan mengukur apakah latihan ini membantu.</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">Sebelum mengklaim peningkatan literasi, uji prototipe dengan pelajar, catat temuan tanpa mengumpulkan data sensitif, dan perbaiki alur berdasarkan masukan mereka.</p>
          <Link href="/tools/phishing-simulator" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C4BFFF] hover:underline">Coba simulasi yang akan diuji <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
        <Card className="border-white/10 bg-[#18181A]">
          <h3 className="font-semibold text-white">Indikator yang direncanakan</h3>
          <ul className="mt-4 space-y-3">
            {VALIDATION_METRICS.map((metric) => (
              <li key={metric} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#9D99FF]" aria-hidden />{metric}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">Skor latihan hanya indikator awal. Perbandingan skor dari soal yang sama bisa dipengaruhi efek mengingat, sehingga perlu dilengkapi observasi dan umpan balik pengguna.</p>
        </Card>
      </section>

      <section className="border-t border-white/10 bg-[#101011]">
        <div className="mx-auto flex max-w-[1360px] flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center md:px-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Mulai dari satu latihan singkat</h2>
            <p className="mt-2 text-sm text-slate-300">Coba simulasi phishing dan pelajari alasan di balik setiap jawaban.</p>
          </div>
          <Link href="/tools/phishing-simulator" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#673DE6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7B66FF]">Mulai latihan <ArrowRight className="h-4 w-4" aria-hidden /></Link>
        </div>
      </section>
    </div>
  );
}
