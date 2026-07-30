"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { CityData as GeoCityData, RegionData } from "@/lib/globe/geography";
import { getCityData, CATEGORY_ICONS, type TravelCategory } from "@/lib/globe/city-data";

interface CityDetailPanelProps {
  city: GeoCityData;
  region: RegionData;
  countryName: string;
  countryFlag: string;
  onBack: () => void;
  onPlanTrip?: () => void;
}

function CategoryPill({ category }: { category: TravelCategory }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 text-[11px] font-medium">
      <svg className="h-3 w-3 text-[#E85D04]/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={CATEGORY_ICONS[category]} />
      </svg>
      {category}
    </span>
  );
}

export default function CityDetailPanel({
  city,
  region,
  countryName,
  countryFlag,
  onBack,
  onPlanTrip,
}: CityDetailPanelProps) {
  const cityData = useMemo(() => getCityData(city.name), [city.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      {/* ── Back Button ── */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-white/40 hover:text-white/65 text-xs mb-3 transition-colors"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to {region.name}
      </button>

      {/* ── City Header ── */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E85D04]/20 to-[#E85D04]/5 border border-[#E85D04]/15 flex-shrink-0">
          <svg className="h-6 w-6 text-[#E85D04]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/95 font-bold text-base leading-tight">{city.name}</p>
          <p className="text-white/40 text-[11px] mt-0.5">{region.name}, {countryName}</p>
        </div>
        <span className="text-xl select-none">{countryFlag}</span>
      </div>

      {/* ── Coordinates ── */}
      <div className="flex items-center gap-1.5 mb-3 text-white/25 text-[10px]">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
        {city.lat.toFixed(2)}°{city.lat >= 0 ? "N" : "S"},{" "}
        {Math.abs(city.lng).toFixed(2)}°{city.lng >= 0 ? "E" : "W"}
      </div>

      {/* ── Description ── */}
      {cityData && (
        <p className="text-white/40 text-[11px] leading-relaxed mb-4">
          {cityData.description}
        </p>
      )}

      {/* ── Best Time ── */}
      {cityData && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
          <svg className="h-3.5 w-3.5 text-emerald-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="text-white/30 text-[11px]">Best time to visit</span>
          <span className="text-white/60 text-[11px] font-medium ml-auto">{cityData.bestTime}</span>
        </div>
      )}

      {/* ── Categories ── */}
      {cityData && cityData.categories.length > 0 && (
        <div className="mb-4">
          <p className="text-white/30 text-[10px] uppercase tracking-wider font-medium mb-2">Popular for</p>
          <div className="flex flex-wrap gap-1.5">
            {cityData.categories.map((cat) => (
              <CategoryPill key={cat} category={cat} />
            ))}
          </div>
        </div>
      )}

      {/* ── Attractions ── */}
      {cityData && cityData.attractions.length > 0 && (
        <div className="mb-4">
          <p className="text-white/30 text-[10px] uppercase tracking-wider font-medium mb-2">Top attractions</p>
          <div className="space-y-1.5">
            {cityData.attractions.map((attraction) => (
              <div
                key={attraction}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-[#E85D04]/50 flex-shrink-0" />
                <span className="text-white/55 text-[11px]">{attraction}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── No Data State ── */}
      {!cityData && (
        <div className="text-center py-4 mb-4">
          <p className="text-white/30 text-[11px]">
            Detailed information for {city.name} is coming soon.
          </p>
        </div>
      )}

      {/* ── CTAs ── */}
      <div className="space-y-2 mt-auto pt-2 border-t border-white/[0.06]">
        <button
          onClick={onPlanTrip}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D04] to-[#E85D04]/80 hover:from-[#E85D04]/90 hover:to-[#E85D04]/70 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#E85D04]/15"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
          Plan a Trip with AI
        </button>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/70 text-[11px] font-medium transition-colors border border-white/[0.06]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Nearby
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/70 text-[11px] font-medium transition-colors border border-white/[0.06]">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Attractions
          </button>
        </div>
      </div>
    </motion.div>
  );
}
