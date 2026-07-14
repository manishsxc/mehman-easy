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
      transition={{ duration: 0.45, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="ticket-card shadow-card flex flex-col"
    >
      <Link href={`/property/${property.id}`} className="block">
        <div className="relative h-44 w-full overflow-hidden">
          <img src={img} alt={property.title} className="w-full h-full object-cover" loading="lazy" />
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] font-600 uppercase bg-ink/85 text-gold-soft px-2 py-1 rounded-full">
            {CATEGORY_LABEL[property.category] || "PROP"}
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-display font-700 text-ink text-base leading-snug line-clamp-1">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 text-ink/60 text-xs mt-1">
            <MapPin size={12} /> {property.city}
            {property.pincode ? ` · ${property.pincode}` : ""}
          </p>

          <div className="flex items-center gap-4 mt-3 text-ink/70 text-xs">
            {!!property.bedrooms && (
              <span className="flex items-center gap-1">
                <BedDouble size={13} /> {property.bedrooms}
              </span>
            )}
            {!!property.bathrooms && (
              <span className="flex items-center gap-1">
                <Bath size={13} /> {property.bathrooms}
              </span>
            )}
            {!!property.area && (
              <span className="flex items-center gap-1">
                <Ruler size={13} /> {property.area} sqft
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Perforated tear-off stub — the price boarding-pass stub */}
      <div className="ticket-stub flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">Fare</p>
          <p className="font-display font-700 text-ink text-lg leading-none">{priceLabel}</p>
        </div>
        <Link
          href={`/property/${property.id}`}
          className="text-xs font-600 px-3 py-2 rounded-full bg-ink text-gold-soft hover:bg-ink-soft transition-colors"
        >
          Enquire
        </Link>
      </div>
    </motion.div>
  );
}
