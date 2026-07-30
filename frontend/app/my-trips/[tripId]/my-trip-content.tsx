"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ScrollReveal } from "@/components/animations/animation-utils";
import { normalizeLegacyTrip, type NormalizedTrip } from "@/types/shared-trip";
import { renderSafe } from "@/lib/render-safe";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function MyTripContent() {
  const params = useParams();
  const [trip, setTrip] = useState<any | null>(null);
  const [normalizedTrip, setNormalizedTrip] = useState<NormalizedTrip | null>(null);
  const [loading, setLoading] = useState(true);

  const tripId = params.tripId as string;

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/api/trips/${tripId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch trip details");
        const data = await res.json();
        const raw = data.data;
        setTrip(raw);

        const normalized = raw?.full_itinerary
          ? normalizeLegacyTrip(raw.full_itinerary)
          : normalizeLegacyTrip(raw);
          
        setNormalizedTrip(normalized);
      } catch (err) {
        console.error("Failed to fetch trip details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (tripId) fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <DashboardLayout title="Trip Details">
        <div className="flex items-center justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1B4332] border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  const t = normalizedTrip;
  if (!t) {
    return (
      <DashboardLayout title="Trip Not Found">
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <p className="text-gray-500">Trip data could not be loaded.</p>
          <Link href="/my-trips" className="text-[#E85D04] font-bold text-sm hover:underline">Back to My Trips</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${t.destination} — Trip Itinerary`}>
      {/* HERO BANNER */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image
          src={trip?.cover_image || t.cover_image || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80"}
          alt={t.destination}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-8 left-4 sm:left-10 right-4 sm:right-10 text-white max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-[#E85D04] text-white text-xs font-extrabold uppercase tracking-wider shadow">
              {t.status}
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold mt-2 font-sans tracking-tight">{renderSafe(t.destinationOverview?.destination || t.destination)}</h1>
            <p className="text-sm sm:text-base text-white/80 font-medium mt-2 max-w-2xl">
              {renderSafe(t.destinationOverview?.famousFor || "An incredible journey awaits.")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => window.print()} className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm backdrop-blur-md transition-colors cursor-pointer">Download PDF</button>
            <Link href={`/planner?trip_id=${tripId}`} className="px-6 py-3.5 rounded-full bg-[#E85D04] hover:bg-[#D4540A] text-white font-extrabold text-sm shadow-lg transition-transform hover:scale-105">Modify with AI</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-10 space-y-12">
        
        {/* 1. DESTINATION OVERVIEW & WEATHER */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white border-b pb-4 dark:border-white/10">Destination Overview</h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div><span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Currency</span><p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{renderSafe(t.destinationOverview?.currency)}</p></div>
                <div><span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Language</span><p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{renderSafe(t.destinationOverview?.language)}</p></div>
                <div><span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Best Time</span><p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{renderSafe(t.destinationOverview?.bestTime)}</p></div>
                <div><span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Map Coordinates</span><p className="text-lg font-bold text-[#E85D04] mt-1">{renderSafe(t.destinationOverview?.mapCoordinates)}</p></div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white border-b pb-4 dark:border-white/10">Expected Weather</h2>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div className="col-span-2"><span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Current / Typical</span><p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{renderSafe(t.destinationOverview?.currentWeather)}</p></div>
                <div><span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Temperature</span><p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{renderSafe(t.destinationOverview?.temperature)}</p></div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2. TRIP HIGHLIGHTS */}
        {t.tripHighlights && (
          <ScrollReveal delay={0.05}>
            <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white border-b pb-4 dark:border-white/10">Trip Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(t.tripHighlights).filter(([, val]) => Array.isArray(val) && val.length > 0).map(([key, list]) => (
                  <div key={key} className="space-y-2">
                    <h3 className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">{key.replace(/([A-Z])/g, " $1").trim()}</h3>
                    <ul className="space-y-1">
                      {(list as string[]).map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-800 dark:text-gray-200 flex items-start gap-2">
                          <span className="text-[#E85D04] mt-0.5">•</span>
                          <span>{renderSafe(item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 3. ROUTE OPTIMIZATION */}
        {t.routeOptimization && t.routeOptimization.summary && (
          <ScrollReveal delay={0.1}>
            <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] rounded-3xl p-8 shadow-2xl text-white space-y-6">
              <h2 className="text-2xl font-extrabold border-b border-white/20 pb-4">Route Optimization Strategy</h2>
              <p className="text-lg text-white/90 leading-relaxed font-medium">{renderSafe(t.routeOptimization.summary)}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
                <div><span className="block text-xs font-bold text-white/60 uppercase">Total Distance</span><p className="text-2xl font-bold mt-1">{renderSafe(t.routeOptimization.totalDistance)}</p></div>
                <div><span className="block text-xs font-bold text-white/60 uppercase">Travel Time</span><p className="text-2xl font-bold mt-1">{renderSafe(t.routeOptimization.totalTravelTime)}</p></div>
                <div><span className="block text-xs font-bold text-white/60 uppercase">Fuel Estimate</span><p className="text-2xl font-bold mt-1">{renderSafe(t.routeOptimization.fuelEstimate)}</p></div>
                <div><span className="block text-xs font-bold text-white/60 uppercase">Avoid Backtracking</span><p className="text-sm font-medium mt-1">{renderSafe(t.routeOptimization.avoidBacktrackingStrategy)}</p></div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 4. DAY-WISE ITINERARY */}
        {t.dailyItinerary && t.dailyItinerary.length > 0 && (
          <ScrollReveal delay={0.15}>
            <div className="space-y-8">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Day-by-Day Itinerary</h2>
              <div className="space-y-6">
                {t.dailyItinerary.map((day: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6 transition-all hover:shadow-2xl">
                    <div className="flex items-center gap-4 border-b pb-4 dark:border-white/10">
                      <span className="w-12 h-12 rounded-2xl bg-[#E85D04] text-white flex items-center justify-center text-xl font-extrabold shadow-lg">
                        {renderSafe(day.dayNumber) || idx + 1}
                      </span>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{renderSafe(day.title)}</h3>
                    </div>

                    {day.activities && day.activities.length > 0 && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {day.activities.map((act: any, aidx: number) => (
                          <div key={aidx} className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-lg font-bold text-[#1B4332] dark:text-emerald-400">{renderSafe(act.placeName)}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">📍 {renderSafe(act.address)}</p>
                              </div>
                              <span className="px-2.5 py-1 rounded-lg bg-[#E85D04]/10 text-[#E85D04] text-xs font-extrabold">{renderSafe(act.bestTime)}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-black/20 p-3 rounded-xl">
                              <div><span className="font-semibold text-gray-900 dark:text-white">Distance:</span> {renderSafe(act.distance)}</div>
                              <div><span className="font-semibold text-gray-900 dark:text-white">Travel:</span> {renderSafe(act.travelTime)}</div>
                              <div><span className="font-semibold text-gray-900 dark:text-white">Rating:</span> ⭐ {renderSafe(act.rating)}</div>
                              <div><span className="font-semibold text-gray-900 dark:text-white">Duration:</span> {renderSafe(act.expectedDuration)}</div>
                            </div>
                            
                            <div className="flex justify-between text-xs font-bold pt-2 border-t dark:border-white/10">
                              <span className="text-gray-500">⏱️ {renderSafe(act.openingHours)}</span>
                              <span className="text-emerald-600 dark:text-emerald-400">💵 {renderSafe(act.entryFee)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 5. HOTELS & 6. RESTAURANTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {t.hotels && Object.keys(t.hotels).length > 0 && (
            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Hotel Options</h3>
                <div className="space-y-6">
                  {Object.entries(t.hotels).filter(([, list]) => Array.isArray(list) && list.length > 0).map(([tier, list]) => (
                    <div key={tier} className="space-y-3">
                      <h4 className="text-sm font-extrabold text-[#E85D04] uppercase tracking-widest">{tier} Tier</h4>
                      {(list as any[]).map((h, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div>
                            <p className="text-base font-bold text-gray-900 dark:text-white">{renderSafe(h.name)}</p>
                            <p className="text-xs text-gray-500 mt-1">⭐ {renderSafe(h.rating)} • {renderSafe(h.distanceFromAttraction)}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-extrabold text-[#1B4332] dark:text-emerald-400">{renderSafe(h.price)}</p>
                            {h.bookingLink && <p className="text-[10px] text-blue-500 hover:underline cursor-pointer">{renderSafe(h.bookingLink)}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {t.restaurants && Object.keys(t.restaurants).length > 0 && (
            <ScrollReveal delay={0.25}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Culinary Guide</h3>
                <div className="space-y-6">
                  {Object.entries(t.restaurants).filter(([, list]) => Array.isArray(list) && list.length > 0).map(([meal, list]) => (
                    <div key={meal} className="space-y-3">
                      <h4 className="text-sm font-extrabold text-[#E85D04] uppercase tracking-widest">{meal}</h4>
                      {(list as any[]).map((r, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div>
                            <p className="text-base font-bold text-gray-900 dark:text-white">{renderSafe(r.name)}</p>
                            <p className="text-xs text-gray-500 mt-1">🍽️ {renderSafe(r.cuisine)} • ⭐ {renderSafe(r.rating)}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">📍 {renderSafe(r.distance)}</p>
                          </div>
                          <p className="text-base font-extrabold text-[#1B4332] dark:text-emerald-400">{renderSafe(r.price)}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* 7. TRANSPORTATION & 8. COST BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {t.transportation && Object.keys(t.transportation).length > 0 && (
            <ScrollReveal delay={0.3}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Local Transportation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(t.transportation).filter(([, val]) => val && val.toString().trim() !== "").map(([mode, detail]) => (
                    <div key={mode} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                      <h4 className="text-xs font-extrabold text-gray-400 uppercase">{mode.replace(/([A-Z])/g, " $1").trim()}</h4>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-2 leading-snug">{renderSafe(detail)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {t.costBreakdown && Object.keys(t.costBreakdown).length > 0 && (
            <ScrollReveal delay={0.35}>
              <div className="bg-[#1B4332] rounded-3xl p-8 shadow-xl border border-[#2D6A4F] text-white space-y-6">
                <h3 className="text-2xl font-extrabold">Detailed Cost Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(t.costBreakdown).filter(([k]) => k !== "grandTotal").map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center text-sm font-medium border-b border-white/10 pb-2">
                      <span className="capitalize text-white/80">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span>{renderSafe(val)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 text-xl font-extrabold text-[#E85D04]">
                    <span>Grand Total</span>
                    <span>{renderSafe(t.costBreakdown.grandTotal)}</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* 9. PACKING & 10. WEATHER FORECAST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {t.packingChecklist && Object.keys(t.packingChecklist).length > 0 && (
            <ScrollReveal delay={0.4}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6 h-full">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white border-b pb-4 dark:border-white/10">Packing Checklist</h3>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(t.packingChecklist).filter(([, items]) => Array.isArray(items) && items.length > 0).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-xs font-extrabold text-[#E85D04] uppercase tracking-wider">{category.replace(/([A-Z])/g, " $1").trim()}</h4>
                      <ul className="space-y-1">
                        {(items as string[]).map((item, idx) => (
                          <li key={idx} className="text-[11px] text-gray-700 dark:text-gray-300 flex items-start gap-1.5"><span className="text-gray-400">□</span> {renderSafe(item)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {t.weatherForecast && t.weatherForecast.length > 0 && (
            <ScrollReveal delay={0.45}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6 h-full">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white border-b pb-4 dark:border-white/10">Daily Weather Forecast</h3>
                <div className="space-y-3">
                  {t.weatherForecast.map((w: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <p className="text-sm font-extrabold text-sky-900 dark:text-sky-300">Day {renderSafe(w.dayNumber) || idx + 1}</p>
                        <p className="text-xs text-sky-700 dark:text-sky-400 mt-1">Temp: {renderSafe(w.temperature)} • Rain: {renderSafe(w.rainChance)}</p>
                      </div>
                      <div className="text-xs text-sky-800 dark:text-sky-200 text-left sm:text-right">
                        <p>Humidity: {renderSafe(w.humidity)}</p>
                        <p className="mt-0.5">☀️ {renderSafe(w.sunrise)} 🌙 {renderSafe(w.sunset)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* 11. EMERGENCY & 12. LOCAL TIPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {t.emergencyInformation && Object.keys(t.emergencyInformation).length > 0 && (
            <ScrollReveal delay={0.5}>
              <div className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-8 shadow-xl border border-red-100 dark:border-red-900/30 space-y-6 h-full">
                <h3 className="text-2xl font-extrabold text-red-900 dark:text-red-400 border-b border-red-200 dark:border-red-900/50 pb-4">Emergency Information</h3>
                <div className="space-y-4">
                  {Object.entries(t.emergencyInformation).filter(([, val]) => val && val.toString().trim() !== "").map(([key, val]) => (
                    <div key={key}>
                      <span className="block text-xs font-bold text-red-800/60 dark:text-red-400/60 uppercase">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <p className="text-sm font-bold text-red-950 dark:text-red-300 mt-1">{renderSafe(val)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}

          {t.localTips && Object.keys(t.localTips).length > 0 && (
            <ScrollReveal delay={0.55}>
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-8 shadow-xl border border-gray-200/70 dark:border-white/10 space-y-6 h-full">
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white border-b pb-4 dark:border-white/10">Local & Safety Tips</h3>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(t.localTips).filter(([, items]) => Array.isArray(items) && items.length > 0).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-xs font-extrabold text-[#1B4332] dark:text-emerald-400 uppercase tracking-wider">{category.replace(/([A-Z])/g, " $1").trim()}</h4>
                      <ul className="space-y-1">
                        {(items as string[]).map((item, idx) => (
                          <li key={idx} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-1.5"><span className="text-[#E85D04]">!</span> <span>{renderSafe(item)}</span></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
