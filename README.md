# CyberAman

**Masalah:** mayoritas insiden keamanan digital di Indonesia — akun dibobol,
data pribadi bocor, korban penipuan online — bukan disebabkan oleh serangan
canggih, tapi oleh kebiasaan dasar yang tidak pernah diajarkan secara
praktis: kata sandi lemah, tidak bisa mengenali phishing, dan tidak sadar
seberapa banyak jejak digital yang mereka tinggalkan.

**Solusi:** CyberAman adalah platform edukasi keamanan siber yang tidak
sekadar memberi bacaan, tapi memberi **tools interaktif** untuk langsung
mempraktikkan dan mengukur kebiasaan digital pengguna sendiri — lalu
mendorong keberlanjutan lewat gamifikasi (poin, lencana, papan skor).

Dibuat untuk **Lomba Web Development FTI Festival 2026** (Tema: *PIXEL —
Protection Information Exploration in the Digital Era*). Subtema yang
diangkat:
- Keamanan Siber dan Perlindungan Informasi Digital
- Privasi Data dan Perlindungan Identitas Digital
- Artificial Intelligence untuk Keamanan Informasi
- Platform Pembelajaran Digital yang Aman dan Inovatif

## Fitur

**Tools (`/tools`):**
- **Cek Kekuatan Kata Sandi** — analisis kekuatan kata sandi memakai `zxcvbn` (dihitung
  sepenuhnya di sisi klien, kata sandi asli tidak pernah dikirim ke server), plus cek
  apakah kata sandi itu pernah muncul di kebocoran data publik lewat API gratis
  Have I Been Pwned (k-anonymity — hanya 5 karakter hash yang dikirim).
- **Simulasi Phishing** — kuis interaktif menebak pesan email/SMS/WhatsApp asli vs. phishing,
  lengkap dengan penjelasan pola penipuan.
- **Checklist Jejak Digital** — 10 pertanyaan reflektif untuk mengukur kebiasaan
  privasi digital, dengan rekomendasi personal.
- **Cek Metadata Foto** — baca data EXIF (GPS, perangkat, waktu) yang ter-embed di
  foto, 100% diproses di browser (foto tidak pernah diunggah), plus tombol unduh
  versi foto tanpa metadata.
- **Simulator 2FA (TOTP)** — visualisasi langsung bagaimana kode 6 digit aplikasi
  authenticator dihasilkan (algoritma TOTP asli, bukan simulasi angka acak).
- **AI Security Assistant** — analisis pesan mencurigakan untuk red flags phishing,
  atau tanya jawab seputar materi modul belajar, ditenagai Gemini API.

**Lainnya:**
- **Skor Keamanan Digital** — agregasi hasil 3 tools penilaian jadi satu skor 0-100
  di dashboard, dengan breakdown per komponen.
- **Modul Belajar** — materi singkat seputar keamanan siber, privasi data, dan
  pemanfaatan AI yang etis.
- **Gamifikasi** — poin, lencana, dan papan skor untuk mendorong literasi digital
  berkelanjutan.
- **Autentikasi & keamanan** — akun via Supabase Auth, Row Level Security di setiap
  tabel, validasi form di klien & server, rate limiting, security headers.

## Teknologi (Stack)

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Server Actions)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — Auth (Postgres) + Database + Row Level Security
- [zxcvbn](https://github.com/dropbox/zxcvbn) — estimasi kekuatan kata sandi
- [exifr](https://github.com/MikeKovarik/exifr) — parsing metadata EXIF di browser
- [otpauth](https://github.com/hectorm/otpauth) — implementasi algoritma TOTP
- [Have I Been Pwned API](https://haveibeenpwned.com/API/v3#PwnedPasswords) — cek kebocoran kata sandi (gratis, k-anonymity)
- [Google Gemini API](https://ai.google.dev/) — AI Security Assistant
- [Zod](https://zod.dev) — validasi input server-side
- [lucide-react](https://lucide.dev) — ikon

## Menjalankan secara lokal

1. Clone repository lalu masuk ke foldernya:
   ```bash
   git clone <url-repository-ini>
   cd cyberaman
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat project di [supabase.com](https://supabase.com), lalu jalankan isi file
   [`supabase/schema.sql`](./supabase/schema.sql) di **SQL Editor** project tersebut.
   File ini membuat seluruh tabel, kebijakan Row Level Security, serta fungsi
   untuk poin & lencana.

4. Salin `.env.local.example` menjadi `.env.local` dan isi dengan kredensial
   project Supabase kamu (Project Settings → API):
   ```bash
   cp .env.local.example .env.local
   ```

5. (Opsional) Untuk fitur **AI Security Assistant**, tambahkan `GEMINI_API_KEY`
   di `.env.local` — dapatkan gratis di [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
   Tanpa key ini, seluruh situs tetap berjalan normal; hanya tool tersebut yang
   menampilkan pesan "belum dikonfigurasi".

6. Jalankan mode pengembangan:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000).

## Akun demo

Untuk keperluan penilaian juri, gunakan akun berikut (progres sudah terisi:
beberapa modul selesai, tools penilaian sudah dicoba, dan seluruh 5 lencana
sudah unlocked):

| Email | Password |
|---|---|
| `juri.demo@cyberaman.id` | `DemoJuri2026!` |

> Catatan: "Confirm email" dimatikan di pengaturan Supabase Auth project ini
> khusus untuk kebutuhan submission kompetisi (supaya juri bisa langsung
> login tanpa proses verifikasi email). Untuk penggunaan produksi jangka
> panjang, disarankan menyalakan kembali fitur ini atau menghubungkan
> custom SMTP provider.

## Catatan Keamanan

Karena topik kompetisi ini adalah keamanan informasi, praktik keamanan
berikut sengaja diterapkan langsung di dalam kode aplikasi (bukan cuma jadi
materi bacaan di modul belajar):

- **Row Level Security (RLS) di semua tabel** — setiap user hanya bisa
  membaca/mengubah datanya sendiri di level database, bukan cuma dicegah di
  UI. Lihat kebijakan lengkapnya di [`supabase/schema.sql`](./supabase/schema.sql).
- **Poin & lencana anti-cheat** — logika penambahan poin dan pemberian
  lencana (`add_points`, `award_badge`) dijalankan sebagai fungsi Postgres
  `security definer`, dipanggil lewat `supabase.rpc(...)`. Klien tidak
  pernah bisa mengubah kolom `points` secara langsung — semua perhitungan
  terjadi di sisi database, sehingga tidak bisa dimanipulasi lewat DevTools
  atau request palsu.
- **Kata sandi tidak pernah disimpan mentah** — tool "Cek Kekuatan Kata
  Sandi" menghitung skor sepenuhnya di browser memakai `zxcvbn`; yang
  dikirim ke server hanya angka skornya (0–4), bukan kata sandi aslinya.
- **Validasi form di klien & server** — setiap Server Action (`src/lib/actions/`)
  memvalidasi input-nya sendiri di sisi server (bukan hanya mengandalkan
  atribut HTML `required`/`minLength` di klien), karena validasi klien selalu
  bisa dilewati.
- **Halaman terproteksi dijaga di level proxy**, bukan cuma disembunyikan di
  UI — `src/proxy.ts` memeriksa sesi sebelum request sampai ke halaman
  `/dashboard`.

## Struktur folder

```
src/
  app/                  Route pages (App Router)
    tools/               Hub + 6 tools interaktif
    api/ai-assistant/    Route handler server-side untuk Gemini API
    learn/               Modul belajar + halaman detail
    dashboard/           Skor keamanan, poin, lencana, progres
    leaderboard/         Papan skor publik
    login/, signup/       Autentikasi
  components/
    layout/              Navbar, Footer
    tools/                Komponen client untuk tiap tools
    learn/, dashboard/    Komponen pendukung
    auth/                 Form login/signup
    ui/                   Komponen dasar (Card, ProgressBar)
  lib/
    supabase/             Klien Supabase (browser & server)
    actions/              Server Actions (auth, gamifikasi)
    content/               Data statis (soal phishing, checklist, modul)
    queries.ts             Query baca data (server-side)
    rate-limit.ts          Rate limiter in-memory
    pwned-check.ts          Client-side check ke HIBP Pwned Passwords
    types.ts               Tipe TypeScript bersama
  proxy.ts               Proteksi route + refresh sesi (proxy.ts, bukan middleware.ts — konvensi Next.js 16)
supabase/
  schema.sql              Skema database, RLS, & fungsi poin/lencana
SECURITY.md              Catatan keamanan untuk sesi Q&A (bukan bagian penilaian dokumen ini)
```

## Deployment

Aplikasi ini bisa di-deploy ke platform hosting apa pun yang mendukung Next.js
(disarankan [Vercel](https://vercel.com)). Setelah deploy, tambahkan environment
variable berikut (sama seperti di `.env.local`) pada pengaturan project di
platform hosting: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
dan `GEMINI_API_KEY` (opsional, untuk AI Security Assistant).
