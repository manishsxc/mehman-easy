"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["All", "Residential", "Commercial", "Land", "Rental"];

export default function FilterBar({ filters, setFilters }) {
  const [expanded, setExpanded] = useState(false);

  function update(patch) {
    setFilters((f) => ({ ...f, ...patch }));
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 -mt-8 relative z-10">
      <div className="bg-ink-panel border border-white/5 rounded-3xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] p-4 md:p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-3 border border-white/5">
            <Search size={18} className="text-cream/50" />
            <input
              value={filters.keyword}
              onChange={(e) => update({ keyword: e.target.value })}
              placeholder="Search by locality, city, or luxury properties..."
              className="bg-transparent outline-none w-full text-cream placeholder:text-cream/30 text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto md:overflow-visible">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => update({ category: c })}
                className={`px-4 py-2 rounded-2xl text-xs font-500 whitespace-nowrap transition-all duration-200 ${
                  filters.category === c
                    ? "bg-gold text-ink font-700 shadow-md"
                    : "bg-white/5 text-cream/70 hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border border-white/10 text-cream/80 text-xs font-600 hover:border-gold hover:text-gold transition-colors"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>


        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 mt-4 border-t border-white/10">
                <label className="text-xs text-cream/60 flex flex-col gap-1.5">
                  Min price (₹)
                  <input
                    type="number"
                    className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-cream outline-none focus:border-gold"
                    value={filters.minPrice || ""}
                    onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : null })}
                  />
                </label>
                <label className="text-xs text-cream/60 flex flex-col gap-1.5">
                  Max price (₹)
                  <input
                    type="number"
                    className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-cream outline-none focus:border-gold"
                    value={filters.maxPrice || ""}
                    onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : null })}
                  />
                </label>
                <label className="text-xs text-cream/60 flex flex-col gap-1.5">
                  Min bedrooms
                  <input
                    type="number"
                    className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-cream outline-none focus:border-gold"
                    value={filters.bedrooms || ""}
                    onChange={(e) => update({ bedrooms: e.target.value ? Number(e.target.value) : null })}
                  />
                </label>
                <label className="text-xs text-cream/60 flex flex-col gap-1.5">
                  Min area (sqft)
                  <input
                    type="number"
                    className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-cream outline-none focus:border-gold"
                    value={filters.minArea || ""}
                    onChange={(e) => update({ minArea: e.target.value ? Number(e.target.value) : null })}
                  />
                </label>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
