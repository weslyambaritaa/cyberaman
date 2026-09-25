import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/15 bg-black py-8 text-sm text-[#DEDEE2]">
      <div className="mx-auto flex max-w-[1360px] flex-col items-center gap-2 px-4 text-center md:flex-row md:justify-between md:px-6 md:text-left">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#7B66FF]" aria-hidden />
          <span>CyberAman &mdash; By Team Kilijum</span>
        </div>
        
      </div>
    </footer>
  );
}
