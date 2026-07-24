export type LearningModule = {
  slug: string;
  title: string;
  summary: string;
  minutesRead: number;
  subtheme: string;
  sections: { heading: string; body: string }[];
};

export const learningModules: LearningModule[] = [
  {
    slug: "dasar-keamanan-siber",
    title: "Dasar-Dasar Keamanan Siber",
    summary:
      "Kenali ancaman digital paling umum dan kebiasaan dasar untuk melindungi diri di internet.",
    minutesRead: 4,
    subtheme: "Keamanan Siber dan Perlindungan Informasi Digital",
    sections: [
      {
        heading: "Kenapa keamanan siber penting untuk semua orang?",
        body: "Keamanan siber bukan cuma urusan perusahaan besar atau pemerintah. Setiap orang yang punya akun email, media sosial, atau m-banking adalah target potensial. Data pribadi yang bocor bisa dipakai untuk penipuan, pencurian identitas, hingga pemerasan.",
      },
      {
        heading: "Ancaman yang paling sering ditemui",
        body: "Tiga ancaman paling umum di Indonesia: phishing (penipuan lewat pesan/email palsu), malware (perangkat lunak berbahaya yang menyusup lewat file/aplikasi tidak resmi), dan social engineering (manipulasi psikologis agar korban memberi informasi sendiri).",
      },
      {
        heading: "Kebiasaan dasar yang bisa langsung diterapkan",
        body: "Gunakan kata sandi unik per akun, aktifkan 2FA, jangan asal klik tautan, dan selalu perbarui aplikasi/OS. Empat kebiasaan sederhana ini sudah menutup sebagian besar celah yang biasa dieksploitasi penyerang.",
      },
    ],
  },
  {
    slug: "mengenali-phishing",
    title: "Mengenali Phishing Sebelum Terlambat",
    summary:
      "Pelajari pola-pola umum pesan phishing supaya tidak mudah terjebak modus penipuan digital.",
    minutesRead: 5,
    subtheme: "Keamanan Siber dan Perlindungan Informasi Digital",
    sections: [
      {
        heading: "Apa itu phishing?",
        body: "Phishing adalah upaya menipu seseorang agar memberikan informasi sensitif (kata sandi, data kartu, OTP) dengan menyamar sebagai pihak tepercaya — bank, e-commerce, bahkan instansi pendidikan.",
      },
      {
        heading: "Pola yang paling sering muncul",
        body: "Waspadai pesan dengan: tekanan waktu ('24 jam' atau akun akan diblokir), tautan dengan domain aneh/typo, permintaan data sensitif secara langsung, dan tawaran yang terlalu bagus untuk jadi kenyataan (hadiah undian mendadak).",
      },
      {
        heading: "Langkah verifikasi cepat",
        body: "Sebelum klik apa pun: cek domain pengirim, jangan pernah beri OTP ke siapa pun, dan jika ragu — hubungi pihak resmi lewat kanal resmi yang sudah kamu ketahui sendiri, bukan lewat nomor/tautan di pesan itu.",
      },
    ],
  },
  {
    slug: "privasi-dan-jejak-digital",
    title: "Privasi Data dan Jejak Digital",
    summary:
      "Pahami apa itu jejak digital dan bagaimana mengelolanya agar identitasmu tetap terlindungi.",
    minutesRead: 4,
    subtheme: "Privasi Data dan Perlindungan Identitas Digital",
    sections: [
      {
        heading: "Apa itu jejak digital?",
        body: "Jejak digital adalah semua data yang kamu tinggalkan saat beraktivitas online — mulai dari post media sosial, riwayat pencarian, sampai lokasi yang tercatat aplikasi. Sebagian besar tidak bisa dihapus sepenuhnya.",
      },
      {
        heading: "Kenapa perlu dikelola?",
        body: "Jejak digital yang tidak terkontrol bisa dimanfaatkan orang lain untuk profiling, penipuan yang dipersonalisasi, atau bahkan stalking. Semakin banyak info publik tentang kamu, semakin mudah kamu jadi target.",
      },
      {
        heading: "Cara mengelola jejak digital",
        body: "Tinjau pengaturan privasi akun secara berkala, batasi siapa yang bisa melihat postingan lama, hindari share lokasi real-time, dan sesekali cari nama sendiri di internet untuk tahu apa yang publik bisa lihat.",
      },
    ],
  },
  {
    slug: "password-dan-autentikasi",
    title: "Kata Sandi dan Autentikasi yang Aman",
    summary:
      "Bangun kebiasaan membuat dan mengelola kata sandi yang benar-benar sulit ditembus.",
    minutesRead: 3,
    subtheme: "Keamanan Siber dan Perlindungan Informasi Digital",
    sections: [
      {
        heading: "Kenapa kata sandi pendek itu berbahaya?",
        body: "Kata sandi pendek atau umum (seperti 'password123') bisa ditebak alat brute-force dalam hitungan detik. Panjang kata sandi jauh lebih penting daripada sekadar mengganti huruf dengan angka.",
      },
      {
        heading: "Ciri kata sandi yang kuat",
        body: "Idealnya minimal 12 karakter, kombinasi kata acak yang tidak berhubungan dengan data pribadimu (bukan tanggal lahir/nama), dan unik untuk setiap akun.",
      },
      {
        heading: "Manfaatkan pengelola kata sandi & 2FA",
        body: "Kamu tidak perlu menghafal semua kata sandi — gunakan password manager. Tambahkan 2FA sebagai lapisan kedua sehingga kata sandi yang bocor saja tidak cukup untuk membobol akunmu.",
      },
    ],
  },
  {
    slug: "ai-dan-etika-digital",
    title: "Memanfaatkan AI Secara Etis dan Aman",
    summary:
      "AI bisa membantu keamanan digital, tapi juga bisa disalahgunakan. Kenali batasannya.",
    minutesRead: 4,
    subtheme: "Artificial Intelligence untuk Keamanan Informasi",
    sections: [
      {
        heading: "AI sebagai alat bantu keamanan",
        body: "AI dipakai untuk mendeteksi pola phishing, menganalisis anomali login, hingga memindai kerentanan kode secara otomatis — mempercepat deteksi yang sebelumnya butuh analisis manual.",
      },
      {
        heading: "Risiko penyalahgunaan AI",
        body: "Di sisi lain, AI generatif juga dipakai penyerang untuk membuat pesan phishing yang lebih meyakinkan, deepfake suara/video, atau konten hasil AI penuh tanpa verifikasi manusia.",
      },
      {
        heading: "Prinsip penggunaan AI yang bertanggung jawab",
        body: "Selalu verifikasi output AI sebelum dipakai untuk keputusan penting, transparan soal penggunaan AI dalam suatu karya, dan jangan sepenuhnya menyerahkan keputusan sensitif (identitas, keuangan) hanya ke sistem otomatis.",
      },
    ],
  },
];
