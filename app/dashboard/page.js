"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Pencil, Inbox, Home as HomeIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState("listings");
  const [listings, setListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!user || !profile?.verified) return;
    (async () => {
      setBusy(true);
      try {
        const token = await user.getIdToken();
        const lRes = await fetch(`/api/properties?ownerUid=${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (lRes.ok) {
          const lData = await lRes.json();
          setListings(lData.properties.map((p) => ({ ...p, id: p._id })));
        }

        const eRes = await fetch("/api/enquiries", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (eRes.ok) {
          const eData = await eRes.json();
          setEnquiries(eData.enquiries.map((e) => ({ ...e, id: e._id })));
        }
      } catch (e) {
        console.error("Error loading dashboard data:", e);
      }
      setBusy(false);
    })();
  }, [user, profile]);

  async function handleDelete(id) {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setListings((l) => l.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error("Error deleting property:", e);
    }
  }

  async function toggleStatus(p) {
    const next = p.status === "active" ? "sold" : "active";
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/properties/${p.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: next })
      });
      if (res.ok) {
        setListings((l) => l.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
      }
    } catch (e) {
      console.error("Error toggling status:", e);
    }
  }


  if (loading || busy) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <p className="text-center text-cream/50 py-24">Loading dashboard…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <p className="text-center text-cream/60 py-24">Please log in to view your dashboard.</p>
      </main>
    );
  }

  if (!profile?.verified) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <p className="text-center text-cream/60 py-24">Please verify your email to access the dashboard.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-600 mb-1">Dashboard</p>
            <h1 className="font-display font-800 text-3xl text-cream">Welcome back, {profile.name?.split(" ")[0]}</h1>
          </div>
          <Link
            href="/post"
            className="px-5 py-2.5 rounded-full bg-gold text-ink font-700 text-sm hover:bg-gold-soft transition-colors"
          >
            + New listing
          </Link>
        </div>

        <div className="flex gap-2 mb-8 border-b border-ink-line/60">
          <TabButton active={tab === "listings"} onClick={() => setTab("listings")} icon={<HomeIcon size={15} />}>
            My listings ({listings.length})
          </TabButton>
          <TabButton active={tab === "enquiries"} onClick={() => setTab("enquiries")} icon={<Inbox size={15} />}>
            Enquiries ({enquiries.length})
          </TabButton>
        </div>

        {tab === "listings" && (
          <div className="grid gap-4">
            {listings.length === 0 && (
              <p className="text-cream/50 text-sm py-10 text-center">No listings yet — post your first property.</p>
            )}
            {listings.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-4 bg-ink-panel border border-ink-line/60 rounded-xl p-4"
              >
                <img
                  src={p.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=60"}
                  className="w-20 h-16 rounded-lg object-cover"
                  alt={p.title}
                />
                <div className="flex-1 min-w-[180px]">
                  <p className="font-600 text-cream">{p.title}</p>
                  <p className="text-xs text-cream/50">
                    {p.city} · ₹{Number(p.price).toLocaleString("en-IN")} ·{" "}
                    <span className={p.status === "active" ? "text-gold" : "text-cream/40"}>{p.status}</span>
                  </p>
                </div>
                <button
                  onClick={() => toggleStatus(p)}
                  className="text-xs px-3 py-2 rounded-full border border-ink-line text-cream/70 hover:border-gold hover:text-gold transition-colors"
                >
                  Mark as {p.status === "active" ? "sold" : "active"}
                </button>
                <Link
                  href={`/post?edit=${p.id}`}
                  className="p-2 rounded-full border border-ink-line text-cream/60 hover:text-gold hover:border-gold transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-full border border-ink-line text-cream/60 hover:text-red-400 hover:border-red-400 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "enquiries" && (
          <div className="grid gap-4">
            {enquiries.length === 0 && (
              <p className="text-cream/50 text-sm py-10 text-center">No enquiries yet.</p>
            )}
            {enquiries.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-ink-panel border border-ink-line/60 rounded-xl p-4"
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <p className="font-600 text-cream">{e.buyerName}</p>
                  <span className="text-xs text-cream/40">
                    {e.createdAt?.toDate ? e.createdAt.toDate().toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="text-xs text-cream/50 mt-0.5">
                  {e.buyerEmail} · {e.buyerPhone}
                </p>
                <p className="text-sm text-cream/70 mt-2">{e.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TabButton({ active, onClick, icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors ${
        active ? "border-gold text-gold" : "border-transparent text-cream/50 hover:text-cream/80"
      }`}
    >
      {icon} {children}
    </button>
  );
}
