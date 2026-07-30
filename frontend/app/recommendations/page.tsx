"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { aiApiService } from "@/lib/services/ai-api";

// Icons
const SparklesIcon = ({ className = "h-5 w-[#5]" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2" />
  </svg>
);

const StarIcon = ({ className = "h-4 w-4 text-amber-400" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MapPinIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const BookmarkIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const CheckIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const POPULAR_DESTINATIONS = ["Gujarat", "Goa", "Dubai", "Bali", "Paris", "Switzerland", "Tokyo"];

export default function RecommendationsPage() {
  const [destination, setDestination] = useState("Gujarat");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // Fetch recommendations on mount or destination change
  const fetchRecommendations = async (dest: string) => {
    setIsLoading(true);
    try {
      const res = await aiApiService.generateRecommendations(dest, "Culture & Heritage", "Moderate", "couple", [
        "Culture",
        "Food",
        "Sightseeing",
        "Nature",
      ]);
      if (res.success && res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(destination);
  }, [destination]);

  const toggleSave = (id: string) => {
    setSavedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <DashboardLayout
      title="Personalized AI Recommendations"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Recommendations" }]}
    >
      <div className="space-y-8 pb-16">
        {/* Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#143326] via-[#1B4332] to-[#2D6A4F] text-white p-8 sm:p-10 shadow-2xl">
          <div className="relative z-10 space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-widest border border-white/15">
              <SparklesIcon /> Smart 0-100 Match Scoring Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Personalized <span className="text-[#E85D04]">AI Recommendations</span>
            </h1>
            <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed">
              Curated hotels, authentic dining, hidden gems, and local experiences for <span className="font-bold text-white">{destination}</span> backed by transparent AI selection reasoning.
            </p>

            {/* Quick Destination Selectors */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-white/60">Destination:</span>
              {POPULAR_DESTINATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDestination(d)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    destination.toLowerCase() === d.toLowerCase()
                      ? "bg-[#E85D04] text-white shadow-md"
                      : "bg-white/10 hover:bg-white/20 text-white/90"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100">
          {[
            { id: "all", label: "All Categories ✨" },
            { id: "hotels", label: "Hotels 🏨" },
            { id: "restaurants", label: "Dining & Cafes 🍽️" },
            { id: "experiences", label: "Local Experiences 🎭" },
            { id: "hiddenGems", label: "Hidden Gems 💎" },
            { id: "shopping", label: "Shopping 🛍️" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-[#1B4332] text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-md mx-auto">
            <div className="h-12 w-12 border-4 border-emerald-100 border-t-[#1B4332] rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-gray-900">Curating Personal Recommendations...</h3>
            <p className="text-xs text-gray-500">Calculating 0-100 Smart Match Scores for {destination}.</p>
          </div>
        ) : recommendations ? (
          <div className="space-y-10">
            {/* 1. HOTELS RECOMMENDATIONS */}
            {(activeCategory === "all" || activeCategory === "hotels") && recommendations.hotels && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                    🏨 Recommended Stays in {destination}
                  </h3>
                  <span className="text-xs font-semibold text-gray-400">Curated & Rated</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.hotels.map((hotel: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 space-y-4 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-extrabold">
                            {hotel.category || "Heritage Stay"}
                          </span>
                          <h4 className="font-extrabold text-base text-gray-900 mt-2">{hotel.name}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPinIcon /> {hotel.area} • {hotel.distance}
                          </p>
                        </div>

                        {/* Match Score Badge */}
                        <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-[#1B4332] to-emerald-700 text-white font-extrabold text-xs shadow-md">
                          {hotel.match_score || 94}% Match
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-gray-50">
                        <span className="text-[#E85D04] font-extrabold text-sm">{hotel.price}</span>
                        <span className="flex items-center gap-1 text-gray-700">
                          <StarIcon /> {hotel.rating || 4.8} / 5.0
                        </span>
                      </div>

                      {/* AI Selection Explanation */}
                      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 text-xs text-amber-900 space-y-1">
                        <span className="font-extrabold flex items-center gap-1">✨ AI Selection Reason:</span>
                        <p className="text-[11px] leading-relaxed text-amber-800">{hotel.ai_reason || hotel.reasonForRecommendation}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => toggleSave(`hotel-${idx}`)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            savedItems.has(`hotel-${idx}`) ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <BookmarkIcon /> {savedItems.has(`hotel-${idx}`) ? "Saved" : "Save"}
                        </button>

                        <Link
                          href="/planner"
                          className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold shadow-md hover:bg-[#143326]"
                        >
                          Add to Itinerary +
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. RESTAURANTS & CAFES */}
            {(activeCategory === "all" || activeCategory === "restaurants") && recommendations.restaurants && (
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  🍽️ Dining & Culinary Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.restaurants.map((rest: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 space-y-3 hover:shadow-xl transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-[11px] font-extrabold">
                            {rest.category || "Local Dining"}
                          </span>
                          <h4 className="font-extrabold text-base text-gray-900 mt-2">{rest.name}</h4>
                          <p className="text-xs text-gray-500">Cuisine: {rest.cuisine}</p>
                        </div>
                        <span className="px-3 py-1.5 rounded-2xl bg-[#1B4332] text-white font-extrabold text-xs">
                          {rest.match_score || 92}% Match
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 font-medium">Avg Cost: {rest.cost || rest.average_cost}</p>
                      <p className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-xl">💡 {rest.why_recommended || rest.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. HIDDEN GEMS */}
            {(activeCategory === "all" || activeCategory === "hiddenGems") && recommendations.hiddenGems && (
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  💎 Off-the-Beaten-Path Hidden Gems
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendations.hiddenGems.map((gem: any, idx: number) => (
                    <div key={idx} className="bg-gradient-to-br from-emerald-900 to-[#1B4332] text-white rounded-3xl p-6 shadow-xl space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                          📸 Photography Score: {gem.photography_score || 9}/10
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#E85D04] text-white font-extrabold text-xs">
                          Uncrowded 🌿
                        </span>
                      </div>

                      <h4 className="text-lg font-extrabold text-white">{gem.title}</h4>
                      <p className="text-xs text-white/80 leading-relaxed">{gem.special_reason}</p>
                      <div className="flex items-center justify-between text-xs text-white/70 pt-2 border-t border-white/10">
                        <span>Best Time: {gem.best_time}</span>
                        <span>Difficulty: {gem.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
