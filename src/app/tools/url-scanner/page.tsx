import { Link2 } from "lucide-react";
import { UrlScanner } from "@/components/tools/UrlScanner";
import { getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Pemindai Link — CyberAman" };

export default async function UrlScannerPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Link2 className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Pemindai Link</h1>
          <p className="text-sm text-slate-400">
            Cek link apa pun — bukan contoh karangan — untuk pola mencurigakan
            (typosquatting, domain palsu, dll), plus verifikasi opsional ke database
            ancaman nyata Google Safe Browsing.
          </p>
        </div>
      </div>

      <UrlScanner isLoggedIn={Boolean(user)} />
    </div>
  );
}
