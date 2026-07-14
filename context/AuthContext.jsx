"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(fbUser) {
    if (!fbUser) return null;
    try {
      const token = await fbUser.getIdToken();
      const res = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        return data.profile;
      }
    } catch (e) {
      console.error("Error loading user profile from MongoDB:", e);
    }
    return null;
  }

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        const prof = await fetchProfile(fbUser);
        setProfile(prof);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Save the registration details to sessionStorage. They will be submitted to the 
  // server-side OTP verify API endpoint ONLY after the user enters the correct OTP.
  async function registerWithEmail(registrationData) {
    // Call server to send OTP first
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: registrationData.email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to trigger registration OTP.");
    }
    // Store in sessionStorage to verify during verify page
    sessionStorage.setItem("registrationData", JSON.stringify(registrationData));
    return { email: registrationData.email };
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  async function signOut() {
    return fbSignOut(auth);
  }

  async function refreshProfile() {
    if (!auth.currentUser) return;
    const prof = await fetchProfile(auth.currentUser);
    setProfile(prof);
  }

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, registerWithEmail, login, loginWithGoogle, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>

  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

