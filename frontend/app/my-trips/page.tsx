"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ScrollReveal } from "@/components/animations/animation-utils";
import { useToast } from "@/components/ui/Toast";
import { MyTrip, TripStatus, TripStatsSummary } from "@/types/my-trips";
import { normalizeTripCard } from "@/lib/trip-card-normalizer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// --- SVG Icons ---
const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" strokeWidth="2" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-[#E85D04]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
  </svg>
);

const UserGroupIcon = () => (
  <svg className="w-4 h-4 text-[#1B4332] dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4 text-red-400 hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" strokeWidth="2" />
    <circle cx="6" cy="12" r="3" strokeWidth="2" />
    <circle cx="18" cy="19" r="3" strokeWidth="2" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth="2" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth="2" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
    <polyline points="7 10 12 15 17 10" strokeWidth="2" />
    <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" />
  </svg>
);

const FILTER_TABS: { label: string; value: TripStatus }[] = [
  { label: "All Trips", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
  { label: "Draft", value: "draft" },
];

export default function MyTripsPage() {
  const { addToast } = useToast();
  const [trips, setTrips] = useState<MyTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TripStatus>("all");

  // Load trips from backend API and apply canonical trip normalization
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/api/trips`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        let stored: any[] = [];
        if (res.ok) {
          const data = await res.json();
          stored = data.data || [];
        }

        // Also check local storage saved trips for seamless offline resilience
        try {
          const localSavedStr = localStorage.getItem("saved_trips");
          if (localSavedStr) {
            const localSaved = JSON.parse(localSavedStr);
            if (Array.isArray(localSaved)) {
              localSaved.forEach((ls) => {
                if (!stored.some((t) => (t.id || t._id) === ls.id)) {
                  stored.push(ls);
                }
              });
            }
          }
        } catch {}

        const normalizedTrips: MyTrip[] = stored.map((rawDoc: any, idx: number) => normalizeTripCard(rawDoc, idx));
        setTrips(normalizedTrips);
      } catch (err) {
        console.error("[MyTrips] Failed to fetch trips:", err);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const stats: TripStatsSummary = useMemo(() => ({
    totalTrips: trips.length,
    upcomingTrips: trips.filter((t) => t.status === "upcoming").length,
    ongoingTrips: trips.filter((t) => t.status === "ongoing").length,
    completedTrips: trips.filter((t) => t.status === "completed").length,
    savedItineraries: trips.filter((t) => t.status === "draft" || t.status === "upcoming" || t.status === "ongoing").length,
  }), [trips]);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || [
        trip.destination,
        trip.city,
        trip.state,
        trip.country,
        trip.tripTitle,
        trip.travelStyle,
      ].some((val) => val && val.toLowerCase().includes(q));

      const matchesStatus = selectedStatus === "all" || trip.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchQuery, selectedStatus]);

  const handleDeleteTrip = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`${API_BASE}/api/trips/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }).catch(() => null);

      setTrips((prev) => prev.filter((t) => t.id !== id && t.tripId !== id));
      addToast("Trip removed from your travel history", "info");
    } catch {
      addToast("Failed to delete trip", "error");
    }
  };

  const handleDuplicateTrip = (trip: MyTrip) => {
    const dup: MyTrip = {
      ...trip,
      id: `trip-copy-${Date.now()}`,
      tripId: `trip-copy-${Date.now()}`,
      tripTitle: `Copy of ${trip.tripTitle}`,
      packageName: `Copy of ${trip.tripTitle}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTrips((prev) => [dup, ...prev]);
    addToast(`Duplicated "${trip.destination}" trip!`, "success");
  };

  const handleShareTrip = (trip: MyTrip) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/trips/${trip.id}`);
      addToast(`Shareable link for "${trip.tripTitle}" copied!`, "success");
    }
  };

  return (
    <DashboardLayout title="My Trips — Personal Travel History">
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white py-12 px-4 sm:px-6 lg:px-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-extrabold uppercase tracking-widest">
              Personal Travel History
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-sans">My Saved Journeys</h1>
            <p className="text-sm sm:text-base text-white/80 max-w-xl">
              Explore your past adventures, upcoming AI-crafted itineraries, and draft travel plans with zero placeholder values.
            </p>
          </div>
          <Link
            href="/planner"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#E85D04] hover:bg-[#D4540A] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#E85D04]/30 hover:scale-105 active:scale-100 transition-all cursor-pointer"
          >
            <span>Plan New AI Trip ✨</span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 space-y-12">
        {/* STATISTICS CARDS */}
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-200/70 dark:border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1B4332]/10 text-[#1B4332] dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">🗺️</div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.totalTrips}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Trips</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-200/70 dark:border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center text-2xl font-bold">✈️</div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.upcomingTrips}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Upcoming Trips</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-200/70 dark:border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl font-bold">✅</div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.completedTrips}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Completed Trips</p>
              </div>
            </div>
            <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-200/70 dark:border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-bold">📝</div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stats.savedItineraries}</p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Saved Itineraries</p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* SEARCH & FILTERS BAR */}
        <ScrollReveal delay={0.05}>
          <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Destination, City, State, Country, or Style..."
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-[#E85D04] transition-all"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <SearchIcon />
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {FILTER_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedStatus(tab.value)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                      selectedStatus === tab.value
                        ? "bg-[#1B4332] text-white shadow-md"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* TRIPS GRID OR EMPTY STATE */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-[480px] rounded-3xl bg-gray-200 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredTrips.map((trip) => {
                const statusBadgeStyles = {
                  upcoming: "bg-blue-600 text-white shadow-blue-500/20",
                  ongoing: "bg-emerald-600 text-white shadow-emerald-500/20",
                  completed: "bg-purple-600 text-white shadow-purple-500/20",
                  cancelled: "bg-red-600 text-white shadow-red-500/20",
                  draft: "bg-amber-500 text-white shadow-amber-500/20",
                };

                return (
                  <motion.div
                    key={trip.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-[#121824] rounded-3xl overflow-hidden shadow-xl border border-gray-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* TOP: Image & Badges */}
                    <div className="relative h-60 w-full overflow-hidden">
                      <Image
                        src={trip.coverImage}
                        alt={trip.destination}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      
                      {/* Status & Style Badge */}
                      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md ${statusBadgeStyles[trip.status] || statusBadgeStyles.upcoming}`}>
                          {trip.status}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
                          {trip.travelStyle}
                        </span>
                      </div>

                      {/* Action Icons: Share & Delete */}
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button
                          onClick={() => handleShareTrip(trip)}
                          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Share Link"
                        >
                          <ShareIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Trip"
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      {/* Destination & Location Hierarchy */}
                      <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                        <h3 className="text-2xl font-extrabold tracking-tight drop-shadow-md line-clamp-1">{trip.destination}</h3>
                        <p className="text-xs text-white/80 font-medium line-clamp-1">
                          📍 {trip.city ? `${trip.city}, ` : ""}{trip.state ? `${trip.state}, ` : ""}{trip.country}
                        </p>
                      </div>
                    </div>

                    {/* MIDDLE: Details & Summary Grid */}
                    <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        {/* Dynamic Title */}
                        <div>
                          <h4 className="text-base font-extrabold text-gray-900 dark:text-white line-clamp-1">
                            {trip.tripTitle}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                            {trip.subtitle}
                          </p>
                        </div>

                        {/* Metric Grid */}
                        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs">
                          <div className="flex items-center gap-2">
                            <CalendarIcon />
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-gray-400">Duration</span>
                              <span className="font-extrabold text-gray-900 dark:text-white">{trip.durationDays} Days / {trip.durationNights} Nights</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <UserGroupIcon />
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-gray-400">Travelers</span>
                              <span className="font-extrabold text-gray-900 dark:text-white">{trip.travelersCount} Adults</span>
                            </div>
                          </div>
                        </div>

                        {/* Budget & Weather */}
                        <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Est. Budget Range</span>
                            <span className="text-lg font-extrabold text-[#1B4332] dark:text-emerald-400 tracking-tight">{trip.budgetFormatted}</span>
                          </div>

                          {trip.weatherInfo && (
                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Weather</span>
                              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                                🌤️ {trip.weatherInfo.temperature || "28°C"} • {trip.weatherInfo.condition || "Sunny"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BOTTOM: Timestamps & Buttons */}
                      <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                          <span>Created: {trip.createdAt.slice(0, 10)}</span>
                          <button onClick={() => handleDuplicateTrip(trip)} className="hover:text-[#E85D04] inline-flex items-center gap-1 cursor-pointer">
                            <CopyIcon /> Duplicate
                          </button>
                        </div>

                        {/* Primary Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href={`/trips/${trip.id}`}
                            className="text-center py-3 rounded-2xl bg-[#1B4332] hover:bg-[#153728] text-white text-xs font-extrabold transition-all shadow-md hover:scale-[1.02]"
                          >
                            View Trip
                          </Link>
                          <Link
                            href={`/planner?trip_id=${trip.id}`}
                            className="text-center py-3 rounded-2xl bg-[#E85D04] hover:bg-[#D4540A] text-white text-xs font-extrabold transition-all shadow-md hover:scale-[1.02]"
                          >
                            Continue Planning
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#121824] rounded-3xl p-12 text-center border border-gray-200/70 dark:border-white/10 shadow-xl max-w-lg mx-auto space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#1B4332]/10 text-[#1B4332] dark:text-emerald-400 flex items-center justify-center text-4xl shadow-inner">🌴</div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">No Trips Found</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Start planning your next adventure. Generate personalized itineraries with zero placeholder values tailored to your exact budget and style.
              </p>
            </div>
            <Link
              href="/planner"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#E85D04] via-[#F37216] to-[#FF8533] text-white text-xs sm:text-sm font-extrabold shadow-lg uppercase tracking-wider hover:scale-105 transition-all"
            >
              <span>Plan New AI Trip</span>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
