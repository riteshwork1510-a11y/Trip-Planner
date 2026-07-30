"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CountUp } from "@/components/animations/animation-utils";

// --- SVG Icons ---
const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z" />
  </svg>
);

const CompassIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" />
  </svg>
);

const LocationPinIcon = () => (
  <svg className="w-5 h-5 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth={2} />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" strokeWidth={2.2} />
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
  </svg>
);

// --- Data Constants ---
const SEARCH_TABS = [
  { id: "ai", label: "✨ AI Trip Planner" },
  { id: "stays", label: "🏨 Luxury Stays" },
  { id: "flights", label: "✈️ Flights" },
  { id: "packages", label: "🌴 Curated Packages" },
];

const TRUST_BADGES = [
  { name: "IATA Accredited", code: "IATA #96-3241" },
  { name: "TAAI Member", code: "TAAI Cert #8410" },
  { name: "TAFI Verified", code: "TAFI Reg #A-901" },
  { name: "ISO 9001:2015", code: "Quality Certified" },
];

const HERO_COUNTERS = [
  { label: "Happy Travelers", value: 100, suffix: "K+" },
  { label: "Handcrafted Destinations", value: 500, suffix: "+" },
  { label: "Years Experience", value: 15, suffix: "+" },
  { label: "Google Rating", value: 4.9, suffix: " / 5 ⭐", isFloat: true },
];

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState("ai");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");

  const scrollToPlanner = () => {
    document.getElementById("create-trip-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-gray-900 text-white">
      {/* ── Background Image with Lazy Loading & Dynamic Overlay Scrim ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero_bg.jpg"
          alt="Luxury Scenic Destination — WanderAI Travel"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 animate-subtle-zoom"
        />
        {/* Layered Rich Gradient Overlay for High Contrast Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* ── Hero Main Content ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-32 sm:pt-40 pb-16 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6 text-left">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#E85D04] animate-ping" />
            <span>AI-POWERED LUXURY ITINERARY GENERATOR</span>
          </motion.div>

          {/* Main Animated Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] font-sans"
          >
            Your World, <br />
            <span className="bg-gradient-to-r from-[#FF8533] via-[#E85D04] to-[#FFB703] bg-clip-text text-transparent drop-shadow-sm">
              Expertly Crafted.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-200/90 font-normal max-w-2xl leading-relaxed"
          >
            Experience bespoke journeys curated by artificial intelligence and refined by world-class travel experts. Tailored for solo adventurers, couples, and luxury seekers.
          </motion.p>

          {/* Primary CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
          >
            <button
              onClick={scrollToPlanner}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E85D04] to-[#F37216] hover:from-[#D4540A] hover:to-[#E85D04] text-white font-bold text-base sm:text-lg shadow-xl shadow-[#E85D04]/30 hover:shadow-2xl hover:shadow-[#E85D04]/50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <SparklesIcon />
              <span>Plan My Trip with AI</span>
            </button>

            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/25 text-white font-bold text-base sm:text-lg hover:border-white/40 transition-all duration-300"
            >
              <CompassIcon />
              <span>Explore Destinations</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom Section: Animated Counters & Scroll Indicator ── */}
      <div className="relative z-10 bg-black/40 backdrop-blur-md border-t border-white/10 py-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Counter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-12 w-full md:w-auto text-center md:text-left">
            {HERO_COUNTERS.map((counter) => (
              <div key={counter.label} className="space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {counter.isFloat ? (
                    <span>{counter.value}{counter.suffix}</span>
                  ) : (
                    <CountUp value={counter.value} suffix={counter.suffix} />
                  )}
                </p>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{counter.label}</p>
              </div>
            ))}
          </div>

          {/* Animated Scroll Down Indicator */}
          <button
            onClick={scrollToPlanner}
            className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer group"
          >
            <span>SCROLL TO EXPLORE</span>
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors animate-bounce">
              <ChevronDownIcon />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
