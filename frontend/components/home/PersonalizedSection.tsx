"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollReveal, StaggerContainer, staggerItem } from "@/components/animations/animation-utils";

export default function PersonalizedSection() {
  const { user } = useAuth();

  if (!user) return null; // Show only when user is logged in

  const savedTrips = [
    { id: "trip-1", destination: "Dubai Skyline & Safari", dates: "12 Aug - 17 Aug", status: "Upcoming", statusBg: "bg-emerald-500/20 text-emerald-400" },
    { id: "trip-2", destination: "Bali Luxury Villa Retreat", dates: "20 Sep - 25 Sep", status: "Draft Saved", statusBg: "bg-amber-500/20 text-amber-400" },
  ];

  const recentSearches = ["Paris Honeymoon", "Swiss Alps", "Goa Beach Villas", "Kerala Backwaters"];

  return (
    <section className="py-12 bg-gray-900 text-white border-y border-white/10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E85D04]">Personalized Dashboard</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {user?.full_name?.split(" ")[0] || "Traveler"} 👋
              </h2>
            </div>
            <Link
              href="/trips"
              className="text-sm font-bold text-[#E85D04] hover:underline"
            >
              View All My Trips ({savedTrips.length}) →
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Saved / Upcoming Trips */}
          <motion.div variants={staggerItem} className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Continue Planning & Upcoming Trips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${trip.statusBg}`}>
                      {trip.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{trip.dates}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{trip.destination}</h4>
                  </div>
                  <Link
                    href={`/trips/${trip.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E85D04] hover:text-white transition-colors"
                  >
                    <span>Resume Customizing</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recently Viewed & Favorite Tags */}
          <motion.div variants={staggerItem} className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Recently Viewed & Favorites</h3>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <p className="text-xs text-gray-400">Quickly jump back into your recent destination searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <Link
                    key={term}
                    href={`/destinations?search=${encodeURIComponent(term)}`}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                  >
                    🔍 {term}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </StaggerContainer>
      </div>
    </section>
  );
}
