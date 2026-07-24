export type FootprintItem = {
  id: string;
  label: string;
  hint: string;
};

// Each item is phrased as a good security practice.
// Answering "Ya" (yes, I already do this) earns 1 point.
export const footprintChecklist: FootprintItem[] = [
  {
    id: "unique-passwords",
    label: "Saya menggunakan kata sandi yang berbeda untuk setiap akun penting.",
    hint: "Satu kata sandi bocor tidak akan membuka semua akun lain Anda.",
  },
  {
    id: "2fa-enabled",
    label:
      "Saya mengaktifkan autentikasi dua faktor (2FA/OTP) di email dan media sosial utama.",
    hint: "Menambah lapisan keamanan meski kata sandi Anda bocor.",
  },
  {
    id: "check-app-permissions",
    label:
      "Saya memeriksa izin aplikasi (kamera, lokasi, kontak) sebelum menginstal aplikasi baru.",
    hint: "Banyak aplikasi meminta izin lebih dari yang sebenarnya dibutuhkan.",
  },
  {
    id: "private-social-location",
    label:
      "Saya tidak membagikan lokasi real-time atau alamat rumah secara publik di media sosial.",
    hint: "Informasi lokasi bisa dimanfaatkan untuk penipuan atau kejahatan fisik.",
  },
  {
    id: "review-privacy-settings",
    label:
      "Saya pernah meninjau pengaturan privasi akun media sosial saya dalam 6 bulan terakhir.",
    hint: "Platform sering mengubah default privasi tanpa pemberitahuan jelas.",
  },
  {
    id: "verify-before-click",
    label:
      "Saya memverifikasi pengirim/domain sebelum mengklik tautan dari email atau pesan singkat.",
    hint: "Kebiasaan dasar ini mencegah sebagian besar serangan phishing.",
  },
  {
    id: "public-wifi-caution",
    label:
      "Saya menghindari transaksi perbankan saat memakai WiFi publik tanpa VPN.",
    hint: "Jaringan publik lebih rentan disadap oleh pihak tidak bertanggung jawab.",
  },
  {
    id: "backup-data",
    label: "Saya rutin mencadangkan (backup) data penting saya.",
    hint: "Melindungi Anda dari kehilangan data akibat serangan ransomware atau kerusakan perangkat.",
  },
  {
    id: "update-software",
    label:
      "Saya memperbarui aplikasi dan sistem operasi perangkat saya secara berkala.",
    hint: "Pembaruan sering kali menambal celah keamanan yang sudah diketahui publik.",
  },
  {
    id: "search-own-name",
    label:
      "Saya pernah mencari nama saya sendiri di internet untuk tahu informasi apa yang bisa diakses publik.",
    hint: "Langkah pertama mengelola jejak digital adalah mengetahui apa yang sudah tersebar.",
  },
];
