"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, MapPin, Sparkles, Building, Layers, 
  ArrowUpRight, ShieldCheck, Star, Users, CheckCircle2, ChevronDown, Compass
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Stats Data
  const stats = [
    { value: 500, suffix: "+", label: "Luxury Properties" },
    { value: 50, suffix: "+", label: "Premium Cities" },
    { value: 10, suffix: "K+", label: "Happy Clients" },
    { value: 15, suffix: "+", label: "Years Experience" }
  ];

  // Categories Data
  const categories = [
    { name: "Residential", count: 142, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" },
    { name: "Commercial", count: 38, img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80" },
    { name: "Land", count: 19, img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
    { name: "Rental", count: 64, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" }
  ];

  // Location Highlights
  const locations = [
    { city: "Mumbai", listings: 120, img: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80" },
    { city: "Pune", listings: 45, img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" },
    { city: "Delhi NCR", listings: 85, img: "https://images.unsplash.com/photo-1585938338392-50a59970d8ee?w=600&q=80" },
    { city: "Bangalore", listings: 92, img: "https://images.unsplash.com/photo-1560185127-6a2806647f81?w=600&q=80" }
  ];

  // Testimonials Data
  const testimonials = [
    { quote: "Acquiring our estate through EV was an absolute masterpiece of a journey. No brokers, no hidden overheads, just pure architectural transparency.", name: "Marcus Vane", role: "Penthouse Owner" },
    { quote: "Selling my beachfront sanctuary directly to an verified buyer saved weeks of unnecessary negotiations. A truly premier experience.", name: "Elena Rostova", role: "Villa Seller" },
    { quote: "The curation standards here are unmatched. Every single listing tells a story of refined luxury and immaculate attention to details.", name: "Julian Sterling", role: "Real Estate Investor" }
  ];

  // FAQ Data
  const faqs = [
    { q: "How does the direct buyer-seller connection work?", a: "EV connects verified buyers directly with property owners. Once you enquire about a listing, you deal directly with the seller. We charge no commission or middleman fees." },
    { q: "Are all luxury properties verified?", a: "Yes. Every listing goes through a comprehensive validation process confirming ownership titles, property coordinates, and exact metadata compliance before appearing live." },
    { q: "Can I list my property for free?", a: "Yes. We offer complimentary basic listings for verified owners. Premium placements with featured ad tags are available as optional upgrades." },
    { q: "How do I contact support during acquisition?", a: "Our elite concierge support line is available 24/7 to assist with spatial documentation, direct messaging support, and coordination." }
  ];

  // Fetch only 2 properties for the homepage
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/properties");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProperties((data.properties || []).slice(0, 2));
        }
      } catch (e) {
        console.error("Error loading properties:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Scroll Progress Bar
    gsap.to("#scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    });

    // 2. Pinned Cinematic Zoom Hero Sequence
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#cinematic-hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
      }
    });

    heroTl.to("#hero-media", {
      scale: 1.15,
      y: 50,
      ease: "none"
    });

    // 3. Stats counters animation
    stats.forEach((_, i) => {
      gsap.fromTo(`#stat-val-${i}`, 
        { textContent: 0 },
        {
          textContent: stats[i].value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#stats-strip",
            start: "top 90%",
            once: true,
          },
          snap: { textContent: 1 }
        }
      );
    });

    // 4. Curtain wipe reveal for Section 2
    gsap.fromTo("#curtain-reveal-img", 
      { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
      {
        clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
        ease: "none",
        scrollTrigger: {
          trigger: "#section-curtain",
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
        }
      }
    );

    // 5. Horizontal image parallax panning
    gsap.fromTo("#pan-image", 
      { x: "-8%" },
      {
        x: "8%",
        ease: "none",
        scrollTrigger: {
          trigger: "#section-pan",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    // 6. SVG timeline line drawing animation
    gsap.fromTo("#process-line",
      { strokeDashoffset: 1000, strokeDasharray: 1000 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#process-section",
          start: "top 70%",
          end: "bottom 50%",
          scrub: true,
        }
      }
    );

    // 7. Parallax for boosted featured ad banner
    gsap.fromTo("#ad-banner-bg", 
      { yPercent: -15 },
      {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: "#featured-ad-banner",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-ink text-cream relative overflow-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/10 z-[100] origin-left">
        <div id="scroll-progress" className="h-full bg-gold w-full scale-x-0 origin-left" />
      </div>

      <Navbar />

      {/* 1. Hero Section */}
      <section id="cinematic-hero" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div id="hero-media" className="absolute inset-0 w-full h-full transform origin-center">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80" 
            alt="Luxury Residence Establishing Shot" 
            className="w-full h-full object-cover filter brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-ink" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center flex flex-col items-center pt-16 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 border border-white/10 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md mb-6"
          >
            <Sparkles size={12} className="text-gold animate-pulse" />
            <p className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.25em] uppercase text-cream/70 font-600">
              The Elyse Concept of Living
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-700 text-3xl sm:text-5xl md:text-8xl tracking-tight leading-[1.05] md:leading-[0.95] text-cream max-w-4xl italic"
          >
            Unveiling architectural <br />
            <span className="font-sans font-800 not-italic text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold-soft to-gold">
              masterpieces.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-cream/55 max-w-xs sm:max-w-md md:max-w-lg mt-6 md:mt-8 text-xs md:text-base font-body tracking-wide leading-relaxed"
          >
            We curate architectural achievements that transcend space and time. Explore our hand-picked portfolio of waterfront sanctuaries and modern estates.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8 md:mt-10"
          >
            <Link 
              href="/properties" 
              className="text-[10px] md:text-xs font-700 px-5 md:px-6 py-3 rounded-full bg-gold text-ink uppercase tracking-wider hover:bg-white hover:text-ink transition-all duration-300 shadow-lg flex items-center gap-2"
            >
              <span>Visit Properties</span>
              <ArrowRight size={13} />
            </Link>
            <Link 
              href="/post" 
              className="text-[10px] md:text-xs font-700 px-5 md:px-6 py-3 rounded-full border border-white/10 text-cream uppercase tracking-wider hover:border-gold hover:text-gold transition-colors duration-300"
            >
              List Your Property
            </Link>
          </motion.div>
        </div>


        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40">
          <span className="text-[9px] uppercase tracking-[0.25em] font-600">Scroll to Explore</span>
          <div className="w-[1px] h-10 bg-white/10 relative overflow-hidden">
            <motion.div 
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-1/2 bg-gold"
            />
          </div>
        </div>
      </section>

      {/* 2. Trust Bar / Stats Strip */}
      <section id="stats-strip" className="relative overflow-hidden bg-[#0c0c0c] border-y border-white/5 py-12 relative z-10">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_70%_120%,#D4AF37,transparent_45%)]" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center relative z-10">
          {stats.map((s, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="flex items-baseline text-cream font-display font-700 text-3xl md:text-4xl italic text-gold">
                <span id={`stat-val-${idx}`}>0</span>
                <span>{s.suffix}</span>
              </div>
              <p className="text-[10px] uppercase tracking-wider text-cream/45 mt-2 font-700">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Cinematic Scroll Sequence */}
      <section id="section-curtain" className="py-28 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-5">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700">01 / Materiality</p>
            <h2 className="font-display font-700 text-4xl md:text-5xl italic text-cream leading-tight">
              Warm rich wood finishings & <br />
              <span className="font-sans font-800 not-italic text-cream/40">imported stone.</span>
            </h2>
            <p className="text-cream/55 text-sm leading-relaxed mt-4 font-body">
              Every detail is selected to provide structural grandeur. Crafted with the finest premium natural stones, hand-molded metals, and timber frameworks.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[360px] md:h-[480px]">
            <img 
              id="curtain-reveal-img"
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80" 
              alt="Kitchen with rich natural wood" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. About / Why Choose Us */}
      <section className="py-28 bg-[#090909] border-b border-white/5 relative overflow-hidden z-10">
        {/* Soft floating glow orbs in background */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none animate-pulse duration-[10s]" />
        
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[340px] md:h-[440px] order-last md:order-first">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" 
              alt="Luxury residence interior" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700">02 / Curation</p>
            <h2 className="font-display font-700 text-4xl italic text-cream leading-snug">
              Unrivaled transparency, direct validation.
            </h2>
            <p className="text-cream/60 text-xs font-body leading-relaxed">
              We operate completely free of standard brokerage fees, validating each title directly with owners to create a seamless acquisition space.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="flex gap-3">
                <ShieldCheck className="text-gold flex-shrink-0" size={18} />
                <div>
                  <h4 className="text-xs font-700 uppercase tracking-wider text-cream">Title Verified</h4>
                  <p className="text-[10px] text-cream/40 mt-1 leading-relaxed">Every document validated before list publishing.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Users className="text-gold flex-shrink-0" size={18} />
                <div>
                  <h4 className="text-xs font-700 uppercase tracking-wider text-cream">Direct Contact</h4>
                  <p className="text-[10px] text-cream/40 mt-1 leading-relaxed">Deal directly with the verified listing owner.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Categories Section */}
      <section className="py-28 border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700">03 / Categorization</p>
          <h2 className="font-display font-700 text-3xl md:text-4xl italic text-cream mt-2">Browse Curated Categories</h2>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, idx) => (
            <Link href={`/properties?category=${c.name}`} key={idx} className="group relative rounded-3xl overflow-hidden h-[300px] border border-white/5 block shadow-xl transition-all duration-300">
              <img src={c.img} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 flex flex-col">
                <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-700 mb-1">{c.count} Listings</span>
                <h3 className="font-display font-600 text-xl text-white italic">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Featured Properties */}
      <section className="py-28 bg-[#090909] border-b border-white/5 relative overflow-hidden z-10">
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/5 pb-6">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gold font-700 mb-2">Selected Portfolios</p>
              <h2 className="font-display font-700 text-4xl italic text-cream">Featured Residences</h2>
            </div>
            <p className="text-xs text-cream/40 mt-3 md:mt-0 max-w-xs">
              A curated duet of architectural sanctuaries currently available for acquisition.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-[400px] rounded-3xl bg-white/5 animate-pulse" />
              <div className="h-[400px] rounded-3xl bg-white/5 animate-pulse" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-12">
              {featuredProperties.map((p, idx) => (
                <div key={p.id || idx} className="transform hover:-translate-y-2 transition-all duration-300">
                  <PropertyCard property={p} index={idx} />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-16">
            <Link 
              href="/properties" 
              className="text-xs font-700 px-8 py-3.5 rounded-full bg-gold text-ink uppercase tracking-wider hover:bg-white hover:text-ink transition-all duration-300 shadow-xl flex items-center gap-3"
            >
              <span>Explore All Properties</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. How It Works Section */}
      <section id="process-section" className="py-28 border-b border-white/5 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center mb-20">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700">04 / Protocol</p>
          <h2 className="font-display font-700 text-3xl md:text-4xl italic text-cream mt-2">The Direct Acquisition Process</h2>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 relative grid md:grid-cols-4 gap-8 md:gap-4">
          {/* Animated Connecting SVG Line */}
          <div className="absolute top-1/4 left-0 w-full h-[2px] hidden md:block z-0">
            <svg className="w-full h-full" fill="none">
              <line id="process-line" x1="10%" y1="50%" x2="90%" y2="50%" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6 6" />
            </svg>
          </div>

          {[
            { step: "01", title: "Select Estate", desc: "Browse validated listings and check architectural plans." },
            { step: "02", title: "Verify Credentials", desc: "Contact checked owners directly through verified channels." },
            { step: "03", title: "Draft Proposal", desc: "Submit direct transaction enquiries securely." },
            { step: "04", title: "Acquire & Settle", desc: "Complete paper works directly, key handover." }
          ].map((p, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative z-10 bg-[#121212] border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-6">
                <span className="text-gold font-display font-700 text-base italic">{p.step}</span>
              </div>
              <h3 className="font-display font-600 text-lg text-white italic mb-2">{p.title}</h3>
              <p className="text-cream/45 text-[11px] font-body leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8. Location Highlights */}
      <section className="py-28 bg-[#090909] border-b border-white/5 relative overflow-hidden z-10">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center mb-16 relative z-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700">05 / Geography</p>
          <h2 className="font-display font-700 text-3xl md:text-4xl italic text-cream mt-2">Sought-After Locations</h2>
        </div>
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {locations.map((loc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-3xl overflow-hidden h-[240px] border border-white/5 shadow-lg"
            >
              <img src={loc.img} alt={loc.city} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h3 className="font-display font-700 text-2xl text-white italic">{loc.city}</h3>
                <span className="text-[10px] tracking-[0.15em] uppercase text-gold font-700 mt-1">{loc.listings} Available</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. Testimonials Carousel */}
      <section className="py-28 border-b border-white/5 relative z-10 bg-black/20 overflow-hidden">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-screen bg-[radial-gradient(circle_at_50%_120%,#D4AF37,transparent_55%)] animate-pulse duration-[9s]" />
        
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center relative z-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700 mb-8">06 / Endorsements</p>
          
          <div className="min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <p className="font-display font-500 text-2xl md:text-3xl italic text-cream leading-relaxed tracking-wide">
                  "{testimonials[activeTestimonial].quote}"
                </p>
                <h4 className="font-sans font-700 text-gold text-xs uppercase tracking-widest mt-8">
                  {testimonials[activeTestimonial].name}
                </h4>
                <p className="text-[10px] text-cream/40 uppercase mt-1 font-500">
                  {testimonials[activeTestimonial].role}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2.5 mt-10">
            {testimonials.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx ? "bg-gold scale-125" : "bg-white/10 hover:bg-white/30"
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 10. Featured Boosted Ad Banner */}
      <section id="featured-ad-banner" className="relative h-[480px] w-full overflow-hidden border-b border-white/5 flex items-center justify-center">
        <div id="ad-banner-bg" className="absolute inset-0 w-full h-[130%] top-[-15%] transform">
          <img 
            src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=80" 
            alt="Boasted Mansion View" 
            className="w-full h-full object-cover filter brightness-[0.4]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-700 border border-gold/30 bg-gold/5 px-4 py-1.5 rounded-full mb-6">
            Featured Masterpiece
          </span>
          <h2 className="font-display font-700 text-4xl md:text-6xl italic text-white leading-tight">
            The Glass Pavilion, Alibaug
          </h2>
          <p className="text-cream/60 max-w-md mt-4 text-xs font-body leading-relaxed">
            Double-height cantilevered ceilings, private pool deck, and direct oceanfront access coordinates.
          </p>
          <Link 
            href="/properties" 
            className="text-[10px] tracking-widest font-700 px-6 py-3 rounded-full bg-gold text-ink uppercase mt-8 hover:bg-white hover:text-ink transition-all duration-300 flex items-center gap-2 transform active:scale-95"
          >
            <span>View Proposal</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* 11. FAQ Accordion Section */}
      <section className="py-28 border-b border-white/5 relative overflow-hidden z-10 bg-[#090909]">
        {/* Soft glowing orb behind accordion */}
        <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-5 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700">07 / FAQ</p>
            <h2 className="font-display font-700 text-3xl md:text-4xl italic text-cream mt-2">Frequently Queries</h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-white/5 rounded-3xl bg-[#121212]/90 backdrop-blur-md overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-display font-600 text-base text-cream italic">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gold"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden border-t border-white/5 bg-black/10"
                    >
                      <p className="px-6 py-5 text-xs text-cream/55 leading-relaxed font-body">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Newsletter CTA Strip */}
      <section className="py-24 relative overflow-hidden z-10 bg-ink border-b border-white/5">
        {/* Ambient Gradient Mesh Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.12] mix-blend-screen bg-[radial-gradient(circle_at_50%_0%,#D4AF37,transparent_60%)] animate-pulse duration-[10s]" />
        
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center flex flex-col items-center relative z-10">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-700 mb-2">08 / Intelligence</p>
          <h2 className="font-display font-700 text-3xl md:text-4xl italic text-white leading-tight">
            Subscribe to Private Listings
          </h2>
          <p className="text-cream/55 text-xs font-body max-w-sm mt-3 leading-relaxed">
            Get private details, unlisted price alerts, and new structural releases directly inside your inbox.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md flex items-center gap-3 mt-8 border-b border-white/10 pb-2">
            <input 
              type="email"
              placeholder="Enter your personal email address"
              className="bg-transparent outline-none flex-1 text-xs text-cream placeholder:text-cream/30 px-2 py-2"
              required
            />
            <button 
              type="submit"
              className="text-[10px] tracking-widest font-700 text-gold uppercase px-4 py-2 hover:text-white transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </main>
  );
}
