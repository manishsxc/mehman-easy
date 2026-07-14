"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Browse" },
    { href: "/post", label: "Sell a property" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 md:px-8 pt-4 pb-2 bg-transparent">
      {/* Floating Capsule Container */}
      <div className="max-w-7xl mx-auto h-16 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] px-6 flex items-center justify-between transition-all duration-300">
        
        {/* Brand Logo & Full Styled Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="EV Logo" className="w-8 h-8 object-contain rounded-md shadow-md" />
          <span className="font-display font-800 text-lg tracking-widest text-cream uppercase flex items-center gap-1">
            EV<span className="text-xs font-500 tracking-normal text-gold-soft lowercase italic">marketplace</span>
          </span>
        </Link>

        {/* Desktop Navigation Links with active tab pill background */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className="relative px-4 py-2 text-sm font-500 rounded-full transition-colors duration-250">
                {isActive && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={isActive ? "text-gold font-600" : "text-cream/80 hover:text-cream transition-colors"}>
                  {l.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
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
                <User size={15} className="text-gold-soft" /> 
                <span className="font-500">{profile.name?.split(" ")[0] || "Dashboard"}</span>
              </Link>
              <button
                onClick={signOut}
                className="text-xs px-4 py-2 rounded-full border border-white/15 text-cream/70 hover:border-gold hover:text-gold transition-colors duration-250"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-cream/80 hover:text-gold transition-colors duration-250 px-3">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-xs px-5 py-2.5 rounded-full bg-gold text-ink font-700 hover:bg-gold-soft transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Toggle Button */}
        <button 
          className={`md:hidden text-cream p-2 rounded-full transition-all duration-200 ${open ? 'bg-white/15 rotate-90' : 'hover:bg-white/5'}`} 
          onClick={() => setOpen((v) => !v)} 
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Responsive Slide Menu Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            
            {/* Side sliding panel drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-4 top-24 bottom-6 w-64 z-50 bg-ink-panel/95 border border-white/10 p-6 flex flex-col gap-5 md:hidden rounded-3xl backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]"
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
                    Get Started
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


