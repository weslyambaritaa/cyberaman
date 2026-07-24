import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-sm text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" aria-hidden />
          <span>CyberAman &mdash; Lomba Web Development FTI Festival 2026</span>
        </div>
        <span>Tema: PIXEL — Protection Information Exploration in the Digital Era</span>
      </div>
    </footer>
  );
}
