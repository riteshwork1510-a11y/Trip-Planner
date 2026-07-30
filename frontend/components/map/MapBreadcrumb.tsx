"use client";

import { motion, AnimatePresence } from "framer-motion";

interface MapBreadcrumbProps {
  countryName: string | null;
  stateName: string | null;
  cityName?: string | null;
  placeName?: string | null;
  onWorldClick: () => void;
  onCountryClick: () => void;
  onStateClick?: () => void;
  onCityClick?: () => void;
}

export default function MapBreadcrumb({
  countryName,
  stateName,
  cityName,
  placeName,
  onWorldClick,
  onCountryClick,
  onStateClick,
  onCityClick
}: MapBreadcrumbProps) {
  return (
    <div className="absolute top-24 left-4 sm:left-6 lg:left-8 z-30 pointer-events-auto">
      <div className="flex items-center gap-2 bg-[#0d1f1a]/70 backdrop-blur-2xl border border-white/[0.08] rounded-full px-4 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
        
        {/* World Level */}
        <button
          onClick={onWorldClick}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
            !countryName ? "text-[#E85D04]" : "text-white/50 hover:text-white/80"
          }`}
        >
          World
        </button>

        <AnimatePresence>
          {/* Country Level */}
          {countryName && (
            <motion.div
              key="country"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-white/20 text-xs">/</span>
              <button
                onClick={onCountryClick}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  !stateName ? "text-[#E85D04]" : "text-white/50 hover:text-white/80"
                }`}
              >
                {countryName}
              </button>
            </motion.div>
          )}
          
          {/* State Level */}
          {stateName && (
            <motion.div
              key="state"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-white/20 text-xs">/</span>
              <button
                onClick={onStateClick}
                disabled={!cityName}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  !cityName ? "text-[#E85D04] cursor-default" : "text-white/50 hover:text-white/80"
                }`}
              >
                {stateName}
              </button>
            </motion.div>
          )}

          {/* City Level */}
          {cityName && (
            <motion.div
              key="city"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-white/20 text-xs">/</span>
              <button
                onClick={onCityClick}
                disabled={!placeName}
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  !placeName ? "text-[#E85D04] cursor-default" : "text-white/50 hover:text-white/80"
                }`}
              >
                {cityName}
              </button>
            </motion.div>
          )}

          {/* Place Level */}
          {placeName && (
            <motion.div
              key="place"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <span className="text-white/20 text-xs">/</span>
              <span className="text-[#E85D04] text-xs font-semibold uppercase tracking-wider">
                {placeName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
