"use client";

import { motion, AnimatePresence } from "framer-motion";

function PlaneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function StatRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/35 text-xs">{label}</span>
      <span className={accent ? "text-white/75 text-xs font-medium" : "text-white/50 text-xs"}>
        {value}
      </span>
    </div>
  );
}

interface StateInfoPanelProps {
  selectedState: any | null;
  countryName: string;
  onExploreState?: () => void;
}

export default function StateInfoPanel({ selectedState, countryName, onExploreState }: StateInfoPanelProps) {
  if (!selectedState) return null;
  
  const stateName = selectedState.properties?.name || "Unknown State";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedState.id}
        initial={{ opacity: 0, x: 24, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 24, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-[300px] lg:w-[340px]"
      >
        <div className="bg-[#0d1f1a]/70 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-5 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.08] text-2xl flex-shrink-0 select-none">
              📍
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-lg leading-tight truncate">
                {stateName}
              </p>
              <p className="text-white/40 text-xs mt-0.5 uppercase tracking-wider">{countryName}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/[0.03] rounded-xl border border-white/[0.05] p-3.5 mb-4">
            <div className="space-y-2.5">
              <StatRow label="Major Cities" value="N/A" />
              <StatRow label="Tourist Places" value="N/A" />
              <StatRow label="Area" value="N/A" />
            </div>
          </div>

          {/* Summary */}
          <p className="text-white/35 text-[11px] leading-relaxed mb-4">
            Detailed exploration of cities and tourist places in {stateName} will be available in future phases.
          </p>

          {/* CTAs */}
          <div className="space-y-2">
            <button 
              onClick={onExploreState}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E85D04] to-[#E85D04]/80 hover:from-[#E85D04]/90 hover:to-[#E85D04]/70 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-[#E85D04]/15"
            >
              <PlaneIcon className="h-4 w-4" />
              Explore {stateName}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
