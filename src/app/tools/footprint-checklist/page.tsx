import { Search } from "lucide-react";
import { FootprintChecklist } from "@/components/tools/FootprintChecklist";
import { footprintChecklist } from "@/lib/content/footprint-checklist";
import { getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Checklist Jejak Digital — CyberAman" };

export default async function FootprintChecklistPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Search className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Checklist Jejak Digital</h1>
          <p className="text-sm text-slate-400">
            Jawab 10 pertanyaan reflektif untuk mengukur seberapa aman kebiasaan
            digitalmu sehari-hari.
          </p>
        </div>
      </div>

      <FootprintChecklist items={footprintChecklist} isLoggedIn={Boolean(user)} />
    </div>
  );
}
