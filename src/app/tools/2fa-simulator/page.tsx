import { ShieldHalf } from "lucide-react";
import { TotpSimulator } from "@/components/tools/TotpSimulator";

export const metadata = { title: "Simulator 2FA — CyberAman" };

export default function TotpSimulatorPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <ShieldHalf className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Simulator 2FA (TOTP)</h1>
          <p className="text-sm text-slate-400">
            Lihat langsung bagaimana kode 6 digit di aplikasi authenticator-mu
            (Google Authenticator, Authy, dll) sebenarnya dihasilkan.
          </p>
        </div>
      </div>

      <TotpSimulator />
    </div>
  );
}
