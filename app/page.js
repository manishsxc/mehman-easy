"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import PropertyGrid from "@/components/PropertyGrid";
import { useNearbyProperties } from "@/hooks/useNearbyProperties";

export default function HomePage() {
  const [filters, setFilters] = useState({
    keyword: "",
    category: "All",
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    minArea: null,
  });
  const { feed, loading, geoStatus, hasLocation } = useNearbyProperties({ filters });

  return (
    <main className="min-h-screen bg-ink text-cream relative">
      <Navbar />

      {/* Luxury Hero Banner Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-white/5">
        {/* Floorplan Blueprint Background Overlay Effect */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none mix-blend-screen">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <circle cx="70%" cy="40%" r="280" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="5,5" />
            <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 border border-white/10 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <p className="text-[10px] tracking-[0.25em] uppercase text-cream/70 font-600">
              The Crown Jewel of Living
            </p>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-700 text-5xl md:text-8xl tracking-tight leading-[0.95] text-cream max-w-4xl italic"
          >
            Luxury redefined, <br />
            <span className="font-sans font-800 not-italic text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold-soft to-gold">
              address acquired.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-cream/55 max-w-xl mt-8 text-sm md:text-base font-body tracking-wide leading-relaxed"
          >
            EV connects direct buyers and sellers of elite real estates. Experience architectural masterpieces with wood finishes, lofty ceilings and private sanctuaries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2.5 mt-8 text-xs text-gold/80 bg-gold/5 px-4 py-2 rounded-full border border-gold/10"
          >
            <MapPin size={13} className="text-gold" />
            {geoStatus === "locating" && "Locating properties near your coordinates…"}
            {geoStatus === "granted" && hasLocation && "Displaying nearby luxury properties first"}
            {geoStatus === "denied" && "Location disabled — sorted by latest listings"}
            {geoStatus === "unsupported" && "Sorted by latest listings"}
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <div className="relative z-20">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* Curated Elite Collection Feed */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/5 pb-4">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-600 mb-1">
              Curated Feed
            </p>
            <h2 className="font-display font-700 text-3xl text-cream italic">
              Elite Residences
            </h2>
          </div>
          <p className="text-xs text-cream/40 mt-2 md:mt-0">
            Showing {feed.length} available properties
          </p>
        </div>
        
        <PropertyGrid feed={feed} loading={loading} />
      </section>
    </main>
  );
}
