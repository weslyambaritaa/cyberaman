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
    <header className="sticky top-0 z-50 border-b border-white/15 bg-black shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex h-[72px] max-w-[1360px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <Shield className="h-6 w-6 text-[#7B66FF]" aria-hidden />
          <span>
            Cyber<span className="text-[#7B66FF]">Aman</span>
          </span>
        </Link>

        {/* sr-only (not `hidden`/display:none) so this stays keyboard-focusable —
            Tab reaches it, Space toggles it natively, and peer-focus-visible
            below gives it a visible focus ring since the checkbox itself is
            invisible. */}
        <input type="checkbox" id="nav-toggle" className="peer sr-only" />
        <label
          htmlFor="nav-toggle"
          className="cursor-pointer rounded-lg border border-white/15 p-2 text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#7B66FF] md:hidden"
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
          className="absolute left-0 top-full hidden w-full flex-col gap-1 border-b border-white/15 bg-black px-4 py-3 peer-checked:flex md:static md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:border-none md:bg-transparent md:p-0"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-1.5 text-sm text-[#DEDEE2] transition hover:text-white md:px-0 md:py-0"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 flex items-center gap-3 border-t border-white/15 pt-3 md:mt-0 md:border-none md:pt-0">
            {profile ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 rounded-full bg-[#222225] px-3 py-1.5 text-sm font-medium text-[#9D99FF]"
                >
                  <Trophy className="h-4 w-4" aria-hidden />
                  {profile.points} poin
                </Link>
                <Link
                  href="/dashboard"
                  className="hidden items-center gap-1.5 text-sm text-[#DEDEE2] hover:text-white md:flex"
                  title="Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                </Link>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-[#DEDEE2] hover:text-white"
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
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Masuk
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-[#673DE6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7B66FF]"
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
