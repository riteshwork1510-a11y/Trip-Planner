"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CityFilterState } from "@/lib/globe/cities";

interface CityFilterPanelProps {
  filters: CityFilterState;
  onChange: (newFilters: CityFilterState) => void;
}

export default function CityFilterPanel({ filters, onChange }: CityFilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: newCats });
  };

  return (
    <div className="absolute top-40 left-4 sm:left-6 lg:left-8 z-30 pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#0d1f1a]/70 backdrop-blur-2xl border border-white/[0.08] rounded-xl px-4 py-2.5 shadow-[0_8px_40px_rgba(0,0,0,0.4)] text-white/80 hover:text-white transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters {filters.categories.length > 0 && `(${filters.categories.length})`}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-[280px] bg-[#0d1f1a]/90 backdrop-blur-3xl border border-white/[0.08] rounded-2xl p-4 shadow-2xl origin-top-left"
          >
            <div className="space-y-4">
              {/* Transport */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">Transport</p>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-[#E85D04]" checked={!!filters.airport} onChange={e => onChange({ ...filters, airport: e.target.checked })} />
                    Airport
                  </label>
                  <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                    <input type="checkbox" className="accent-[#E85D04]" checked={!!filters.railway} onChange={e => onChange({ ...filters, railway: e.target.checked })} />
                    Railway
                  </label>
                </div>
              </div>

              {/* Categories */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider font-semibold mb-2">Experiences</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Beach", "Hill Station", "Religious", "Historical", "Adventure", "Luxury"].map(cat => {
                    const active = filters.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-2 py-1 rounded border text-[10px] font-medium transition-colors ${
                          active 
                          ? "bg-[#E85D04]/20 border-[#E85D04]/50 text-[#E85D04]" 
                          : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.08]"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset */}
              <button 
                onClick={() => onChange({ categories: [] })}
                className="w-full py-1.5 text-white/30 hover:text-white/70 text-xs font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
