"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { httpsCallable } from "firebase/functions";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { functions } from "@/lib/firebase";

export default function VerifyPage() {
  const router = useRouter();
  const { login, refreshProfile } = useAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    setEmail(sessionStorage.getItem("pendingVerifyEmail") || "");
  }, []);

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const regDataStr = sessionStorage.getItem("registrationData");
      const registrationData = regDataStr ? JSON.parse(regDataStr) : null;

      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, registrationData }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      // If registration succeeded, sign in the user via Firebase client auth
      if (registrationData?.password) {
        await login(email, registrationData.password);
      }

      await refreshProfile();
      sessionStorage.removeItem("pendingVerifyEmail");
      sessionStorage.removeItem("registrationData");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code.");
      }
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } catch (err) {
      setError(err.message);
    }
  }


  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="max-w-sm mx-auto px-5 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold font-600 mb-2">Almost there</p>
          <h1 className="font-display font-800 text-2xl text-cream mb-2">Enter your boarding code</h1>
          <p className="text-cream/55 text-sm mb-8">
            We sent a 6-digit code to <span className="text-cream">{email || "your email"}</span>
          </p>

          <form onSubmit={handleVerify} className="flex flex-col gap-4 items-center">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="000000"
              className="w-40 text-center tracking-[0.5em] text-2xl rounded-lg bg-ink-panel border border-ink-line px-3 py-3 text-gold-soft outline-none focus:border-gold"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              disabled={submitting || code.length !== 6}
              className="w-full px-5 py-3 rounded-full bg-gold text-ink font-700 text-sm disabled:opacity-50 hover:bg-gold-soft transition-colors"
            >
              {submitting ? "Verifying…" : "Verify & continue"}
            </button>

            <button type="button" onClick={handleResend} className="text-xs text-cream/50 hover:text-gold">
              {resent ? "Code resent" : "Didn't get it? Resend code"}
            </button>
          </form>
        </motion.div>
      </section>
    </main>
  );
}
