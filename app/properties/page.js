"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Grid, Layers, Compass } from "lucide-react";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";

const CATEGORIES = ["All", "Residential", "Commercial", "Land", "Rental"];

export default function PropertiesListingPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minArea, setMinArea] = useState("");

  const [expanded, setExpanded] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch properties
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          setProperties(data.properties || []);
          setFilteredProperties(data.properties || []);
        }
      } catch (e) {
        console.error("Error loading properties:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...properties];

    // Keyword filter
    if (keyword.trim()) {
      const term = keyword.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(term) ||
          p.city?.toLowerCase().includes(term) ||
          p.address?.toLowerCase().includes(term) ||
          p.pincode?.includes(term)
      );
    }

    // Category filter
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    // Price filters
    if (minPrice) {
      result = result.filter((p) => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => Number(p.price) <= Number(maxPrice));
    }

    // Bedrooms filter
    if (bedrooms) {
      result = result.filter((p) => Number(p.bedrooms) >= Number(bedrooms));
    }

    // Area filter
    if (minArea) {
      result = result.filter((p) => Number(p.area) >= Number(minArea));
    }

    // Sorting
    if (sortBy === "price_asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "area_desc") {
      result.sort((a, b) => Number(b.area) - Number(a.area));
    } else {
      // Default: Newest first (using Mongo ID timestamp or creation date)
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFilteredProperties(result);
  }, [properties, keyword, category, minPrice, maxPrice, bedrooms, minArea, sortBy]);

  return (
    <main className="min-h-screen bg-ink text-cream relative">
      <Navbar />

      {/* Blueprint lines backdrop */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none mix-blend-screen">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="listing-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#listing-grid)" />
        </svg>
      </div>

      {/* Header section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-12 pb-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-8 mb-12">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold font-700 mb-2">Our Collection</p>
            <h1 className="font-display font-700 text-4xl md:text-6xl leading-[0.95] text-cream italic">
              Explore Luxury <br />
              <span className="font-sans font-800 not-italic text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold-soft to-gold">
                Residences.
              </span>
            </h1>
          </div>
          <p className="text-xs text-cream/45 max-w-xs mt-4 md:mt-0 leading-relaxed font-body">
            Browse through our cinematic directory of handpicked luxury estates, properties, and rental sanctuaries.
          </p>
        </div>

        {/* Sticky-ready premium search and filter bar container */}
        <div className="sticky top-20 z-40 bg-ink/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 shadow-xl mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="w-full lg:flex-1 flex items-center gap-2.5 bg-white/5 rounded-2xl px-4 py-3 border border-white/5">
              <Search size={16} className="text-cream/55" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by locality, city, or property name..."
                className="bg-transparent outline-none w-full text-cream placeholder:text-cream/35 text-xs font-500"
              />
            </div>

            {/* Categories horizontal list */}
            <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-2xl text-[11px] font-700 whitespace-nowrap uppercase tracking-wider transition-all duration-300 ${
                    category === c
                      ? "bg-gold text-ink"
                      : "bg-white/5 text-cream/70 hover:bg-white/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* More filters and sorting triggers */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 lg:flex-none bg-white/5 border border-white/5 text-cream/80 text-[11px] font-700 uppercase tracking-wider px-4 py-2.5 rounded-2xl outline-none cursor-pointer focus:border-gold"
              >
                <option value="newest" className="bg-[#121212]">Newest Listing</option>
                <option value="price_asc" className="bg-[#121212]">Price: Low to High</option>
                <option value="price_desc" className="bg-[#121212]">Price: High to Low</option>
                <option value="area_desc" className="bg-[#121212]">Largest Area</option>
              </select>

              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 text-cream/80 text-[11px] font-700 uppercase tracking-wider hover:border-gold hover:text-gold transition-colors"
              >
                <SlidersHorizontal size={13} />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced Collapsible Filter options */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-4 border-t border-white/10">
                  <label className="text-[10px] uppercase tracking-wider text-cream/50 flex flex-col gap-1.5 font-700">
                    Min Price (₹)
                    <input
                      type="number"
                      className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-cream outline-none focus:border-gold font-body"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </label>
                  <label className="text-[10px] uppercase tracking-wider text-cream/50 flex flex-col gap-1.5 font-700">
                    Max Price (₹)
                    <input
                      type="number"
                      className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-cream outline-none focus:border-gold font-body"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </label>
                  <label className="text-[10px] uppercase tracking-wider text-cream/50 flex flex-col gap-1.5 font-700">
                    Min Bedrooms
                    <input
                      type="number"
                      className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-cream outline-none focus:border-gold font-body"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                    />
                  </label>
                  <label className="text-[10px] uppercase tracking-wider text-cream/50 flex flex-col gap-1.5 font-700">
                    Min Area (sqft)
                    <input
                      type="number"
                      className="rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-xs text-cream outline-none focus:border-gold font-body"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                    />
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Properties Grid Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-24 text-cream/60">
            <Compass size={40} className="text-gold mx-auto mb-4 animate-bounce" />
            <p className="font-display text-xl italic text-cream">No properties found</p>
            <p className="text-xs mt-2 font-body max-w-sm mx-auto leading-relaxed">
              We couldn't find any matches. Try modifying your search keywords or broadening your filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((p, idx) => (
              <motion.div
                key={p.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.05 }}
              >
                <PropertyCard property={p} index={idx} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
