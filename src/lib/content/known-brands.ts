// Domain sah dari brand Indonesia yang paling sering ditiru untuk phishing —
// dipakai untuk deteksi typosquatting di URL Safety Scanner. Bukan daftar
// lengkap, cukup representatif untuk demo & kasus umum.
export const KNOWN_BRAND_DOMAINS = [
  "bni.co.id",
  "bca.co.id",
  "mandiri.co.id",
  "bri.co.id",
  "cimbniaga.co.id",
  "tokopedia.com",
  "shopee.co.id",
  "bukalapak.com",
  "gojek.com",
  "grab.com",
  "dana.id",
  "ovo.id",
  "telkomsel.com",
  "indihome.co.id",
  "pln.co.id",
  "pajak.go.id",
  "bpjs-kesehatan.go.id",
  "jne.co.id",
  "jntexpress.co.id",
];

export const SUSPICIOUS_TLDS = ["xyz", "top", "click", "buzz", "gq", "tk", "cf", "info", "loan", "win"];

export const URL_SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "s.id",
  "cutt.ly",
  "is.gd",
  "ow.ly",
];
