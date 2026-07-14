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
    <main className="min-h-screen">
      <Navbar />

      <section className="relative overflow-hidden border-b border-ink-line/50 pb-16 pt-16 md:pt-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] tracking-[0.3em] uppercase text-gold font-600 mb-4"
          >
            Property marketplace
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display font-800 text-4xl md:text-6xl leading-[1.05] text-cream max-w-2xl"
          >
            Board the journey to your <span className="font-script text-gold font-700">next</span> address
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-cream/60 max-w-lg mt-5 text-base"
          >
            Mehmaan Easy connects buyers and sellers directly — no middlemen, no waiting.
            Every listing is a ticket to somewhere new.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2 mt-6 text-sm text-cream/50"
          >
            <MapPin size={15} className="text-gold" />
            {geoStatus === "locating" && "Finding properties near you…"}
            {geoStatus === "granted" && hasLocation && "Showing properties nearest to you first"}
            {geoStatus === "denied" && "Location off — showing newest listings first"}
            {geoStatus === "unsupported" && "Showing newest listings first"}
          </motion.div>
        </div>
      </section>

      <FilterBar filters={filters} setFilters={setFilters} />

      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
        <PropertyGrid feed={feed} loading={loading} />
      </section>
    </main>
  );
}
