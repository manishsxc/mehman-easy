"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md py-12">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="EV Logo" className="w-8 h-8 object-contain rounded-md" />
            <span className="font-display font-800 text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold-soft to-gold">
              EV
            </span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-cream/60">
            <Link href="/" className="hover:text-gold transition-colors">
              Browse Properties
            </Link>
            <Link href="/post" className="hover:text-gold transition-colors">
              List Your Property
            </Link>
            <Link href="/dashboard" className="hover:text-gold transition-colors">
              Seller Dashboard
            </Link>
          </nav>

          <p className="text-xs text-cream/40 text-center md:text-right">
            &copy; {currentYear} EV Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
