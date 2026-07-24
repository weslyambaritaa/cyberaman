import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CompleteModuleButton } from "@/components/learn/CompleteModuleButton";
import { learningModules } from "@/lib/content/modules";
import { getCompletedModuleSlugs, getCurrentUser } from "@/lib/queries";

export function generateStaticParams() {
  return learningModules.map((mod) => ({ slug: mod.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = learningModules.find((m) => m.slug === slug);
  return { title: mod ? `${mod.title} — CyberAman` : "Modul — CyberAman" };
}

export default async function LearnModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = learningModules.find((m) => m.slug === slug);
  if (!mod) notFound();

  const user = await getCurrentUser();
  const completed = user ? await getCompletedModuleSlugs(user.id) : new Set<string>();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <Link
        href="/learn"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Modul Belajar
      </Link>

      <span className="inline-block rounded-full bg-slate-800 px-2.5 py-1 text-xs font-medium text-emerald-300">
        {mod.subtheme}
      </span>
      <h1 className="mt-3 text-3xl font-bold text-white">{mod.title}</h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
        <Clock className="h-3.5 w-3.5" /> {mod.minutesRead} menit baca
      </p>

      <div className="mt-8 space-y-6">
        {mod.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-lg font-semibold text-white">{section.heading}</h2>
            <p className="mt-2 leading-relaxed text-slate-400">{section.body}</p>
          </div>
        ))}
      </div>

      <Card className="mt-10">
        <CompleteModuleButton
          slug={mod.slug}
          isLoggedIn={Boolean(user)}
          initiallyCompleted={completed.has(mod.slug)}
        />
      </Card>
    </div>
  );
}
