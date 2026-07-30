"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { DESTINATIONS_DATA, getDestinationBySlug, DestinationItem } from "@/lib/destinations-data";
import { TOUR_PACKAGES_DATA } from "@/lib/packages-data";
import { useToast } from "@/components/ui/Toast";

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const CompassIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function DestinationContent({ slug }: { slug: string }) {
  const rawSlug = slug.toLowerCase();
  
  const formattedTitle = rawSlug
    .replace(/-/g, " ")
    .replace(/&/g, "&")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const matchedDest = getDestinationBySlug(rawSlug);

  const destination: DestinationItem = matchedDest || {
    id: rawSlug,
    slug: rawSlug,
    name: formattedTitle,
    category: rawSlug.includes("india") || ["manali", "goa", "leh-ladakh", "kashmir", "dwarka", "kerala-backwaters", "rajasthan-palaces", "andaman-islands"].includes(rawSlug) ? "india" : "international",
    image: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80`,
    description: `Explore the luxury world of ${formattedTitle} featuring handpicked resort stays, curated guided itineraries, private transfers, and bespoke travel experiences.`,
    region: rawSlug.includes("india") ? "India" : "Global Destination",
    rating: 4.9,
    reviewsCount: 1850,
    bestTime: "Year-Round Escapes",
    topAttractions: [
      `${formattedTitle} Scenic Viewpoints & Landmarks`,
      "Private Chauffeur & Guided Expeditions",
      "5-Star Luxury Resort Stay & Dining",
      "Sunset Viewing & Local Culture",
    ],
    vibe: "Luxury & Exclusive",
  };

  const packagesForDest = TOUR_PACKAGES_DATA.filter(
    (p) => p.destination.toLowerCase().includes(rawSlug) || p.slug.toLowerCase().includes(rawSlug)
  );

  const relatedDestinations = DESTINATIONS_DATA.filter(
    (d) => d.slug !== destination.slug
  ).slice(0, 3);

  return (
    <DashboardLayout
      title={destination.name}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Destinations", href: "/destinations" },
        { label: destination.name },
      ]}
    >
      <div className="space-y-12 pb-16">
        <div className="relative rounded-3xl overflow-hidden h-[360px] sm:h-[440px] shadow-2xl border border-gray-200/50 dark:border-white/10">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="absolute bottom-8 left-6 right-6 sm:left-10 sm:right-10 text-white space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-[#E85D04] text-white text-xs font-extrabold uppercase tracking-wider shadow">
                {destination.category === "india" ? "🇮🇳 In India" : "🌍 International"}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10">
                <StarIcon /> {destination.rating} ({destination.reviewsCount} verified reviews)
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
              {destination.name}
            </h1>

            <p className="text-white/90 text-sm sm:text-base max-w-3xl font-medium leading-relaxed drop-shadow-sm">
              {destination.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#121824] p-5 rounded-2xl border border-gray-200/70 dark:border-white/10 shadow-md space-y-1">
            <span className="text-gray-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
              <MapPinIcon /> Region
            </span>
            <p className="text-gray-900 dark:text-white font-extrabold text-base sm:text-lg">{destination.region}</p>
          </div>

          <div className="bg-white dark:bg-[#121824] p-5 rounded-2xl border border-gray-200/70 dark:border-white/10 shadow-md space-y-1">
            <span className="text-gray-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
              <CalendarIcon /> Best Season
            </span>
            <p className="text-gray-900 dark:text-white font-extrabold text-base sm:text-lg">{destination.bestTime}</p>
          </div>

          <div className="bg-white dark:bg-[#121824] p-5 rounded-2xl border border-gray-200/70 dark:border-white/10 shadow-md space-y-1">
            <span className="text-gray-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
              ✨ Vibe & Style
            </span>
            <p className="text-[#E85D04] font-extrabold text-base sm:text-lg">{destination.vibe}</p>
          </div>

          <div className="bg-white dark:bg-[#121824] p-5 rounded-2xl border border-gray-200/70 dark:border-white/10 shadow-md space-y-1">
            <span className="text-gray-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
              ⭐ Rating
            </span>
            <p className="text-gray-900 dark:text-white font-extrabold text-base sm:text-lg">{destination.rating} / 5.0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-[#121824] p-6 sm:p-10 rounded-3xl border border-gray-200/70 dark:border-white/10 shadow-xl space-y-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Experience {destination.name}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {destination.name} represents a signature travel destination curated for luxury seekers, romantic couples, and adventurous travelers alike. Handpicked accommodations, private chauffeured transfers, and insider access guarantee a seamless travel experience.
              </p>

              <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mb-4">Top Highlights & Must-Visit Spots</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {destination.topAttractions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-bold"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1B4332] text-white text-xs font-extrabold">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {packagesForDest.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Featured Packages for {destination.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packagesForDest.map((pkg) => (
                    <div key={pkg.id} className="p-5 rounded-3xl bg-white dark:bg-[#121824] border border-gray-200 dark:border-white/10 shadow-md space-y-3">
                      <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">{pkg.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{pkg.duration} • {pkg.groupSize}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/10">
                        <span className="text-base font-extrabold text-[#1B4332] dark:text-emerald-400">₹{pkg.priceStarting.toLocaleString("en-IN")}</span>
                        <Link href="/planner" className="px-3.5 py-1.5 rounded-xl bg-[#E85D04] text-white font-bold text-xs">Customize</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#121824] p-6 sm:p-8 rounded-3xl border border-gray-200/70 dark:border-white/10 shadow-xl space-y-4">
              <span className="px-3 py-1 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-xs font-extrabold uppercase">
                ✨ AI Itinerary Builder
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                Plan a Trip to {destination.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Generate a custom day-by-day itinerary tailored to your exact budget, group size, and vibe in under 10 seconds.
              </p>
              <Link
                href={`/planner?destination=${encodeURIComponent(destination.name)}`}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#E85D04] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
              >
                <SparklesIcon />
                <span>Build Itinerary with AI</span>
              </Link>
            </div>

            <div className="bg-white dark:bg-[#121824] p-6 rounded-3xl border border-gray-200/70 dark:border-white/10 shadow-lg space-y-4">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Explore Similar Spots</h3>
              <div className="space-y-3">
                {relatedDestinations.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/destinations/${rel.slug}`}
                    className="group flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Image
                      src={rel.image}
                      alt={rel.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#E85D04] transition-colors truncate">
                        {rel.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">{rel.region}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
