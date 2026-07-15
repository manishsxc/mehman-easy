"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  const team = [
    { name: "Julian Elyse", role: "Principal Architect", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
    { name: "Sophia Lorrent", role: "Lead Curator & Partner", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" }
  ];

  return (
    <main className="min-h-screen bg-ink text-cream relative">
      <Navbar />

      {/* Blueprint background lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none mix-blend-screen">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
      </div>

      <section className="max-w-5xl mx-auto px-5 md:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Elegant 3D Tilt Frame for image */}
          <motion.div
            initial={{ opacity: 0, x: -30, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1000 }}
            className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[450px]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
              alt="Luxury residence interior"
              className="w-full h-full object-cover"
            />
            
            {/* Elegant HUD architectural detail overlay */}
            <div className="absolute bottom-6 left-6 z-20">
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-700">Project Reference</p>
              <h3 className="font-display font-600 text-xl italic text-white mt-1">The Glass Sanctuary</h3>
            </div>
          </motion.div>

          <div className="flex flex-col gap-6">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700">Our Heritage</p>
            <h1 className="font-display font-700 text-4xl md:text-6xl leading-[0.95] text-cream italic">
              Crafting legacy <br />
              <span className="font-sans font-800 not-italic text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold-soft to-gold">
                since MCMXCVIII.
              </span>
            </h1>
            
            <p className="text-cream/60 font-body text-sm leading-relaxed mt-4">
              We curate architectural achievements that transcend space and time. Our approach brings buyers and sellers together in a bespoke premium marketplace without friction or intermediaries.
            </p>
            <p className="text-cream/60 font-body text-sm leading-relaxed">
              Every penthouse, waterfront cottage, and modern sanctuary in our portfolio is selected for its lofty ceilings, custom warm wood craftings, and exquisite design aesthetics.
            </p>
          </div>
        </div>

        {/* Curation Philosophy in 3D Cards */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700 mb-2">Our Standards</p>
            <h2 className="font-display font-700 text-3xl italic">The Pillars of Curation</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Architectural Grandeur", desc: "Lofty custom ceilings and sculptural structures that challenge traditional space definitions." },
              { title: "Bespoke Artistry", desc: "Warm rich wood finishings, imported premium stone surfaces and hand-detailed metalworks." },
              { title: "Privacy & Sanctuary", desc: "Private access entries, intelligent spatial layout, and custom landscape integrations." }
            ].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                className="bg-[#121212] border border-white/5 p-8 rounded-3xl transition-all duration-300 shadow-xl"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-6">
                  <span className="text-gold text-xs font-700">0{i + 1}</span>
                </div>
                <h3 className="font-display font-600 text-lg text-cream italic mb-3">{p.title}</h3>
                <p className="text-cream/50 text-xs leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
