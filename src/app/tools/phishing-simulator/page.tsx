import { Fish } from "lucide-react";
import { PhishingSimulator } from "@/components/tools/PhishingSimulator";
import { phishingSamples } from "@/lib/content/phishing-samples";
import { getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Simulasi Phishing — CyberAman" };

export default async function PhishingSimulatorPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Fish className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Simulasi Phishing</h1>
          <p className="text-sm text-slate-400">
            Tebak apakah tiap pesan berikut adalah upaya phishing atau pesan yang aman.
          </p>
        </div>
      </div>

      <PhishingSimulator samples={phishingSamples} isLoggedIn={Boolean(user)} />
    </div>
  );
}
