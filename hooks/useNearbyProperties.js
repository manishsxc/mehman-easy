"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useGeolocation } from "@/hooks/useGeolocation";

// Haversine distance in km between two lat/lng points.
function distanceKm(a, b) {
  if (!a || !b) return Infinity;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Deterministic-but-varied spacing so featured ad cards don't cluster or
// always land on the same index: every 4th-6th card, cycling 4,5,6,4,5,6...
function injectAds(sorted, ads) {
  if (!ads.length) return sorted.map((p) => ({ type: "property", data: p }));
  const out = [];
  let adIdx = 0;
  let sinceLastAd = 0;
  const gaps = [4, 5, 6];
  let gapCursor = 0;
  let nextGap = gaps[gapCursor % gaps.length];

  sorted.forEach((p, i) => {
    out.push({ type: "property", data: p });
    sinceLastAd++;
    if (sinceLastAd >= nextGap && adIdx < ads.length) {
      out.push({ type: "ad", data: ads[adIdx % ads.length] });
      adIdx++;
      sinceLastAd = 0;
      gapCursor++;
      nextGap = gaps[gapCursor % gaps.length];
    }
  });
  return out;
}

export function useNearbyProperties({ filters } = {}) {
  const { coords, status: geoStatus } = useGeolocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let url = "/api/properties";
        if (coords) {
          url += `?lat=${coords.lat}&lng=${coords.lng}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProperties(data.properties.map((p) => ({ ...p, id: p._id })));
        }
      } catch (e) {
        console.error("Error loading properties from MongoDB API:", e);
      }
      setLoading(false);
    })();
  }, [coords]);


  const feed = useMemo(() => {
    let list = [...properties];

    if (filters?.keyword) {
      const k = filters.keyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(k) ||
          p.city?.toLowerCase().includes(k) ||
          p.address?.toLowerCase().includes(k) ||
          p.pincode?.includes(k)
      );
    }
    if (filters?.category && filters.category !== "All") {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters?.minPrice) list = list.filter((p) => p.price >= filters.minPrice);
    if (filters?.maxPrice) list = list.filter((p) => p.price <= filters.maxPrice);
    if (filters?.bedrooms) list = list.filter((p) => p.bedrooms >= filters.bedrooms);
    if (filters?.minArea) list = list.filter((p) => p.area >= filters.minArea);

    // Sort by proximity when we have the user's coordinates; otherwise fall
    // back to newest-first so the page is still meaningful pre-permission.
    if (coords) {
      list.sort((a, b) => {
        const da = distanceKm(coords, { lat: a.lat, lng: a.lng });
        const db_ = distanceKm(coords, { lat: b.lat, lng: b.lng });
        return da - db_;
      });
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }


    const featuredPool = properties.filter((p) => p.isFeatured);
    return injectAds(list, featuredPool);
  }, [properties, coords, filters]);

  return { feed, loading, geoStatus, hasLocation: !!coords };
}
