"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/animations/animation-utils";

interface Recommendation {
  id: string;
  title: string;
  category: "trending" | "seasonal" | "budget" | "luxury" | "honeymoon" | "family";
  location: string;
  image: string;
  price: string;
  rating: number;
  duration: string;
  tag: string;
}

const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r1",
    title: "Swiss Alps & Scenic Express Rail",
    category: "luxury",
    location: "Switzerland",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    price: "₹1,45,000",
    rating: 4.96,
    duration: "7 Days",
    tag: "👑 Luxury Escape",
  },
  {
    id: "r2",
    title: "Manali & Solang Valley Snow Pass",
    category: "budget",
    location: "Himachal Pradesh, India",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    price: "₹18,999",
    rating: 4.88,
    duration: "5 Days",
    tag: "💰 Budget Friendly",
  },
  {
    id: "r3",
    title: "Santorini Sunset & Wine Tasting",
    category: "honeymoon",
    location: "Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    price: "₹1,15,000",
    rating: 4.98,
    duration: "6 Days",
    tag: "💖 Honeymoon Special",
  },
  {
    id: "r4",
    title: "Singapore Universal Studios & Safari",
    category: "family",
    location: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80",
    price: "₹65,000",
    rating: 4.9,
    duration: "5 Days",
    tag: "👨‍👩‍👧‍👦 Family Fun",
  },
  {
    id: "r5",
    title: "Tokyo Cherry Blossom Festival Tour",
    category: "seasonal",
    location: "Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    price: "₹1,32,000",
    rating: 4.95,
    duration: "7 Days",
    tag: "🌸 Seasonal Favorite",
  },
  {
    id: "r6",
    title: "Dubai Desert Safari & Burj Khalifa VIP",
    category: "trending",
    location: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    price: "₹58,499",
    rating: 4.91,
    duration: "5 Days",
    tag: "🔥 Trending #1",
  },
];

const TABS = [
  { id: "all", label: "✨ All Picks" },
  { id: "trending", label: "🔥 Trending" },
  { id: "seasonal", label: "🌸 Seasonal" },
  { id: "budget", label: "💰 Budget Trips" },
  { id: "luxury", label: "👑 Luxury Escapes" },
  { id: "honeymoon", label: "💖 Honeymoon" },
  { id: "family", label: "👨‍👩‍👧‍👦 Family" },
];

export default function SmartRecommendations() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filtered = activeTab === "all"
    ? RECOMMENDATIONS
    : RECOMMENDATIONS.filter((r) => r.category === activeTab);

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#121824] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#E85D04]">
              AI Curated Selection
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
              Smart Recommendations
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Personalized package picks matched to seasonal trends, traveler reviews, and best-value pricing.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6 overflow-x-auto no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#E85D04] text-white shadow-md"
                      : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-gray-50 dark:bg-white/5 rounded-3xl overflow-hidden border border-gray-200/70 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
                    {item.tag}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>📍 {item.location}</span>
                      <span>⭐ {item.rating}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#E85D04] transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-gray-200/60 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block">Starting From</span>
                      <span className="text-xl font-extrabold text-[#E85D04]">{item.price}</span>
                    </div>
                    <Link
                      href={`/packages?id=${item.id}`}
                      className="px-4 py-2 rounded-xl bg-[#1B4332] text-white text-xs font-bold hover:bg-[#153728] transition-colors"
                    >
                      View Package
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
