"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { TouristPlaceFilterState, TouristPlaceCategory } from "@/lib/globe/tourist-places";
import { useCallback, useRef, useState, useEffect } from "react";

const CATEGORIES: { id: TouristPlaceCategory; label: string; icon: string }[] = [
  { id: "Historical", label: "Historical", icon: "🏛️" },
  { id: "Nature", label: "Nature", icon: "🌿" },
  { id: "Adventure", label: "Adventure", icon: "🧗" },
  { id: "Religious", label: "Religious", icon: "⛩️" },
  { id: "Beach", label: "Beach", icon: "🏖️" },
  { id: "Mountain", label: "Mountain", icon: "⛰️" },
  { id: "Museum", label: "Museum", icon: "🖼️" },
  { id: "Food", label: "Food", icon: "🍽️" },
  { id: "Shopping", label: "Shopping", icon: "🛍️" },
  { id: "Nightlife", label: "Nightlife", icon: "🍸" },
  { id: "Luxury", label: "Luxury", icon: "💎" },
  { id: "Family", label: "Family Friendly", icon: "👨‍👩‍👧‍👦" },
  { id: "Wildlife", label: "Wildlife", icon: "🦁" },
  { id: "Photography", label: "Photography", icon: "📸" },
  { id: "Hidden Gems", label: "Hidden Gems", icon: "🗺️" }
];

export default function TouristPlaceFilter({
  filters,
  onChange,
}: {
  filters: TouristPlaceFilterState;
  onChange: (f: TouristPlaceFilterState) => void;
}) {
  const toggleCategory = useCallback((cat: TouristPlaceCategory) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    onChange({ categories: newCats });
  }, [filters, onChange]);

  const clearAll = useCallback(() => {
    onChange({ categories: [] });
  }, [onChange]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -250 : 250, behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-3xl pointer-events-auto">
      <div className="bg-[#0d1f1a]/80 backdrop-blur-2xl border border-white/[0.08] rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-2">
        
        {/* Clear/All Button */}
        <button
          onClick={clearAll}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
            filters.categories.length === 0
              ? "bg-[#E85D04] text-white shadow-lg shadow-[#E85D04]/20"
              : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          All Places
        </button>
        
        <div className="w-px h-6 bg-white/[0.1] mx-1 flex-shrink-0" />

        {/* Categories Scrollable Container */}
        <div className="relative flex-1 overflow-hidden">
          {/* Scroll Arrows */}
          <AnimatePresence>
            {showLeftScroll && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scroll('left')}
                className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0d1f1a] to-transparent z-10 flex items-center justify-start pl-1 text-white/50 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </motion.button>
            )}
          </AnimatePresence>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-1"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = filters.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 border ${
                    isActive
                      ? "bg-white/10 text-white border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                      : "bg-white/[0.02] text-white/50 border-white/[0.04] hover:bg-white/[0.06] hover:text-white/80"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {showRightScroll && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => scroll('right')}
                className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0d1f1a] to-transparent z-10 flex items-center justify-end pr-1 text-white/50 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
