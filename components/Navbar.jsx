"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="EV Logo" className="w-9 h-9 object-contain rounded-md shadow-md" />
          <span className="font-display font-800 text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold-soft to-gold">
            EV
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-500 text-cream/80 hover:text-gold transition-colors duration-250">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user && profile?.verified ? (
            <>
              <Link
                href="/post"
                className="text-xs px-4 py-2 rounded-full bg-gold text-ink font-700 hover:bg-gold-soft transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                + Add Property
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-cream/90 hover:text-gold transition-colors duration-250"
              >
                <User size={15} /> {profile.name?.split(" ")[0] || "Dashboard"}
              </Link>
              <button
                onClick={signOut}
                className="text-xs px-4 py-2 rounded-full border border-white/10 text-cream/70 hover:border-gold hover:text-gold transition-colors duration-250"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-cream/80 hover:text-gold transition-colors duration-250">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-xs px-4 py-2 rounded-full bg-gold text-ink font-700 hover:bg-gold-soft transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                List Your Property
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-cream p-1.5 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black md:hidden"
            />
            {/* Compact Side Panel Slide Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-16 bottom-0 w-64 z-50 bg-ink-panel/95 border-l border-white/10 p-6 flex flex-col gap-5 md:hidden backdrop-blur-2xl shadow-2xl"
            >
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm font-500 text-cream/90 hover:text-gold transition-colors" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-1" />
              {user && profile?.verified ? (
                <>
                  <Link href="/post" className="text-sm font-700 text-gold hover:text-gold-soft transition-colors" onClick={() => setOpen(false)}>
                    + Add Property
                  </Link>
                  <Link href="/dashboard" className="text-sm font-500 text-cream/90 hover:text-gold transition-colors" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={() => { signOut(); setOpen(false); }} className="text-left text-sm font-500 text-cream/50 hover:text-red-400 transition-colors">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-500 text-cream/90 hover:text-gold transition-colors" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                  <Link href="/register" className="text-sm font-700 text-gold hover:text-gold-soft transition-colors" onClick={() => setOpen(false)}>
                    List Your Property
                  </Link>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

