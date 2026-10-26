# Protokol Validasi Awal CyberAman

Dokumen ini adalah rencana pengujian, bukan laporan hasil. Isi bagian hasil hanya setelah kegiatan benar-benar dilakukan. Jangan membuat angka atau kutipan peserta untuk melengkapi laporan.

## Tujuan

Menguji apakah pelajar membutuhkan latihan praktis untuk mengenali pesan phishing, memahami penjelasan setelah menjawab, dan dapat menggunakan simulasi CyberAman tanpa kebingungan.

## Pertanyaan yang diuji

1. Apakah peserta dapat menyebutkan tanda risiko pada contoh pesan sebelum dan sesudah memakai simulasi?
2. Apakah penjelasan jawaban membantu peserta memahami alasan pesan ditandai phishing atau aman?
3. Bagian mana yang membingungkan, terasa tidak realistis, atau perlu diperbaiki?
4. Apakah peserta menyelesaikan alur latihan tanpa bantuan fasilitator?

## Metode pilot yang disarankan

- Rekrut 5–8 pelajar secara sukarela untuk uji formatif awal. Jumlah kecil ini untuk menemukan masalah penggunaan, bukan untuk menggeneralisasi hasil ke semua pelajar.
- Jelaskan tujuan uji, perkiraan waktu, data yang dicatat, dan bahwa peserta boleh berhenti kapan saja.
- Jangan meminta nama lengkap, nomor telepon, email, akun sekolah, kata sandi, OTP, atau tangkapan layar percakapan pribadi.
- Minta peserta mengerjakan simulasi phishing satu kali tanpa bantuan. Catat skor awal dan apakah mereka dapat menyelesaikan alur.
- Minta peserta mengulang simulasi setelah membaca penjelasan. Catat skor pengulangan secara terpisah.
- Lakukan tanya jawab singkat tentang kejelasan, relevansi contoh, rasa aman, dan saran perbaikan.
- Catat pengamatan secara anonim menggunakan kode peserta, misalnya P01. Hapus catatan mentah setelah rangkuman dibuat sesuai persetujuan peserta.

## Metrik dan batas interpretasi

| Metrik | Cara menghitung | Batas interpretasi |
| --- | --- | --- |
| Skor percobaan pertama | Jawaban benar dibagi jumlah soal | Gambaran awal pada contoh simulasi, bukan ukuran kemampuan umum |
| Skor pengulangan | Jawaban benar saat simulasi diulang | Bisa meningkat karena peserta mengingat jawaban dan penjelasan |
| Penyelesaian alur | Peserta menuntaskan simulasi tanpa bantuan | Menilai kemudahan alur, bukan dampak pembelajaran jangka panjang |
| Masukan pengguna | Tema dari jawaban wawancara singkat | Laporkan sebagai temuan pilot, tanpa mengklaim mewakili semua pelajar |

Jangan menyebut selisih skor sebagai bukti bahwa CyberAman menyebabkan peningkatan kemampuan. Untuk klaim lebih kuat, lakukan pengujian lanjutan dengan soal setara yang berbeda, lebih banyak peserta, dan prosedur yang konsisten.

## Pertanyaan wawancara singkat

1. Menurutmu, tanda apa yang paling membantu membedakan pesan berisiko?
2. Apakah alasan setelah setiap jawaban mudah dipahami? Bagian mana yang belum jelas?
3. Apakah contoh pesannya terasa relevan dengan pesan yang biasa kamu temui? Mengapa?
4. Apakah kamu tahu langkah aman yang akan dilakukan setelah latihan ini?
5. Jika boleh mengubah satu hal pada simulasi, apa yang akan kamu ubah?

## Catatan hasil pilot

Lengkapi setelah pengujian nyata.

- Tanggal dan konteks:
- Jumlah peserta dan kriteria umum (tanpa identitas pribadi):
- Perangkat yang digunakan:
- Median skor percobaan pertama:
- Median skor pengulangan:
- Jumlah peserta yang menyelesaikan tanpa bantuan:
- Temuan usability yang paling sering muncul:
- Perubahan produk yang dibuat berdasarkan temuan:
- Keterbatasan dan langkah validasi berikutnya:

## Peta dampak yang dituju

| Fitur | Manfaat pengguna | Dampak sosial yang dituju | SDG |
| --- | --- | --- | --- |
| Simulasi phishing dan penjelasan jawaban | Berlatih mengenali pengirim, tautan, dan tekanan waktu | Literasi keamanan digital pelajar yang lebih baik | SDG 4: Pendidikan Berkualitas |
| Modul belajar singkat | Memahami kebiasaan dasar perlindungan informasi | Akses pembelajaran digital praktis | SDG 4: Pendidikan Berkualitas |
| AI Security Assistant | Mendapat penjelasan awal tentang sinyal risiko | Dukungan belajar yang interaktif, dengan verifikasi manusia | SDG 4: Pendidikan Berkualitas |

## Technology justification ringkas

- **Next.js dan TypeScript:** merangkai halaman edukasi, alat interaktif, dan endpoint server dalam satu aplikasi web.
- **Supabase:** mengelola autentikasi dan progres akun dengan kebijakan akses database.
- **Pemrosesan browser untuk kata sandi dan metadata foto:** mengurangi kebutuhan mengirim input sensitif ke server.
- **Gemini API untuk fitur AI:** memberi pengalaman tanya jawab dan roleplay; fitur ini memerlukan koneksi dan kunci API server. Hasil AI dapat keliru dan bukan pengganti verifikasi sumber resmi.
- **Tailwind CSS:** menerapkan sistem tampilan responsif melalui utility class.

Cantumkan pula versi, lisensi, layanan pihak ketiga, serta aset yang benar-benar digunakan pada proposal final.
