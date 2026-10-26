type GeminiErrorLike = {
  status?: unknown;
};

export function getGeminiErrorResponse(error: unknown) {
  const providerStatus =
    typeof error === "object" && error !== null && "status" in error
      ? (error as GeminiErrorLike).status
      : undefined;

  const status = typeof providerStatus === "number" ? providerStatus : null;

  // Log only the upstream status. The SDK error can include request details,
  // so avoid copying its raw message into hosting logs or the client response.
  console.error("Gemini API request failed", { status });

  if (status === 400) {
    return {
      status: 400,
      error: "Gemini menolak permintaan ini. Coba ringkas atau ubah teksnya.",
    };
  }

  if (status === 401) {
    return {
      status: 502,
      error: "Kunci Gemini ditolak. Admin perlu memeriksa GEMINI_API_KEY di hosting.",
    };
  }

  if (status === 403) {
    return {
      status: 502,
      error: "Project Gemini tidak memiliki akses ke API. Periksa izin dan status project di Google AI Studio.",
    };
  }

  if (status === 404) {
    return {
      status: 502,
      error: "Model Gemini tidak tersedia untuk permintaan ini. Periksa konfigurasi model di server.",
    };
  }

  if (status === 429) {
    return {
      status: 429,
      error: "Kuota atau batas permintaan Gemini sedang tercapai. Tunggu sebentar lalu coba lagi.",
    };
  }

  if (status === 503 || status === 504 || status === null || status >= 500) {
    return {
      status: 502,
      error: "Layanan Gemini sedang tidak tersedia. Coba lagi sebentar lagi.",
    };
  }

  return {
    status: 502,
    error: "Gemini gagal memproses permintaan. Admin dapat memeriksa status error di log hosting.",
  };
}
