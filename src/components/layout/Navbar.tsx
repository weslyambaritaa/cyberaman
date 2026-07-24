import Link from "next/link";
import { Shield, Trophy, LogOut, LayoutDashboard } from "lucide-react";
import { getCurrentUser, getProfile } from "@/lib/queries";
import { signOutAction } from "@/lib/actions/auth";

const NAV_LINKS = [
  { href: "/tools", label: "Tools" },
  { href: "/learn", label: "Belajar" },
  { href: "/leaderboard", label: "Papan Skor" },
];

export async function Navbar() {
  const user = await getCurrentUser();
  const profile = user ? await getProfile(user.id) : null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Shield className="h-6 w-6 text-emerald-400" aria-hidden />
          <span>
            Cyber<span className="text-emerald-400">Aman</span>
          </span>
        </Link>

        {/* sr-only (not `hidden`/display:none) so this stays keyboard-focusable —
            Tab reaches it, Space toggles it natively, and peer-focus-visible
            below gives it a visible focus ring since the checkbox itself is
            invisible. */}
        <input type="checkbox" id="nav-toggle" className="peer sr-only" />
        <label
          htmlFor="nav-toggle"
          className="cursor-pointer rounded-md border border-slate-700 p-2 text-slate-200 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500 md:hidden"
          aria-label="Buka menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M2 5h16M2 10h16M2 15h16"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </label>

        <nav
          className="absolute left-0 top-full hidden w-full flex-col gap-1 border-b border-slate-800 bg-slate-950 px-4 py-3 peer-checked:flex md:static md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:border-none md:bg-transparent md:p-0"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1.5 text-sm text-slate-300 transition hover:text-emerald-400 md:px-0 md:py-0"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 flex items-center gap-3 border-t border-slate-800 pt-3 md:mt-0 md:border-none md:pt-0">
            {profile ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-full bg-slate-800 px-3 py-1.5 text-sm font-medium text-emerald-300"
                >
                  <Trophy className="h-4 w-4" aria-hidden />
                  {profile.points} poin
                </Link>
                <Link
                  href="/dashboard"
                  className="hidden items-center gap-1.5 text-sm text-slate-300 hover:text-white md:flex"
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-slate-400 hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" aria-hidden />
                    Keluar
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-1.5 text-sm text-slate-300 hover:text-white"
                >
                  Masuk
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
