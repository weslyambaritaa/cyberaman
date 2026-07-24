import Link from "next/link";
import { Shield } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { signInAction } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Masuk — CyberAman" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <Shield className="h-10 w-10 text-emerald-400" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold text-white">Masuk ke CyberAman</h1>
      <p className="mt-1 text-sm text-slate-400">
        Lanjutkan progres belajar dan poin kamu.
      </p>

      <Card className="mt-8 w-full">
        <AuthForm
          action={signInAction}
          submitLabel="Masuk"
          fields={[
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            {
              name: "password",
              label: "Kata Sandi",
              type: "password",
              autoComplete: "current-password",
            },
          ]}
        />
      </Card>

      <p className="mt-6 text-sm text-slate-400">
        Belum punya akun?{" "}
        <Link href="/signup" className="font-medium text-emerald-400 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}
