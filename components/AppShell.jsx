"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import FirebaseSetupNotice from "@/components/FirebaseSetupNotice";
import { isFirebaseConfigured } from "@/lib/firebase";
import Footer from "@/components/Footer";

import { useEffect } from "react";
import Lenis from "lenis";

export default function AppShell({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [ready]);

  if (!isFirebaseConfigured) {
    return <FirebaseSetupNotice />;
  }

  return (
    <>
      <LoadingScreen onDone={() => setReady(true)} />
      <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" }} className="flex flex-col min-h-screen">
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </>
  );
}


