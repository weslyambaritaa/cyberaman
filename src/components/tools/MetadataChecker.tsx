"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Camera, Calendar, ShieldCheck, Download, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { recordMetadataCheck } from "@/lib/actions/gamification";

type ParsedMetadata = {
  latitude?: number;
  longitude?: number;
  Make?: string;
  Model?: string;
  Software?: string;
  DateTimeOriginal?: Date;
  ImageWidth?: number;
  ImageHeight?: number;
};

export function MetadataChecker({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ParsedMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<File | null>(null);

  async function handleFile(file: File) {
    fileRef.current = file;
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setMetadata(null);
    setSaved(false);
    setLoading(true);

    try {
      const exifr = (await import("exifr")).default;
      const tags: ParsedMetadata = (await exifr.parse(file, { gps: true })) ?? {};
      setMetadata(tags);

      if (isLoggedIn) {
        startTransition(async () => {
          await recordMetadataCheck(Boolean(tags.latitude && tags.longitude));
          setSaved(true);
        });
      }
    } catch (error) {
      console.warn("Gagal membaca EXIF (file mungkin corrupt/format tidak didukung):", error);
      setMetadata({});
    } finally {
      setLoading(false);
    }
  }

  async function downloadClean() {
    if (!fileRef.current) return;
    const img = new Image();
    img.src = URL.createObjectURL(fileRef.current);
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")?.drawImage(img, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aman-${fileName ?? "foto.jpg"}`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/jpeg", 0.95);
  }

  const hasGps = Boolean(metadata?.latitude && metadata?.longitude);
  const hasAnyMetadata =
    metadata &&
    (metadata.Make || metadata.Model || metadata.Software || metadata.DateTimeOriginal || hasGps);

  return (
    <div className="space-y-6">
      <Card>
        {/* sr-only (not `hidden`) so this stays keyboard-focusable — Tab
            reaches it, Enter/Space opens the file picker natively, and the
            label below shows a visible focus ring via peer-focus-visible. */}
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          className="peer sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <label
          htmlFor="photo-input"
          className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-slate-700 py-10 text-center hover:border-emerald-500/50 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500"
        >
          <Upload className="h-8 w-8 text-slate-400" aria-hidden />
          <span className="text-sm font-medium text-slate-300">
            Klik untuk pilih foto, atau seret ke sini
          </span>
          <span className="text-xs text-slate-400">JPEG/PNG dari kamera HP biasanya paling lengkap metadatanya</span>
        </label>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Foto diproses 100% di browser-mu — tidak pernah diunggah ke server mana pun.
        </p>
      </Card>

      {previewUrl && (
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a static/remote asset Next's Image optimizer applies to */}
            <img
              src={previewUrl}
              alt="Pratinjau foto yang diunggah"
              className="h-40 w-40 shrink-0 rounded-lg object-cover"
            />

            <div className="flex-1">
              {loading ? (
                <p className="text-sm text-slate-400">Membaca metadata...</p>
              ) : !hasAnyMetadata ? (
                <p className="text-sm text-slate-400">
                  Tidak ditemukan metadata EXIF di file ini — kemungkinan sudah pernah
                  diproses, di-screenshot, atau memang tidak menyertakan data tambahan.
                </p>
              ) : (
                <div className="space-y-2 text-sm">
                  {hasGps && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-red-300">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      <div>
                        <p className="font-medium">Lokasi GPS ditemukan!</p>
                        <p className="mt-0.5 text-red-300/80">
                          Kalau foto ini dibagikan apa adanya, orang lain bisa tahu persis
                          di mana foto ini diambil.{" "}
                          <a
                            href={`https://www.google.com/maps?q=${metadata?.latitude},${metadata?.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Lihat lokasi di peta
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  {metadata?.Make && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Camera className="h-4 w-4 text-slate-400" />
                      Perangkat: {metadata.Make} {metadata.Model ?? ""}
                    </div>
                  )}
                  {metadata?.DateTimeOriginal && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      Diambil: {new Date(metadata.DateTimeOriginal).toLocaleString("id-ID")}
                    </div>
                  )}
                  {metadata?.Software && (
                    <p className="text-slate-400">Software: {metadata.Software}</p>
                  )}
                </div>
              )}

              <button
                onClick={downloadClean}
                disabled={loading}
                className="mt-4 flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Unduh Versi Aman (Tanpa Metadata)
              </button>

              {isLoggedIn ? (
                saved && (
                  <p className="mt-3 text-xs text-emerald-400">
                    {isPending ? "Menyimpan..." : "Progres tersimpan."}
                  </p>
                )
              ) : (
                <p className="mt-3 text-xs text-slate-400">
                  <a href="/login" className="font-medium text-emerald-400 hover:underline">
                    Masuk
                  </a>{" "}
                  untuk menyimpan progres dan dapat poin.
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
