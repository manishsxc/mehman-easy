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
      <div className="bg-cream-card rounded-2xl shadow-card p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-ink/5 rounded-xl px-4 py-3">
            <Search size={18} className="text-ink/50" />
            <input
              value={filters.keyword}
              onChange={(e) => update({ keyword: e.target.value })}
              placeholder="Search by locality, city, or pincode"
              className="bg-transparent outline-none w-full text-ink placeholder:text-ink/40 text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto md:overflow-visible">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => update({ category: c })}
                className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  filters.category === c
                    ? "bg-ink text-gold-soft"
                    : "bg-ink/5 text-ink/60 hover:bg-ink/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-ink/15 text-ink/70 text-sm hover:border-gold-deep hover:text-gold-deep transition-colors"
          >
            <SlidersHorizontal size={15} /> Filters
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 mt-4 border-t border-ink/10">
                <label className="text-xs text-ink/60 flex flex-col gap-1">
                  Min price (₹)
                  <input
                    type="number"
                    className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-gold-deep"
                    value={filters.minPrice || ""}
                    onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : null })}
                  />
                </label>
                <label className="text-xs text-ink/60 flex flex-col gap-1">
                  Max price (₹)
                  <input
                    type="number"
                    className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-gold-deep"
                    value={filters.maxPrice || ""}
                    onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : null })}
                  />
                </label>
                <label className="text-xs text-ink/60 flex flex-col gap-1">
                  Min bedrooms
                  <input
                    type="number"
                    className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-gold-deep"
                    value={filters.bedrooms || ""}
                    onChange={(e) => update({ bedrooms: e.target.value ? Number(e.target.value) : null })}
                  />
                </label>
                <label className="text-xs text-ink/60 flex flex-col gap-1">
                  Min area (sqft)
                  <input
                    type="number"
                    className="rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none focus:border-gold-deep"
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
