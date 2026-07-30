"use client";

import { motion } from "framer-motion";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: MapControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="absolute top-24 right-4 sm:right-6 lg:right-8 z-30 flex flex-col gap-2"
    >
      <div className="bg-[#0d1f1a]/70 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onZoomIn(); }}
          className="p-3 hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors border-b border-white/[0.08]"
          aria-label="Zoom In"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onZoomOut(); }}
          className="p-3 hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors"
          aria-label="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
      </div>

      <div className="bg-[#0d1f1a]/70 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); onReset(); }}
          className="p-3 hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors"
          aria-label="Reset Map"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
