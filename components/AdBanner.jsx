"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AdBanner({ property, index = 0 }) {
  const img = property.images?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=60";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="col-span-full relative rounded-2xl overflow-hidden border border-gold/40 shadow-ticket"
    >
      <Link href={`/property/${property.id}`} className="grid md:grid-cols-[1.2fr_1fr] items-stretch bg-ink-panel">
        <div className="p-6 md:p-8 flex flex-col justify-center gap-3">
          <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.25em] uppercase text-gold font-600">
            <Sparkles size={12} /> Featured near you
          </span>
          <h3 className="font-display font-700 text-2xl text-cream leading-tight">{property.title}</h3>
          <p className="text-cream/60 text-sm">
            {property.city} · {property.category}
          </p>
          <p className="font-display text-gold-soft text-xl mt-1">
            ₹{Number(property.price).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="relative h-40 md:h-full">
          <img src={img} alt={property.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </Link>
    </motion.div>
  );
}
