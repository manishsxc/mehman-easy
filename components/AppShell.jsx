"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import FirebaseSetupNotice from "@/components/FirebaseSetupNotice";
import { isFirebaseConfigured } from "@/lib/firebase";
import Footer from "@/components/Footer";

export default function AppShell({ children }) {
  const [ready, setReady] = useState(false);

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

