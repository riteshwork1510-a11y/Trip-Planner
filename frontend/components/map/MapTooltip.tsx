"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { CountryFeature } from "@/types/country";

import { useEffect, useState } from "react";
import { getCountryMeta, getCountryFlag } from "@/lib/globe/country-meta";

interface MapTooltipProps {
  country: CountryFeature | null;
  position: { x: number; y: number } | null;
}

export default function MapTooltip({ country, position }: MapTooltipProps) {
  const [tooltipStyle, setTooltipStyle] = useState({ left: -1000, top: -1000, opacity: 0 });

  useEffect(() => {
    if (!position) return;
    
    // Prevent overflow logic
    const margin = 16;
    const tooltipWidth = 240; // Approx max width
    const tooltipHeight = 100; // Approx height
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
  }, [position]);

  const meta = country ? getCountryMeta(country.id) : null;
  const flag = meta ? getCountryFlag(meta.alpha2) : "";

  return (
    <AnimatePresence>
      {country && position && meta && (
        <motion.div
          key={country.id}
          className="fixed z-[9999] pointer-events-none"
          style={{ left: tooltipStyle.left, top: tooltipStyle.top }}
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="bg-[#0a1f2e]/90 backdrop-blur-xl border border-white/[0.12] rounded-xl px-4 py-3 shadow-2xl min-w-[200px]">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-2xl leading-none">{flag}</span>
              <div>
                <p className="text-white/95 text-sm font-semibold leading-tight">
                  {country.name}
                </p>
                <p className="text-white/40 text-[10px] mt-0.5 tracking-wider uppercase font-semibold">
                  {meta.alpha2} • {country.region}
                </p>
              </div>
            </div>
            
            <div className="border-t border-white/[0.08] pt-2 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white/40">Capital</span>
                <span className="text-white/80 font-medium">{meta.capital || "N/A"}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
