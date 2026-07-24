import Link from "next/link";
import { Sparkles, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AiAssistant } from "@/components/tools/AiAssistant";
import { getCurrentUser } from "@/lib/queries";

export const metadata = { title: "AI Security Assistant — CyberAman" };

export default async function AiAssistantPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">AI Security Assistant</h1>
          <p className="text-sm text-slate-400">
            Tempel pesan mencurigakan untuk dianalisis red flags-nya, atau tanya
            apa saja seputar materi modul belajar CyberAman.
          </p>
        </div>
      </div>

      {user ? (
        <AiAssistant />
      ) : (
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <Lock className="h-8 w-8 text-slate-400" aria-hidden />
          <p className="text-sm text-slate-400">
            Fitur ini butuh akun supaya penggunaan AI tetap terkontrol dan tidak
            disalahgunakan.
          </p>
          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Masuk untuk mencoba
          </Link>
        </Card>
      )}
    </div>
  );
}
