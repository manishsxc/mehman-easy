"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Browse" },
    { href: "/post", label: "Sell a property" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink-line/60 bg-ink/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="EV Logo" className="w-9 h-9 object-contain rounded-md" />
          <span className="font-display font-700 text-lg tracking-tight text-cream">
            EV
          </span>
        </Link>


        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-cream/80 hover:text-gold transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user && profile?.verified ? (
            <>
              <Link
                href="/post"
                className="text-sm px-4 py-2 rounded-full bg-gold text-ink font-600 hover:bg-gold-soft transition-colors"
              >
                + Add Property
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-cream/90 hover:text-gold transition-colors"
              >
                <User size={16} /> {profile.name?.split(" ")[0] || "Dashboard"}
              </Link>
              <button
                onClick={signOut}
                className="text-sm px-4 py-2 rounded-full border border-ink-line text-cream/70 hover:border-gold hover:text-gold transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-cream/80 hover:text-gold transition-colors">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 rounded-full bg-gold text-ink font-600 hover:bg-gold-soft transition-colors"
              >
                List Your Property
              </Link>
            </>
          )}
        </div>



        <button className="md:hidden text-cream" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden border-t border-ink-line/60 bg-ink px-5 py-4 flex flex-col gap-4"
        >
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-cream/85" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {user && profile?.verified ? (
            <>
              <Link href="/post" className="text-gold font-600" onClick={() => setOpen(false)}>
                + Add Property
              </Link>
              <Link href="/dashboard" className="text-cream/85" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <button onClick={signOut} className="text-left text-cream/60">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-cream/85" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/register" className="text-gold font-600" onClick={() => setOpen(false)}>
                List Your Property
              </Link>
            </>
          )}

        </motion.div>
      )}
    </header>
  );
}
