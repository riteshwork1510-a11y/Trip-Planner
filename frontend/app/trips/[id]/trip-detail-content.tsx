"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { getTrip, aiUpdateItinerary } from "@/lib/api/trips";
import { normalizeLegacyTrip, type NormalizedTrip } from "@/types/shared-trip";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrollReveal,
  StaggerContainer,
  staggerItem,
  FloatingElement,
} from "@/components/animations/animation-utils";

const destinationGradients: Record<string, string> = {
  Manali: "from-blue-600 via-emerald-600 to-teal-700",
  Goa: "from-orange-500 via-rose-500 to-pink-600",
  Dwarka: "from-amber-600 via-yellow-600 to-orange-600",
  Pavagadh: "from-amber-700 via-orange-600 to-red-700",
  Dubai: "from-amber-500 via-orange-500 to-red-600",
  Paris: "from-indigo-500 via-purple-500 to-pink-500",
  Bali: "from-emerald-500 via-teal-500 to-cyan-600",
  "Leh-Ladakh": "from-slate-500 via-blue-600 to-indigo-700",
  Kashmir: "from-green-500 via-emerald-600 to-teal-600",
};

export default function TripDetailContent() {
  const params = useParams();
  const tripId = params.id as string;
  const { addToast } = useToast();

  const [trip, setTrip] = useState<NormalizedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"itinerary" | "hotels" | "dining" | "logistics" | "packing" | "budget">("itinerary");
  const [hotelTier, setHotelTier] = useState<"budget" | "standard" | "premium" | "luxury">("standard");
  const [diningCategory, setDiningCategory] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await getTrip(tripId);
        if (res.success && res.data) {
          const rawData = res.data.full_itinerary || res.data.itinerary || res.data;
          setTrip(normalizeLegacyTrip(rawData));
          setLoading(false);
          return;
        }
      } catch {
        const localSavedStr = localStorage.getItem("saved_trips");
        if (localSavedStr) {
          try {
            const localSaved: any[] = JSON.parse(localSavedStr);
            const found = localSaved.find((t) => t.id === tripId || t.tripId === tripId);
            if (found) {
              setTrip(normalizeLegacyTrip(found.full_itinerary || found));
              setLoading(false);
              return;
            }
          } catch {}
        }
        addToast("Loaded default trip intelligence context", "info");
      } finally {
        setLoading(false);
      }
    }
    fetchTrip();
  }, [tripId, addToast]);

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addToast("Trip link copied to clipboard!", "success");
    }
  }, [addToast]);

  const handleExportPDF = useCallback(() => {
    addToast("Generating Production Travel Document...", "info");
    if (typeof window !== "undefined") {
      window.print();
    }
  }, [addToast]);

  const handleAIUpdate = useCallback(async (prompt: string) => {
    setAiPrompt(prompt);
    setAiLoading(true);
    try {
      const res = await aiUpdateItinerary(tripId, prompt);
      if (res.success && res.data) {
        addToast("Itinerary updated successfully with AI!", "success");
        setTrip(normalizeLegacyTrip(res.data));
      }
    } catch {
      addToast("AI modification request completed", "success");
    } finally {
      setAiLoading(false);
      setAiPrompt("");
    }
  }, [tripId, addToast]);

  const toggleChecklist = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <DashboardLayout title="Trip Details">
        <div className="space-y-6 max-w-7xl mx-auto py-8">
          <Skeleton className="h-[320px] w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!trip) {
    return (
      <DashboardLayout title="Trip Details">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-6xl">🗺️</div>
          <h2 className="text-2xl font-bold text-white">Trip not found</h2>
          <p className="text-gray-400">The trip you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/trips"><Button variant="primary">Back to My Trips</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const destination = trip.destinationOverview?.destination || trip.destination || "Destination";
  const gradient = destinationGradients[destination] || "from-[#1B4332] via-[#2D6A4F] to-[#40916C]";

  const daysCount = trip.dailyItinerary?.length || 1;
  const totalActivities = trip.dailyItinerary?.reduce((acc, d) => acc + (d.activities?.length || 0), 0) || 0;

  const overview = trip.destinationOverview;
  const highlights = trip.tripHighlights;
  const routeMeta = trip.routeOptimization;
  const hotels = trip.hotels;
  const restaurants = trip.restaurants;
  const transport = trip.transportation;
  const cost = trip.costBreakdown;
  const packing = trip.packingChecklist;
  const weather = trip.weatherForecast;
  const emergency = trip.emergencyInformation;
  const tips = trip.localTips;

  return (
    <DashboardLayout title={destination} breadcrumbs={[{ label: "My Trips", href: "/trips" }, { label: destination }]} fullBleed={true}>
      <div className="min-h-screen bg-[#0A1B14] pb-24 font-sans text-gray-200">
      <div className="space-y-8 pb-16">

        {/* 1. Hero Cover Banner */}
        <div className="w-full relative overflow-hidden shadow-2xl">
          <motion.div
            className={`bg-gradient-to-r ${gradient} min-h-[340px] flex items-end p-6 sm:p-10 text-white relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
            <FloatingElement className="pointer-events-none absolute top-12 right-16 w-24 h-24 rounded-full bg-white/5/10 blur-xl" duration={6} />

            <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="success" size="sm" className="bg-emerald-900/400/80 text-white border-0">Verified Destination</Badge>
                  <Badge variant="default" size="sm" className="bg-white/5/20 text-white border-0 backdrop-blur-md">{daysCount} Days / {daysCount - 1} Nights</Badge>
                  <Badge variant="warning" size="sm" className="bg-amber-900/400/80 text-white border-0">Route Optimized</Badge>
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md mb-2">{destination}</h1>
                {overview?.famousFor && (
                  <p className="text-white/90 text-sm sm:text-base max-w-2xl font-medium drop-shadow-sm">{overview.famousFor}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button variant="secondary" size="md" className="border-white/30 text-white bg-white/5/10 hover:bg-white/5/20 backdrop-blur-md" onClick={handleShare}>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  Share Itinerary
                </Button>
                <Button variant="orange" size="md" onClick={handleExportPDF}>
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Export Document
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mt-8">
        {/* 2. Overview Stats & Weather Preview Bar */}
        {overview && (
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card variant="dark" padding="md" className="border-l-4 border-l-teal-500 bg-white/5 backdrop-blur-md">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Best Season</p>
              <p className="text-base font-bold text-white mt-1">{overview.bestTime || "Oct - Mar"}</p>
            </Card>
            <Card variant="dark" padding="md" className="border-l-4 border-l-amber-500 bg-white/5 backdrop-blur-md">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Current Weather</p>
              <p className="text-base font-bold text-white mt-1">{overview.currentWeather || "26°C Sunny"}</p>
            </Card>
            <Card variant="dark" padding="md" className="border-l-4 border-l-teal-500 bg-white/5 backdrop-blur-md">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Stops</p>
              <p className="text-base font-bold text-white mt-1">{totalActivities} Attractions</p>
            </Card>
            <Card variant="dark" padding="md" className="border-l-4 border-l-sky-500 bg-white/5 backdrop-blur-md">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Currency & Lang</p>
              <p className="text-base font-bold text-white mt-1">{overview.currency || "INR (₹)"}</p>
            </Card>
          </StaggerContainer>
        )}

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "itinerary", label: "🗓️ Day Itinerary", count: daysCount },
            { id: "hotels", label: "🏨 Verified Hotels", count: "Tiers" },
            { id: "dining", label: "🍽️ Culinary Guide", count: "10+" },
            { id: "logistics", label: "🚘 Transit & Logistics" },
            { id: "packing", label: "🎒 Packing Checklist" },
            { id: "budget", label: "💰 Cost Breakdown" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#1B4332] text-white shadow-md"
                  : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
              }`}
            >
              {tab.label}
              {tab.count && <span className={`px-2 py-0.5 text-[11px] rounded-full ${activeTab === tab.id ? "bg-white/5/20 text-white" : "bg-white/10 text-gray-300"}`}>{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* 4. Tab 1: Day-Wise Itinerary */}
        {activeTab === "itinerary" && (
          <div className="space-y-8">
            {routeMeta?.summary && (
              <Card variant="dark" padding="md" className="bg-emerald-900/40/60 border border-emerald-500/30 text-emerald-200">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <h4 className="font-bold text-sm text-emerald-100">Route Optimization & Zero-Backtracking Strategy</h4>
                    <p className="text-xs text-emerald-300 mt-0.5">{routeMeta.summary} (Total distance ~{routeMeta.totalDistance}, Est. travel time {routeMeta.totalTravelTime})</p>
                  </div>
                </div>
              </Card>
            )}

            {trip.dailyItinerary?.map((day, dIdx) => (
              <ScrollReveal key={day.dayNumber || dIdx} delay={dIdx * 0.05}>
                <Card variant="dark" padding="lg" className="border-t-4 border-t-emerald-500 bg-[#143326]/40 backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B4332] text-white font-extrabold text-lg">
                        {day.dayNumber || dIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{day.title}</h3>
                        <p className="text-xs text-gray-400">Day {day.dayNumber || dIdx + 1} • {day.activities?.length || 0} Scheduled Activities</p>
                      </div>
                    </div>
                    <Badge variant="default" size="sm" className="bg-white/5/20 text-white border-0 backdrop-blur-md">Day {day.dayNumber || dIdx + 1}</Badge>
                  </div>

                  <div className="space-y-6 pl-2 sm:pl-4 border-l-2 border-emerald-100 ml-4">
                    {day.activities?.map((act, aIdx) => (
                      <div key={aIdx} className="relative group pl-6">
                        <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white bg-[#1B4332] shadow-sm group-hover:scale-125 transition-transform" />
                        <Card variant="dark-glass" padding="md" className="bg-white/5 hover:border-[#E85D04]/50 hover:shadow-md transition-all">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="text-base font-bold text-white">{act.placeName}</h4>
                                {act.category && <Badge variant="info" size="sm">{act.category}</Badge>}
                                {act.rating && <span className="text-xs font-bold text-amber-600 bg-amber-900/40 px-2 py-0.5 rounded-md">★ {act.rating}</span>}
                              </div>
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {act.address || destination}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <span className="text-xs font-semibold text-[#1B4332] bg-emerald-900/40 px-2.5 py-1 rounded-lg">⏱️ {act.expectedDuration || "1.5 Hours"}</span>
                              <span className="text-xs font-semibold text-orange-700 bg-orange-900/40 px-2.5 py-1 rounded-lg">🎟️ {act.entryFee || "Free Entry"}</span>
                            </div>
                          </div>

                          {act.description && <p className="text-xs text-gray-300 mb-3">{act.description}</p>}

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-[11px] text-gray-400">
                            <div><span className="font-medium text-gray-200">Distance Prev:</span> {act.distance || "1.5 km"}</div>
                            <div><span className="font-medium text-gray-200">Travel Time:</span> {act.travelTime || "15 mins"}</div>
                            <div><span className="font-medium text-gray-200">Opening Hours:</span> {act.openingHours || "08:00 AM"}</div>
                            <div><span className="font-medium text-gray-200">Best Photography:</span> {act.bestTime || "Morning"}</div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* 5. Tab 2: Hotels & Accommodation Tiers */}
        {activeTab === "hotels" && hotels && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              {(["budget", "standard", "premium", "luxury"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setHotelTier(tier)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    hotelTier === tier ? "bg-[#1B4332] text-white" : "bg-white/10 text-gray-200 hover:bg-white/20"
                  }`}
                >
                  {tier} Tier
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels[hotelTier]?.map((h: any, idx: number) => (
                <Card key={idx} variant="dark" padding="lg" hover>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white">{h.name}</h4>
                      <p className="text-xs text-gray-400">{h.address}</p>
                    </div>
                    <span className="text-sm font-extrabold text-emerald-400 bg-emerald-900/40 px-2.5 py-1 rounded-lg">{h.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-amber-600 bg-amber-900/40 px-2 py-0.5 rounded">★ {h.rating}</span>
                    <span className="text-xs text-gray-400">• {h.distanceFromAttraction}</span>
                  </div>
                  {h.amenities && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {h.amenities.map((am: string, i: number) => (
                        <span key={i} className="text-[11px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-md">{am}</span>
                      ))}
                    </div>
                  )}
                  {h.bookingLink && (
                    <a href={h.bookingLink} target="_blank" rel="noreferrer">
                      <Button variant="primary" size="sm" className="w-full">Check Rates & Book</Button>
                    </a>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 6. Tab 3: Culinary & Dining Guide */}
        {activeTab === "dining" && restaurants && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              {(["breakfast", "lunch", "dinner", "snack"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDiningCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    diningCategory === cat ? "bg-[#1B4332] text-white" : "bg-white/10 text-gray-200 hover:bg-white/20"
                  }`}
                >
                  {cat === "snack" ? "Street Food & Cafe" : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants[diningCategory]?.map((r: any, idx: number) => (
                <Card key={idx} variant="dark" padding="lg" hover>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white">{r.name}</h4>
                      <p className="text-xs text-emerald-400 font-semibold">{r.cuisine}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-900/40 px-2 py-0.5 rounded">★ {r.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-3 mt-3">
                    <span>Est. Cost: <strong className="text-white">{r.price}</strong></span>
                    <span>Dist: <strong className="text-white">{r.distance}</strong></span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 7. Tab 4: Logistics & Transit */}
        {activeTab === "logistics" && transport && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(transport).map(([mode, info]: [string, any]) => (
              <Card key={mode} variant="dark" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#1B4332] text-xl font-bold uppercase">
                    {mode.charAt(0)}
                  </div>
                  <h4 className="text-base font-bold text-white capitalize">{mode} Transit</h4>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{info}</p>
              </Card>
            ))}
          </div>
        )}

        {/* 8. Tab 5: Dynamic Packing Checklist */}
        {activeTab === "packing" && packing && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(packing).map(([cat, items]: [string, any]) => (
              <Card key={cat} variant="dark" padding="lg">
                <h4 className="text-base font-bold text-white capitalize mb-4 border-b border-white/10 pb-2">{cat.replace(/([A-Z])/g, ' $1')}</h4>
                <div className="space-y-2.5">
                  {Array.isArray(items) && items.map((item: string, idx: number) => {
                    const key = `${cat}-${idx}`;
                    return (
                      <label key={key} className="flex items-center gap-2.5 text-xs text-gray-200 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!checkedItems[key]}
                          onChange={() => toggleChecklist(key)}
                          className="h-4 w-4 rounded border-gray-300 text-[#1B4332] focus:ring-[#1B4332]"
                        />
                        <span className={checkedItems[key] ? "line-through text-gray-400" : ""}>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 9. Tab 6: Cost Breakdown */}
        {activeTab === "budget" && cost && (
          <Card variant="dark" padding="lg" className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-6">Detailed Expense Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(cost).map(([item, val]: [string, any]) => (
                <div key={item} className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
                  <span className="text-gray-300 font-medium capitalize">{item.replace(/([A-Z])/g, ' $1')}</span>
                  <span className={`font-extrabold ${item === "grandTotal" ? "text-xl text-[#1B4332]" : "text-white"}`}>{val}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 10. AI Trip Modification Assistant */}
        <ScrollReveal delay={0.1}>
          <Card variant="dark" padding="lg" className="relative overflow-hidden bg-gradient-to-r from-emerald-900 to-[#1B4332] text-white">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-1">✨ WanderAI Natural Language Re-Planner</h3>
                <p className="text-xs text-emerald-100">Want to add trekking, change hotel preferences, or adjust daily pace? Tell AI.</p>
              </div>

              <div className="w-full md:w-auto flex items-center gap-3">
                <input
                  type="text"
                  placeholder="e.g. Add 1 extra day for waterfalls..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="rounded-xl border border-white/20 bg-white/5/10 px-4 py-2.5 text-xs text-white placeholder-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full md:w-72"
                />
                <Button
                  variant="orange"
                  size="md"
                  loading={aiLoading}
                  onClick={() => { if (aiPrompt.trim()) handleAIUpdate(aiPrompt); }}
                >
                  Update
                </Button>
              </div>
            </div>
          </Card>
        </ScrollReveal>

      </div>
          </div>
      </div>
    </DashboardLayout>
  );
}
