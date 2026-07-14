"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { BedDouble, Bath, Ruler, MapPin, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import EnquiryModal from "@/components/EnquiryModal";
import { db } from "@/lib/firebase";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProperty({ ...data.property, id: data.property._id });
        }
      } catch (e) {
        console.error("Error loading property from MongoDB:", e);
      }
      setLoading(false);
    })();
  }, [id]);


  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <p className="text-center text-cream/50 py-24">Loading…</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <p className="text-center text-cream/60 py-24">Property not found.</p>
      </main>
    );
  }

  const images = property.images?.length
    ? property.images
    : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=60"];

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="rounded-2xl overflow-hidden h-[340px] md:h-[440px]">
            <img src={images[activeImg]} alt={property.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === activeImg ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-[1.6fr_1fr] gap-8 mt-8">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-600">{property.category}</span>
              <h1 className="font-display font-800 text-3xl text-cream mt-1">{property.title}</h1>
              <p className="flex items-center gap-1.5 text-cream/50 text-sm mt-2">
                <MapPin size={14} /> {property.address}, {property.city} {property.pincode}
              </p>

              <div className="flex items-center gap-6 mt-6 text-cream/80 text-sm">
                {!!property.bedrooms && (
                  <span className="flex items-center gap-1.5">
                    <BedDouble size={16} /> {property.bedrooms} beds
                  </span>
                )}
                {!!property.bathrooms && (
                  <span className="flex items-center gap-1.5">
                    <Bath size={16} /> {property.bathrooms} baths
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Ruler size={16} /> {property.area} sqft
                </span>
              </div>

              <p className="text-cream/65 text-sm leading-relaxed mt-6">{property.description}</p>

              {property.amenities?.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-cream/40 mb-3">Amenities</p>
                  <div className="grid grid-cols-2 gap-2">
                    {property.amenities.map((a) => (
                      <span key={a} className="flex items-center gap-2 text-sm text-cream/70">
                        <CheckCircle size={14} className="text-gold" /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="ticket-card shadow-ticket h-fit sticky top-24">
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink/45">Fare</p>
                <p className="font-display font-800 text-ink text-3xl">
                  ₹{Number(property.price).toLocaleString("en-IN")}
                  {property.category === "Rental" && <span className="text-sm font-400">/mo</span>}
                </p>
              </div>
              <div className="ticket-stub p-5">
                <button
                  onClick={() => setShowEnquiry(true)}
                  className="w-full px-5 py-3 rounded-full bg-ink text-gold-soft font-600 text-sm hover:bg-ink-soft transition-colors"
                >
                  Buy / Enquire
                </button>
                <p className="text-[11px] text-ink/40 mt-3 text-center">
                  Listed by {property.ownerEmail}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {showEnquiry && <EnquiryModal property={property} onClose={() => setShowEnquiry(false)} />}
    </main>
  );
}
