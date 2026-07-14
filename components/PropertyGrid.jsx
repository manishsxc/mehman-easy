"use client";

import PropertyCard from "@/components/PropertyCard";
import AdBanner from "@/components/AdBanner";

export default function PropertyGrid({ feed, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-72 rounded-2xl bg-ink-panel/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!feed.length) {
    return (
      <div className="text-center py-20 text-cream/60">
        <p className="font-display text-lg text-cream">No properties match your search yet</p>
        <p className="text-sm mt-1">Try widening your filters or clearing the search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
      {feed.map((item, i) =>
        item.type === "ad" ? (
          <AdBanner key={`ad-${item.data.id}-${i}`} property={item.data} index={i} />
        ) : (
          <PropertyCard key={item.data.id} property={item.data} index={i} />
        )
      )}
    </div>
  );
}
