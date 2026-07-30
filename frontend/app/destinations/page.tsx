"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DESTINATIONS_DATA, DestinationItem } from "@/lib/destinations-data";

// SVGs
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const CompassIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const CATEGORY_TABS = [
  { id: "all", label: "All Destinations", icon: "✨" },
  { id: "india", label: "In India", icon: "🇮🇳" },
  { id: "international", label: "International", icon: "🌍" },
  { id: "popular", label: "Popular Top Picks", icon: "⭐" },
  { id: "beaches", label: "Beaches", icon: "🏖️" },
  { id: "hill-stations", label: "Hill Stations", icon: "🏔️" },
  { id: "luxury-travel", label: "Luxury", icon: "💎" },
  { id: "honeymoon", label: "Honeymoon", icon: "💖" },
];

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredDestinations = useMemo(() => {
    return DESTINATIONS_DATA.filter((dest) => {
      // Category filter
      let matchesTab = true;
      if (activeTab === "india") matchesTab = dest.category === "india";
      else if (activeTab === "international") matchesTab = dest.category === "international";
      else if (activeTab === "popular") matchesTab = dest.category === "popular";
      else if (activeTab !== "all") {
        matchesTab = dest.id === activeTab || dest.slug === activeTab || dest.subCategory?.toLowerCase() === activeTab;
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;

      const matchesSearch =
        dest.name.toLowerCase().includes(q) ||
        dest.description.toLowerCase().includes(q) ||
        dest.region.toLowerCase().includes(q) ||
        dest.vibe.toLowerCase().includes(q) ||
        dest.topAttractions.some((a) => a.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <DashboardLayout
      title="Destinations Explorer"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
    >
      <div className="space-y-10 pb-16">
        {/* ── Hero Search Section ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#143326] via-[#1B4332] to-[#2D6A4F] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Animated Background Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E85D04]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2D6A4F]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold uppercase tracking-widest border border-white/15">
              <CompassIcon /> Destination Discovery
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Where will your next <span className="text-[#E85D04]">journey</span> take you?
            </h1>

            <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Explore handpicked destinations across India, iconic global hotspots, and hidden gems designed for unforgettable travel experiences.
            </p>

            {/* Interactive Search Bar */}
            <div className="relative max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-white/50">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, countries, themes, or cities..."
                  className="w-full bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl py-4 pl-12 pr-10 text-white placeholder-white/50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E85D04] focus:border-transparent transition-all shadow-xl"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-white/50 hover:text-white text-sm font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20 scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/80 shadow-sm"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Results Header ── */}
        <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {activeTab === "all"
                ? "All Travel Destinations"
                : CATEGORY_TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              Showing {filteredDestinations.length} curated destination{filteredDestinations.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* ── Destinations Cards Grid ── */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredDestinations.map((dest, idx) => (
                <motion.div
                  key={dest.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image Banner */}
                    <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold shadow-md">
                          {dest.category === "india" ? "🇮🇳 India" : dest.category === "international" ? "🌍 Global" : "⭐ Popular"}
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                          <StarIcon /> {dest.rating} ({dest.reviewsCount})
                        </span>
                      </div>

                      {/* Bottom Banner Info */}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-xl font-bold leading-tight drop-shadow-md">
                          {dest.name}
                        </h3>
                        <p className="text-white/80 text-xs font-medium flex items-center gap-1 mt-0.5">
                          <MapPinIcon /> {dest.region}
                        </p>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 space-y-4">
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {dest.description}
                      </p>

                      {/* Best Time & Vibe Badges */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
                          <CalendarIcon /> Best: {dest.bestTime}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#1B4332]/10 text-[#1B4332] font-semibold">
                          {dest.vibe}
                        </span>
                      </div>

                      {/* Key Attractions */}
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Top Highlights
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {dest.topAttractions.slice(0, 3).map((attr, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-gray-600 text-[11px] font-medium"
                            >
                              {attr}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-5 pb-5 pt-2 flex items-center gap-2 border-t border-gray-50">
                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="w-full text-center py-2.5 rounded-xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs sm:text-sm font-semibold transition-colors shadow-md shadow-[#1B4332]/10 flex items-center justify-center gap-1.5"
                    >
                      <span>Explore Destination</span>
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty Search Results State */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4 max-w-md mx-auto my-8">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold text-gray-900">No destinations found</h3>
            <p className="text-gray-500 text-sm">
              We couldn't find any destinations matching "{searchQuery}". Try searching for countries like India, Dubai, or Bali.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-sm font-semibold hover:bg-[#143326] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ── Bottom Call To Action Banner ── */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-[#E85D04] to-orange-600 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to build your dream itinerary?</h3>
            <p className="text-white/90 text-sm sm:text-base max-w-xl">
              Use our AI-powered Trip Planner to create custom day-by-day travel schedules tailored to your preferences and budget.
            </p>
          </div>
          <Link
            href="/planner"
            className="px-6 py-3.5 rounded-2xl bg-white text-[#E85D04] hover:bg-amber-50 font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 whitespace-nowrap"
          >
            Start Planning with AI →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
