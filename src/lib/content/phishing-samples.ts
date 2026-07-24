export type PhishingSample = {
  id: string;
  channel: "email" | "sms" | "whatsapp";
  from: string;
  subject?: string;
  body: string;
  isPhishing: boolean;
  explanation: string;
};

export const phishingSamples: PhishingSample[] = [
  {
    id: "bank-rekening-diblokir",
    channel: "sms",
    from: "BANK-INFO",
    body: "Rekening Anda TERBLOKIR karena aktivitas mencurigakan. Verifikasi sekarang di bit.ly/verif-bank-aman atau rekening ditutup permanen dalam 1x24 jam.",
    isPhishing: true,
    explanation:
      "Memakai tekanan waktu ('1x24 jam'), link pemendek yang bukan domain resmi bank, dan nomor pengirim non-resmi. Bank tidak pernah meminta verifikasi lewat link SMS seperti ini.",
  },
  {
    id: "paket-belum-sampai",
    channel: "whatsapp",
    from: "+62 831-xxxx-xxxx",
    body: "Halo kak, paket kakak tertahan di gudang karena alamat kurang lengkap. Lengkapi data di sini: paket-cek-resi.web.id/update agar tidak diretur.",
    isPhishing: true,
    explanation:
      "Domain '.web.id' asing yang meniru jasa ekspedisi, dikirim dari nomor pribadi (bukan akun resmi terverifikasi), dan meminta data pribadi di luar aplikasi resmi ekspedisi.",
  },
  {
    id: "reset-password-kampus",
    channel: "email",
    from: "no-reply@sim.kampusku.ac.id",
    subject: "Permintaan reset kata sandi SIM Akademik",
    body: "Kami menerima permintaan reset kata sandi untuk akun Anda. Jika ini benar Anda, klik tautan resmi di portal SIM Akademik dan ikuti instruksi di sana. Jika bukan Anda, abaikan email ini.",
    isPhishing: false,
    explanation:
      "Domain pengirim sesuai institusi resmi (.ac.id), tidak memaksa klik link asing, dan memberi opsi aman untuk mengabaikan jika bukan permintaan pengguna sendiri.",
  },
  {
    id: "hadiah-undian-tokped",
    channel: "sms",
    from: "0812xxxxxxx",
    body: "Selamat! Nomor Anda memenangkan undian E-Commerce senilai Rp25.000.000. Klaim hadiah dengan kirim data KTP & transfer pajak Rp150.000 ke rekening ini.",
    isPhishing: true,
    explanation:
      "Skema klasik: hadiah tak terduga, meminta transfer uang di muka ('pajak hadiah'), dan meminta foto KTP. Perusahaan resmi tidak pernah meminta biaya untuk mencairkan hadiah.",
  },
  {
    id: "invoice-langganan-streaming",
    channel: "email",
    from: "billing@streaming-resmi-id.com",
    subject: "Tagihan Anda gagal diproses — perbarui metode pembayaran",
    body: "Kartu Anda gagal ditagih. Klik tautan berikut untuk memasukkan ulang nomor kartu, tanggal kedaluwarsa, dan CVV agar langganan tidak terhenti: streaming-resmi-id-billing.com/update",
    isPhishing: true,
    explanation:
      "Domain pengirim dan domain link berbeda (typosquatting 'streaming-resmi-id-billing.com'), dan meminta CVV lengkap — layanan resmi tidak pernah meminta CVV lewat email.",
  },
  {
    id: "notifikasi-login-baru",
    channel: "email",
    from: "security@google.com",
    subject: "Login baru terdeteksi di perangkat Windows",
    body: "Kami mendeteksi login baru ke akun Anda dari perangkat Windows di Jakarta, Indonesia. Jika ini Anda, tidak perlu tindakan lebih lanjut. Jika bukan, segera amankan akun Anda melalui halaman keamanan akun resmi.",
    isPhishing: false,
    explanation:
      "Notifikasi keamanan standar yang tidak memaksa klik link mencurigakan dan mengarahkan ke 'halaman keamanan akun resmi' tanpa menyertakan link asing langsung di badan pesan.",
  },
  {
    id: "beasiswa-terbatas",
    channel: "whatsapp",
    from: "Admin Beasiswa Nasional",
    body: "Kamu terpilih menerima Beasiswa Nasional 2026! Kuota terbatas 24 jam. Isi data lengkap + upload foto KTP & buku rekening di link berikut: beasiswa-cair.info/daftar",
    isPhishing: true,
    explanation:
      "Nama pengirim generik tanpa verifikasi resmi, tekanan waktu, domain '.info' yang tidak terasosiasi resmi dengan lembaga pendidikan/pemerintah, dan meminta data rekening di muka.",
  },
  {
    id: "konfirmasi-pendaftaran-lomba",
    channel: "email",
    from: "panitia@ftifestival.id",
    subject: "Konfirmasi Pendaftaran Lomba Web Development",
    body: "Terima kasih telah mendaftar. Silakan konfirmasi ulang melalui Contact Person resmi yang tercantum di formulir pendaftaran dengan melampirkan bukti pembayaran. Jangan bertransaksi di luar kontak resmi panitia.",
    isPhishing: false,
    explanation:
      "Justru mengingatkan pengguna untuk hanya bertransaksi lewat kontak resmi — pola komunikasi yang transparan dan tidak meminta data sensitif langsung lewat email.",
  },
];
