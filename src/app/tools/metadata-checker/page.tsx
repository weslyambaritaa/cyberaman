import { ImageOff } from "lucide-react";
import { MetadataChecker } from "@/components/tools/MetadataChecker";
import { getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Cek Metadata Foto — CyberAman" };

export default async function MetadataCheckerPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <ImageOff className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Cek Metadata Foto</h1>
          <p className="text-sm text-slate-400">
            Lihat data tersembunyi (GPS, perangkat, waktu pengambilan) yang mungkin
            ter-embed di foto sebelum kamu membagikannya.
          </p>
        </div>
      </div>

      <MetadataChecker isLoggedIn={Boolean(user)} />
    </div>
  );
}
