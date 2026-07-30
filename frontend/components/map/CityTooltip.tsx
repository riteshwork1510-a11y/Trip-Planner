"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { CityFeature } from "@/lib/globe/cities";

interface CityTooltipProps {
  city: CityFeature | null;
  stateName: string;
  countryName: string;
  position: { x: number; y: number } | null;
}

export default function CityTooltip({ city, stateName, countryName, position }: CityTooltipProps) {
  const [tooltipStyle, setTooltipStyle] = useState({ left: -1000, top: -1000, opacity: 0 });

  useEffect(() => {
    if (!position || !city) return;
    
    const margin = 16;
    const tooltipWidth = 220;
    const tooltipHeight = 120;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;

    let x = position.x + margin;
    let y = position.y - 8;

    if (x + tooltipWidth > windowWidth) {
      x = position.x - tooltipWidth - margin;
    }
    if (y + tooltipHeight > windowHeight) {
      y = windowHeight - tooltipHeight - margin;
    }

    setTooltipStyle({ left: x, top: y, opacity: 1 });
  }, [position, city]);

  return (
    <AnimatePresence>
      {city && position && (
        <motion.div
          key={`city-tooltip-${city.id}`}
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltipStyle.left, top: tooltipStyle.top }}
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="bg-[#0a1f2e]/90 backdrop-blur-xl border border-[#E85D04]/30 rounded-xl px-4 py-3 shadow-2xl min-w-[220px]">
            <div className="mb-2">
              <p className="text-white/95 text-sm font-semibold leading-tight flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E85D04]"></span>
                {city.name}
              </p>
              <p className="text-white/40 text-[10px] mt-0.5 tracking-wider uppercase font-semibold pl-3">
                {stateName}, {countryName}
              </p>
            </div>
            
            <div className="border-t border-white/[0.08] pt-2 mt-2 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Tourist Places</span>
                <span className="text-white/80 font-medium">{city.touristPlacesCount}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Weather</span>
                <span className="text-white/80 font-medium">{city.weatherCategory}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Travel Rating</span>
                <span className="text-[#E85D04] font-bold">{city.travelRating.toFixed(1)} ★</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
