import Link from "next/link";
import { ShieldAlert, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { RoleplaySimulator } from "@/components/tools/RoleplaySimulator";
import { getCurrentUser } from "@/lib/queries";

export const metadata = { title: "Simulasi Roleplay Penipu — CyberAman" };

export default async function RoleplayPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-center gap-3">
        <ShieldAlert className="h-8 w-8 text-emerald-400" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold text-white">Simulasi Roleplay Penipu</h1>
          <p className="text-sm text-slate-400">
            Ngobrol langsung dengan AI yang berperan sebagai penipu — latih insting
            waspadamu secara real-time, bukan cuma tebak-tebakan.
          </p>
        </div>
      </div>

      {user ? (
        <RoleplaySimulator />
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
