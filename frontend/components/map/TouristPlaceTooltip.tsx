"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type TouristPlace } from "@/lib/globe/tourist-places";

interface TouristPlaceTooltipProps {
  place: TouristPlace | null;
  position: { x: number; y: number } | null;
}

export default function TouristPlaceTooltip({ place, position }: TouristPlaceTooltipProps) {
  if (!place || !position) return null;

  // Keep tooltip on screen
  const x = Math.min(Math.max(20, position.x + 15), typeof window !== 'undefined' ? window.innerWidth - 320 : 1000);
  const y = Math.min(Math.max(20, position.y + 15), typeof window !== 'undefined' ? window.innerHeight - 200 : 1000);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="fixed z-50 pointer-events-none"
        style={{ left: x, top: y }}
      >
        <div className="bg-[#0d1f1a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl w-64 flex flex-col gap-2">
          <div className="flex gap-3 h-16">
             <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
               <img src={place.heroImage} alt={place.name} className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col justify-center min-w-0 flex-1">
               <h4 className="text-white text-sm font-bold truncate leading-tight mb-1">{place.name}</h4>
               <div className="flex items-center gap-1.5">
                  <span className="bg-[#E85D04] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm">
                    {place.category}
                  </span>
                  <span className="text-white/70 text-[10px] font-medium flex items-center gap-1">
                    <span className="text-yellow-400">★</span> {place.rating}
                  </span>
               </div>
             </div>
          </div>
          
          <p className="text-white/60 text-xs line-clamp-2 leading-relaxed">
            {place.shortDescription}
          </p>

          <div className="flex items-center justify-between mt-1 border-t border-white/5 pt-2">
            <span className="text-white/50 text-[10px] uppercase font-bold tracking-wider">
              Entry: <span className="text-white/80">{place.entryFee}</span>
            </span>
            <span className="text-[#E85D04] text-[10px] uppercase font-bold tracking-wider">
              Click to view details
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
