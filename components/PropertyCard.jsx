"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";

const CATEGORY_LABEL = {
  Residential: "RES",
  Commercial: "COM",
  Land: "LND",
  Rental: "RNT",
};

export default function PropertyCard({ property, index = 0 }) {
  const img = property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=60";
  const priceLabel =
    property.category === "Rental"
      ? `₹${Number(property.price).toLocaleString("en-IN")}/mo`
      : `₹${Number(property.price).toLocaleString("en-IN")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="bg-[#121212] border border-white/5 rounded-3xl overflow-hidden shadow-2xl flex flex-col group transition-all duration-300"
    >
      <Link href={`/property/${property.id}`} className="block relative">
        {/* Luxury Image Preview Container */}
        <div className="relative h-60 w-full overflow-hidden">
          <img 
            src={img} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          
          <span className="absolute top-4 left-4 text-[9px] tracking-[0.25em] font-700 uppercase bg-black/80 text-gold-soft px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {CATEGORY_LABEL[property.category] || "PROP"}
          </span>
          
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <h3 className="font-display font-600 text-lg tracking-tight text-white line-clamp-1 group-hover:text-gold transition-colors duration-300">
              {property.title}
            </h3>
          </div>
        </div>

        {/* Property Specs */}
        <div className="p-5">
          <p className="flex items-center gap-1.5 text-cream/45 text-xs">
            <MapPin size={12} className="text-gold" /> 
            <span>{property.city}</span>
            {property.pincode ? <span> · {property.pincode}</span> : ""}
          </p>

          <div className="flex items-center gap-5 mt-4 text-cream/70 text-xs border-t border-white/5 pt-4">
            {!!property.bedrooms && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={14} className="text-cream/40" /> 
                <span className="font-500">{property.bedrooms} beds</span>
              </span>
            )}
            {!!property.bathrooms && (
              <span className="flex items-center gap-1.5">
                <Bath size={14} className="text-cream/40" /> 
                <span className="font-500">{property.bathrooms} baths</span>
              </span>
            )}
            {!!property.area && (
              <span className="flex items-center gap-1.5">
                <Ruler size={14} className="text-cream/40" /> 
                <span className="font-500">{property.area} sqft</span>
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Luxury Bottom Perforated stub or footer */}
      <div className="mt-auto px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/5">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-cream/40">Fare</p>
          <p className="font-display font-700 text-gold text-lg tracking-wide">{priceLabel}</p>
        </div>
        <Link
          href={`/property/${property.id}`}
          className="text-xs font-700 px-4 py-2 rounded-full bg-gold text-ink hover:bg-white hover:text-ink transition-all duration-300 transform active:scale-95 shadow-md"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

