"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ServiceItem {
  title: string;
  desc: string;
  icon: string;
  badge?: string;
  href: string;
}

const SERVICES_LIST: ServiceItem[] = [
  { title: "Visa Assistance", desc: "99.4% approval rate across 80+ countries", icon: "📄", badge: "Fast Track", href: "/services#visa" },
  { title: "Flight Bookings", desc: "Corporate & luxury airfare discounts", icon: "✈️", href: "/services#flights" },
  { title: "Luxury Hotels", desc: "Vetted 4★ & 5★ resort stays", icon: "🏨", badge: "Vetted 5★", href: "/services#hotels" },
  { title: "Travel Insurance", desc: "Comprehensive global medical & trip protection", icon: "🛡️", href: "/services#insurance" },
  { title: "Transfers", desc: "Private chauffeur-driven luxury sedans", icon: "🚘", href: "/services#transfers" },
  { title: "Cruise Packages", desc: "All-inclusive ocean & river voyages", icon: "🚢", href: "/services#cruises" },
  { title: "Corporate Travel", desc: "Tailored MICE retreats & offsites", icon: "💼", badge: "B2B", href: "/services#corporate" },
  { title: "AI Trip Planner", desc: "Personalized day-by-day AI itineraries", icon: "✨", badge: "AI Powered", href: "/planner" },
];

export default function ServicesMegaMenu({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[780px] bg-white/95 dark:bg-[#161F2E]/95 backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden z-[100] p-6 text-gray-900 dark:text-white"
          >
            <div className="grid grid-cols-2 gap-4">
              {SERVICES_LIST.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 hover:border-[#E85D04] hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-start gap-3 group cursor-pointer"
                >
                  <span className="text-2xl p-2 rounded-xl bg-white dark:bg-white/10 shadow-sm">{service.icon}</span>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-gray-900 dark:text-white group-hover:text-[#E85D04] transition-colors">
                        {service.title}
                      </h4>
                      {service.badge && (
                        <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E85D04]/10 text-[#E85D04]">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{service.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
