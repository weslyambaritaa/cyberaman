# Ringkasan Keamanan — Bahan Sesi Q&A Juri

Dokumen ini bukan bagian dari README (yang ditujukan untuk juri baca sendiri),
tapi catatan persiapan **untuk kamu** menjawab pertanyaan juri soal aspek
keamanan aplikasi ini secara teknis dan percaya diri.

## Daftar lengkap langkah keamanan yang diimplementasikan

| # | Langkah | Di mana | Kenapa |
|---|---|---|---|
| 1 | Row Level Security di semua tabel | `supabase/schema.sql` | Isolasi data per-user dipaksakan di level database, bukan cuma di kode aplikasi — jadi tetap aman meski ada bug di frontend. |
| 2 | Poin & lencana lewat fungsi `security definer` | `add_points()`, `award_badge()` di `schema.sql` | Klien tidak pernah mengirim "tambahkan 1000 poin" — klien cuma bisa memicu aksi (`rpc()`), perhitungan sebenarnya terjadi di database. Anti-cheat by design. |
| 3 | Password tidak pernah disimpan/dikirim mentah | `PasswordChecker.tsx` | `zxcvbn` jalan di browser; hanya skor 0-4 yang dikirim lewat Server Action. |
| 4 | Validasi input server-side dengan Zod | `src/lib/actions/auth.ts`, `gamification.ts` | Validasi HTML (`required`, `minLength`) gampang dilewati lewat DevTools/curl — Zod memvalidasi ulang di server sebagai sumber kebenaran, termasuk cek bahwa `sampleId`/`module_slug` yang dikirim memang ID yang valid (bukan string sembarangan). |
| 5 | Rate limiting | `src/lib/rate-limit.ts` | Membatasi percobaan signup (5/menit per IP), login (10/menit per IP), dan aksi gamifikasi (40/menit per user) — mencegah brute force & spam otomatis. |
| 6 | Security headers | `next.config.ts` | CSP, X-Frame-Options: DENY (anti clickjacking), X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy (kunci akses kamera/mic/lokasi yang memang tidak dipakai app), Strict-Transport-Security. |
| 7 | Proteksi route di level proxy | `src/proxy.ts` | `/dashboard` dicegat sebelum request sampai ke halaman — bukan cuma disembunyikan di UI. |
| 8 | Graceful degradation | `src/lib/queries.ts` (`safely()`) | Kalau Supabase down/misconfigured, situs tetap tampil (mode "belum login"), bukan crash 500 — penting untuk skor "Fungsionalitas & Performa: bug-free". |
| 9 | Kata sandi tidak pernah "dicek" ke pihak lain secara telanjang | `src/lib/pwned-check.ts` | Cek kebocoran password memakai model k-anonymity HIBP — hanya 5 karakter awal SHA-1 hash yang dikirim ke API publik, cukup untuk verifikasi tanpa pernah membocorkan kata sandi/hash penuh. |
| 10 | Foto tidak pernah diunggah ke server | `MetadataChecker.tsx` | Parsing EXIF & pembuatan versi "bersih" (lewat canvas) 100% terjadi di browser pengguna. |
| 11 | AI endpoint di-gate & di-rate-limit | `src/app/api/ai-assistant/route.ts`, `src/app/api/roleplay/route.ts` | Wajib login (mencegah penyalahgunaan anonim menghabiskan kuota API gratis), dibatasi 10-20 request/menit per user, dan `GEMINI_API_KEY` hanya pernah dibaca di server — tidak pernah dikirim/terekspos ke browser. |
| 12 | Pemindai Link tidak menyimpan URL lengkap | `supabase/schema.sql` (`url_scans`) | Hanya domain & tingkat risiko yang disimpan, bukan URL penuh — URL asli phishing kadang membawa query string berisi data pribadi korban di dunia nyata. |
| 13 | Simulasi Roleplay tidak menyimpan transkrip | `supabase/schema.sql` (`roleplay_sessions`) | Percakapan roleplay hanya hidup di state klien selama sesi berlangsung; yang disimpan ke database cuma skor akhir & skenario, bukan isi chat-nya. |
| 14 | Google Safe Browsing key opsional & fail-open ke heuristik | `src/app/api/url-scan/route.ts` | Kalau API key tidak diset atau API-nya gagal dihubungi, tool tetap memberi hasil lengkap dari mesin heuristik sendiri — tidak ada single point of failure. |

## Kalau juri tanya...

**"Kenapa poin tidak bisa dimanipulasi lewat DevTools?"**
> Karena kolom `points` di tabel `profiles` tidak pernah di-`UPDATE` langsung dari klien. Satu-satunya jalan menambah poin adalah memanggil fungsi Postgres `add_points()` yang jalan dengan hak akses `security definer` — logikanya (berapa poin, kapan badge di-unlock) sepenuhnya di server, klien cuma "meminta" tanpa bisa menentukan hasilnya.

**"Apakah password sempat tersimpan di database?"**
> Tidak. Tool cek kekuatan password menghitung skornya 100% di browser pakai library `zxcvbn`. Yang dikirim ke server dan disimpan hanya angka skor (0-4) di tabel `password_checks` — password aslinya tidak pernah meninggalkan browser pengguna.

**"Kenapa rate limiting-nya in-memory, bukan Redis/Upstash?"**
> Untuk skala traffic kompetisi ini, in-memory sudah cukup dan tidak butuh infrastruktur/API key tambahan. Kami sadar keterbatasannya: state reset kalau server restart dan tidak sinkron across multiple instance kalau di-deploy ke platform serverless multi-instance — untuk versi produksi dengan traffic besar, langkah berikutnya adalah pindah ke shared store seperti Upstash Ratelimit.

**"Kenapa Row Level Security penting, bukan cuma cek di kode aplikasi?"**
> Karena kalau hanya divalidasi di kode aplikasi (misal Next.js API route), satu bug atau endpoint yang lupa dicek bisa membocorkan data user lain. Dengan RLS, aturan itu ditegakkan oleh database itu sendiri untuk setiap query, dari jalur mana pun query itu datang — jadi ada lapisan pertahanan independen dari kode aplikasi.

**"Apakah aplikasi ini vulnerable terhadap SQL Injection?"**
> Tidak — kami tidak menulis raw SQL string dari input user. Semua query lewat Supabase client library yang memakai parameterized query di baliknya, dan semua fungsi Postgres kami (`add_points`, `award_badge`) hanya menerima parameter bertipe (integer/text), bukan string SQL mentah.

## Yang jujur belum ideal (siap-siap kalau ditanya "kenapa belum...")

- **Custom SMTP belum dipasang** — "Confirm email" dimatikan supaya juri bisa langsung pakai akun demo tanpa hambatan verifikasi. Untuk produksi jangka panjang, ini akan dinyalakan kembali dengan SMTP provider (Resend/Postmark) supaya tidak kena rate limit email bawaan Supabase.
- **Rate limiter in-memory**, bukan distributed — sudah dijelaskan di atas, trade-off sadar demi kesederhanaan submission kompetisi.
- **CSP masih mengizinkan `'unsafe-inline'`** untuk script & style — karena Next.js App Router menyuntik script hydration inline dan Tailwind menyuntik style tag inline. CSP yang benar-benar strict butuh sistem nonce per-request yang lebih kompleks; untuk sekarang headers lain (X-Frame-Options, dsb) tetap aktif penuh sebagai lapisan pertahanan.
