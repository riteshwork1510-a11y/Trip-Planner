"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HeroSection from "@/components/home/HeroSection";
import HolidayCategories from "@/components/home/HolidayCategories";
import ServicesSection from "@/components/home/ServicesSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import AITripPlannerCard from "@/components/home/AITripPlannerCard";
import PersonalizedSection from "@/components/home/PersonalizedSection";
import SmartRecommendations from "@/components/home/SmartRecommendations";
import GlobalSearchModal from "@/components/home/GlobalSearchModal";
import ContextualAIAssistant from "@/components/ai/ContextualAIAssistant";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { getTrips, getTripStats, createTrip, type Trip, type TripStats } from "@/lib/api/trips";
import { getDestinations, type Destination } from "@/lib/api/destinations";
import { formatCurrency, formatDate, getDurationText } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ScrollReveal,
  StaggerContainer,
  staggerItem,
  CountUp,
} from "@/components/animations/animation-utils";

const TRAVEL_STYLES = [
  { label: "Solo", value: "Solo" },
  { label: "Couple", value: "Couple" },
  { label: "Family", value: "Family" },
  { label: "Friends", value: "Friends" },
  { label: "Luxury", value: "Luxury" },
  { label: "Budget", value: "Budget" },
  { label: "Adventure", value: "Adventure" },
  { label: "Relaxation", value: "Relaxation" },
];

const FOOD_PREFERENCES = [
  { label: "Pure Vegetarian", value: "Pure Vegetarian" },
  { label: "Non-Vegetarian", value: "Non-Vegetarian" },
  { label: "Vegan", value: "Vegan" },
  { label: "No Preference", value: "No Preference" },
];

const INTEREST_OPTIONS = [
  "History", "Nature", "Adventure", "Beaches", "Shopping", "Food", "Nightlife", "Spirituality",
];

const DESTINATION_GRADIENTS: Record<string, string> = {
  Manali: "from-blue-500 to-indigo-600",
  Goa: "from-orange-400 to-pink-500",
  Dwarka: "from-yellow-500 to-amber-600",
  Dubai: "from-amber-500 to-rose-500",
  Paris: "from-rose-400 to-purple-600",
  Bali: "from-emerald-400 to-teal-600",
  "Leh-Ladakh": "from-sky-400 to-blue-700",
  Kashmir: "from-violet-400 to-indigo-700",
};

const STATUS_BADGE_VARIANT: Record<string, "info" | "success" | "warning" | "default"> = {
  upcoming: "info",
  completed: "success",
  draft: "warning",
};

export default function DashboardPage() {
  const { addToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<TripStats | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeItinerary, setActiveItinerary] = useState<boolean>(false);

  const [form, setForm] = useState({
    destination: "",
    days: "",
    nights: "",
    budget: "",
    travelStyle: "",
    foodPreference: "",
    interests: [] as string[],
  });

  const fetchData = useCallback(async () => {
    try {
      const [tripsRes, statsRes, destsRes] = await Promise.all([
        getTrips(),
        getTripStats(),
        getDestinations(),
      ]);
      if (tripsRes.success && tripsRes.data) {
        setTrips(tripsRes.data);
        if (tripsRes.data.length > 0) setActiveItinerary(true);
      }
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
      if (destsRes.success && destsRes.data) setDestinations(destsRes.data);
    } catch {
      addToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function handleInterestToggle(interest: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  async function handleGenerate() {
    if (!form.destination) { addToast("Please select a destination", "warning"); return; }
    setIsGenerating(true);
    try {
      const dest = destinations.find((d) => d.name === form.destination);
      const res = await createTrip({
        destination: form.destination,
        country: dest?.country,
        days: Number(form.days) || 3,
        nights: Number(form.nights) || 2,
        budget: Number(form.budget) || 0,
        travel_style: form.travelStyle || undefined,
        food_preference: form.foodPreference || undefined,
        interests: form.interests,
      });
      if (res.success) {
        addToast("Trip created successfully!", "success");
        setForm({ destination: "", days: "", nights: "", budget: "", travelStyle: "", foodPreference: "", interests: [] });
        setActiveItinerary(true);
        fetchData();
      }
    } catch {
      addToast("Failed to create trip", "error");
    } finally {
      setIsGenerating(false);
    }
  }

  const recentTrips = trips.slice(0, 3);
  const totalTrips = stats?.total_trips ?? 0;
  const totalDestinations = stats?.total_destinations ?? 0;
  const totalBudget = stats?.total_budget ?? 0;
  const completedTrips = stats?.completed ?? 0;

  const heroStats = [
    {
      label: "Total Trips",
      numericValue: totalTrips,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      ),
      color: "bg-[#1B4332]/10 text-[#1B4332]",
      glowColor: "bg-[#1B4332]/[0.06]",
    },
    {
      label: "Destinations",
      numericValue: totalDestinations,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      color: "bg-[#E85D04]/10 text-[#E85D04]",
      glowColor: "bg-[#E85D04]/[0.06]",
    },
    {
      label: "Total Budget",
      numericValue: 0,
      displayCurrency: true,
      currencyText: formatCurrency(totalBudget),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
        </svg>
      ),
      color: "bg-blue-100 text-blue-700",
      glowColor: "bg-blue-500/[0.06]",
    },
    {
      label: "Completed",
      numericValue: completedTrips,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-100 text-green-700",
      glowColor: "bg-green-500/[0.06]",
    },
  ];

  return (
    <DashboardLayout title="Home" fullBleed={true}>
      {/* ── Phase 1: Hero Section ── */}
      <HeroSection />

      {/* ── Phase 5: Personalized User Section ── */}
      <PersonalizedSection />

      {/* ── Phase 5: Interactive AI Trip Planner Card ── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <AITripPlannerCard onGenerate={() => setActiveItinerary(true)} />
      </div>

      {/* ── Phase 2: Holiday Categories ── */}
      <HolidayCategories />

      {/* ── Phase 5: AI Smart Recommendations ── */}
      <SmartRecommendations />

      {/* ── Phase 2: Popular Destinations Horizontal Slider ── */}
      <PopularDestinations />

      {/* ── Phase 2: End-to-End Services ── */}
      <ServicesSection />

      {/* ── Global Search Modal Overlay ── */}
      <GlobalSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />

      {/* ── Contextual AI Assistant (Only after itinerary generation) ── */}
      <ContextualAIAssistant
        hasItinerary={activeItinerary}
        onModify={(cmd) => {
          console.log("Applying AI modification:", cmd);
        }}
      />
    </DashboardLayout>
  );
}
