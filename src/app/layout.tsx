import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberAman — By Team Kilijum",
  description:
    "Ruang belajar keamanan digital untuk pelajar: latihan phishing, pemeriksaan praktis, dan modul singkat untuk membangun kebiasaan aman di internet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="dark h-full antialiased"
    >
      <body className="flex min-h-full flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
