"use client";

import { motion } from "framer-motion";

export default function MapLegend() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="absolute bottom-6 left-4 sm:left-6 lg:left-8 z-30 pointer-events-auto"
    >
      <div className="bg-[#0d1f1a]/70 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] p-3">
        <h4 className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Map Legend</h4>
        <div className="flex flex-col gap-2.5">
          <LegendItem color="#1a2332" label="Default Country" />
          <LegendItem color="#263548" label="Hovered" border="rgba(255,255,255,0.25)" />
          <LegendItem color="#E85D04" label="Selected" />
        </div>
      </div>
    </motion.div>
  );
}

function LegendItem({ color, label, border }: { color: string; label: string; border?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-3 h-3 rounded-sm flex-shrink-0"
        style={{
          backgroundColor: color,
          border: border ? `1px solid ${border}` : "1px solid rgba(255,255,255,0.1)",
        }}
      />
      <span className="text-white/70 text-xs font-medium">{label}</span>
    </div>
  );
}
