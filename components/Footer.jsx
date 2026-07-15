"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 relative overflow-hidden bg-black/40 py-8">
      {/* Ambient Gradient Mesh Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-screen bg-[radial-gradient(circle_at_50%_120%,#D4AF37,transparent_50%)] animate-pulse duration-[8s]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_20%_20%,#fff,transparent_30%)]" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EV Logo" className="w-6 h-6 object-contain rounded-md" />
            <span className="font-display font-800 text-sm tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold-soft to-gold">
              EV
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-cream/60">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <Link href="/properties" className="hover:text-gold transition-colors">
              Visit Properties
            </Link>
            <Link href="/about" className="hover:text-gold transition-colors">
              About Us
            </Link>
          </nav>

          <p className="text-[10px] text-cream/40 text-center md:text-right">
            &copy; {currentYear} Mehmaan Easy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

