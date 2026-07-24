import Link from "next/link";
import { Shield } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { signUpAction } from "@/lib/actions/auth";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Daftar — CyberAman" };

export default function SignUpPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <Shield className="h-10 w-10 text-emerald-400" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold text-white">Buat Akun CyberAman</h1>
      <p className="mt-1 text-center text-sm text-slate-400">
        Gratis — simpan progres, kumpulkan poin, dan raih lencana.
      </p>

      <Card className="mt-8 w-full">
        <AuthForm
          action={signUpAction}
          submitLabel="Daftar"
          fields={[
            {
              name: "username",
              label: "Username",
              type: "text",
              autoComplete: "username",
              minLength: 3,
            },
            { name: "email", label: "Email", type: "email", autoComplete: "email" },
            {
              name: "password",
              label: "Kata Sandi (min. 8 karakter)",
              type: "password",
              autoComplete: "new-password",
              minLength: 8,
            },
          ]}
        />
      </Card>

      <p className="mt-6 text-sm text-slate-400">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-emerald-400 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
