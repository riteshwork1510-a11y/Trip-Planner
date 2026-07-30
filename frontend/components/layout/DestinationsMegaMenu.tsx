"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const DESTINATION_SECTIONS = [
  {
    title: "🇮🇳 Domestic Destinations",
    items: ["Manali", "Goa", "Leh Ladakh", "Kashmir", "Dwarka", "Kerala Backwaters", "Rajasthan Palaces", "Andaman Islands"],
  },
  {
    title: "🌍 International Destinations",
    items: ["Bali", "Paris", "Dubai", "Swiss Alps", "Maldives", "Singapore", "Thailand", "Tokyo"],
  },
  {
    title: "🎯 Travel Themes",
    items: ["Honeymoon Retretes", "Beach & Islands", "Mountain Adventure", "Wildlife Safaris", "Pilgrimage Tours", "Luxury Resorts"],
  },
];

const FEATURED_DESTINATION = {
  name: "Swiss Alps & Railways",
  country: "Switzerland",
  tag: "🔥 Featured #1 Pick",
  image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
  link: "/destinations/swiss-alps",
};

export default function DestinationsMegaMenu({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const [search, setSearch] = useState("");

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[920px] bg-white/95 dark:bg-[#161F2E]/95 backdrop-blur-2xl border border-gray-200/80 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden z-[100] text-gray-900 dark:text-white"
          >
            {/* Top Search Input Bar */}
            <div className="px-8 py-4 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Filter destinations by country, city or theme..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#E85D04] transition-all"
                />
              </div>
            </div>

            {/* Mega Menu Content Grid */}
            <div className="grid grid-cols-4 gap-6 p-8">
              {DESTINATION_SECTIONS.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#E85D04]">
                    {sec.title}
                  </h3>
                  <div className="flex flex-col space-y-1">
                    {sec.items
                      .filter((item) => item.toLowerCase().includes(search.toLowerCase()))
                      .map((item) => (
                        <Link
                          key={item}
                          href={`/destinations/${item.toLowerCase().replace(/ /g, "-")}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-[#E85D04] transition-colors flex items-center justify-between group"
                        >
                          <span>{item}</span>
                          <span className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-[#E85D04]">
                            <ArrowRightIcon />
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}

              {/* Featured Destination Banner */}
              <div className="relative rounded-2xl overflow-hidden group flex flex-col justify-end p-4 text-white min-h-[220px]">
                <Image
                  src={FEATURED_DESTINATION.image}
                  alt={FEATURED_DESTINATION.name}
                  fill
                  sizes="240px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <span className="relative z-10 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#E85D04] w-fit mb-1">
                  {FEATURED_DESTINATION.tag}
                </span>
                <h4 className="relative z-10 text-sm font-extrabold line-clamp-1">{FEATURED_DESTINATION.name}</h4>
                <p className="relative z-10 text-[10px] text-white/80 font-medium">{FEATURED_DESTINATION.country}</p>
                <Link
                  href={FEATURED_DESTINATION.link}
                  className="relative z-10 mt-2 text-[11px] font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Now</span>
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>

            {/* Bottom Footer Action */}
            <div className="px-8 py-3.5 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Over 500+ curated global destinations available</span>
              <Link
                href="/destinations"
                className="flex items-center gap-1.5 text-xs font-extrabold text-[#E85D04] hover:text-[#D4540A] transition-colors"
              >
                <span>Explore All Destinations</span>
                <ArrowRightIcon />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
