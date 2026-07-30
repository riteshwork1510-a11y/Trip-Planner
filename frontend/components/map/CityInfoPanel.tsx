"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { CityFeature } from "@/lib/globe/cities";

function PlaneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function StatRow({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/35 text-xs">{label}</span>
      <span className={accent ? "text-white/75 text-xs font-medium" : "text-white/50 text-xs"}>
        {value}
      </span>
    </div>
  );
}

interface CityInfoPanelProps {
  selectedCity: CityFeature | null;
  stateName: string;
  countryName: string;
}

export default function CityInfoPanel({ selectedCity, stateName, countryName }: CityInfoPanelProps) {
  if (!selectedCity) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedCity.id}
        initial={{ opacity: 0, x: 24, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 24, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-[300px] lg:w-[340px]"
      >
        <div className="bg-[#0d1f1a]/70 backdrop-blur-2xl border border-[#E85D04]/20 rounded-2xl p-5 shadow-[0_8px_40px_rgba(232,93,4,0.1)]">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E85D04]/20 to-transparent border border-[#E85D04]/30 text-2xl flex-shrink-0 select-none">
              🏙️
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-lg leading-tight truncate">
                {selectedCity.name}
              </p>
              <p className="text-white/40 text-[10px] mt-0.5 uppercase tracking-wider truncate">
                {stateName}, {countryName}
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {selectedCity.categories.map(cat => (
              <span key={cat} className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-white/60 text-[10px] font-medium">
                {cat}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-white/[0.03] rounded-xl border border-white/[0.05] p-3.5 mb-4">
            <div className="space-y-2.5">
              <StatRow label="Population" value={(selectedCity.population / 1000000).toFixed(1) + "M"} />
              <StatRow label="Tourist Places" value={selectedCity.touristPlacesCount} accent />
              <StatRow label="Travel Rating" value={selectedCity.travelRating.toFixed(1) + " ★"} accent />
              <StatRow label="Best Season" value={selectedCity.bestSeason} />
              <StatRow label="Weather" value={selectedCity.weatherCategory} />
              
              <div className="flex gap-2 pt-2 mt-2 border-t border-white/[0.05]">
                {selectedCity.airportAvailable && (
                  <span className="flex-1 text-center bg-white/[0.03] rounded py-1 text-[10px] text-white/50">✈️ Airport</span>
                )}
                {selectedCity.railwayAvailable && (
                  <span className="flex-1 text-center bg-white/[0.03] rounded py-1 text-[10px] text-white/50">🚂 Railway</span>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <p className="text-white/35 text-[11px] leading-relaxed mb-4">
            A beautiful destination in {stateName} offering {selectedCity.touristPlacesCount} major tourist attractions and rich experiences.
          </p>

          {/* CTAs */}
          <div className="space-y-2">
            <button 
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D04]/50 to-[#E85D04]/30 text-white/50 text-sm font-semibold cursor-not-allowed border border-[#E85D04]/20"
            >
              Explore Tourist Places (Phase 6)
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
