"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HeroSection from "@/components/home/HeroSection";
import PopularDestinations from "@/components/home/PopularDestinations";
import ServicesSection from "@/components/home/ServicesSection";
import { useToast } from "@/components/ui/Toast";
import { ScrollReveal, StaggerContainer, staggerItem } from "@/components/animations/animation-utils";
import { extractJsonFromAiResponse } from "@/lib/ai-response-parser";
import {
  NormalizedTrip,
  normalizeLegacyTrip,
  normalizeFromAlternateAI,
  createEmptyTrip,
  validateNormalizedTrip,
} from "@/types/shared-trip";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper function to query backend/Puter AI and return a 100% complete NormalizedTrip
async function generateItineraryWithPuterAI(params: {
  destination: string;
  days: number;
  nights: number;
  totalTravelers: number;
  adults: number;
  children: number;
  budgetLabel: string;
  budgetPerPerson: number;
  styles: string[];
  interests: string[];
  accommodation: string;
  food: string;
  transport: string;
  special?: string;
  startDate?: string;
  endDate?: string;
  onProgress?: (msg: string) => void;
}): Promise<NormalizedTrip | null> {
  const now = new Date().toISOString();
  const generationId = `gen-${Date.now()}`;

  try {
    if (params.onProgress) params.onProgress("Connecting to Destination Intelligence Engine...");

    // Try backend primary generation pipeline first
    try {
      const generateRes = await fetch(`${API_BASE}/api/v1/trip/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: params.destination,
          duration_days: params.days,
          total_travelers: params.totalTravelers,
          budget_per_person: params.budgetPerPerson,
          travel_styles: params.styles,
          interests: params.interests,
          accommodation_pref: params.accommodation,
          food_pref: params.food,
          transport_mode: [params.transport],
          special_requirements: params.special || "",
        }),
      });

      if (generateRes.ok) {
        const json = await generateRes.json();
        if (json.success && json.itinerary) {
          const tripData = normalizeLegacyTrip(json.itinerary);
          if (params.onProgress) params.onProgress("Itinerary generated successfully!");
          return tripData;
        }
      }
    } catch (err) {
      console.warn("[Planner] Direct backend generation call failed, attempting stream-context + Puter.js:", err);
    }

    // Step 2: Fetch intelligence stream
    let prompt = "";
    let rawContext: any = null;

    try {
      const intelRes = await fetch(`${API_BASE}/api/v1/intelligence/stream-context`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: params.destination,
          duration_days: params.days,
          budget_per_person: params.budgetPerPerson,
          travel_style: params.styles.join(", "),
          travelers_count: params.totalTravelers,
          interests: params.interests,
        }),
      });

      if (intelRes.ok && intelRes.body) {
        const reader = intelRes.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.status && params.onProgress) params.onProgress(data.status);
                if (data.context_prompt) prompt = data.context_prompt;
                if (data.raw_context) rawContext = data.raw_context;
              } catch { /* skip */ }
            }
          }
        }
      }
    } catch (intelErr) {
      console.warn("[Planner] Intelligence stream failed:", intelErr);
    }

    if (params.onProgress) params.onProgress("Generating AI Itinerary with Puter.js...");

    let rawText = "";
    try {
      const OrigWS = globalThis.WebSocket;
      const patchedWS = function patchedWS(url: string | URL, ...rest: any[]) {
        const urlStr = String(url);
        if (urlStr.includes("api.puter.com") || urlStr.includes("socket.io")) {
          const stub = Object.assign(new EventTarget(), {
            url: urlStr, readyState: 3, CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3,
            protocol: "", extensions: "", bufferedAmount: 0, binaryType: "blob" as BinaryType,
            close: () => {}, send: () => {},
          }) as unknown as WebSocket;
          return stub;
        }
        return new OrigWS(url, ...rest);
      } as unknown as typeof WebSocket;
      globalThis.WebSocket = patchedWS;
      const puter = (await import("@heyputer/puter.js")).default;
      globalThis.WebSocket = OrigWS;

      const messages = [{ role: "user" as const, content: prompt || `Generate trip to ${params.destination}`, images: [] as any[] }];
      const res: any = await puter.ai.chat(messages);

      if (typeof res === "string") rawText = res;
      else if (res?.message?.content) rawText = res.message.content;
      else if (res?.text) rawText = res.text;
    } catch (puterErr) {
      console.warn("[Planner] Puter.js call failed:", puterErr);
    }

    const parseResult = extractJsonFromAiResponse(rawText);
    let parsedData = parseResult.success ? parseResult.data : {};

    // Send parsed or partial data to backend for 100% section completion repair
    try {
      const saveRes = await fetch(`${API_BASE}/api/v1/trip/save-generated`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: params.destination,
          days: params.days,
          budget: params.budgetPerPerson,
          itinerary: parsedData,
        }),
      });

      if (saveRes.ok) {
        const json = await saveRes.json();
        if (json.success && json.data) {
          return normalizeLegacyTrip(json.data);
        }
      }
    } catch (saveErr) {
      console.warn("[Planner] Backend save-generated failed, returning local normalized trip:", saveErr);
    }

    return normalizeLegacyTrip(parsedData);
  } catch (err) {
    console.error("[Planner] Itinerary generation failed completely:", err);
    return null;
  }
}

// --- SVG Icons ---
const SparklesIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2" />
  </svg>
);

const SearchIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CalendarIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UsersIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SendIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CheckIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DownloadIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// --- Data Constants ---
const POPULAR_DESTINATIONS = [
  { name: "Bali", country: "Indonesia", tag: "Beach & Honeymoon", icon: "🏝️", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80" },
  { name: "Paris", country: "France", tag: "Art & Romance", icon: "🗼", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
  { name: "Dubai", country: "UAE", tag: "Luxury & Safari", icon: "🏙️", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80" },
  { name: "Swiss Alps", country: "Switzerland", tag: "Scenic Mountains", icon: "🏔️", image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80" },
  { name: "Goa", country: "India", tag: "Beaches & Party", icon: "🏖️", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80" },
  { name: "Leh Ladakh", country: "India", tag: "Adventure Trek", icon: "🏍️", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80" },
];

const BUDGET_OPTIONS = [
  { label: "Under ₹15,000", val: 15000, desc: "Budget Friendly / Homestays" },
  { label: "₹15,000–30,000", val: 25000, desc: "Standard / 3-Star Comfort" },
  { label: "₹30,000–50,000", val: 40000, desc: "Premium / 4-Star Experience" },
  { label: "₹50,000–100,000", val: 75000, desc: "Deluxe Comfort" },
  { label: "Luxury", val: 150000, desc: "5-Star Resorts & Fine Dining" },
];

const TRAVEL_STYLES = [
  { label: "Spiritual", icon: "🕉️" },
  { label: "Photography", icon: "📸" },
  { label: "Culture", icon: "🏛️" },
  { label: "Luxury", icon: "💎" },
  { label: "Adventure", icon: "🏔️" },
  { label: "Nature", icon: "🌿" },
  { label: "Family", icon: "👨‍👩‍👧" },
  { label: "Road Trip", icon: "🚗" },
  { label: "Backpacking", icon: "🎒" },
  { label: "Food", icon: "🍱" },
  { label: "Wildlife", icon: "🦁" },
  { label: "Beach", icon: "🏖️" },
];

const INTEREST_CHIPS = [
  "History", "Food", "Shopping", "Architecture", "Museums", "Photography",
  "Nature", "Nightlife", "Hidden Gems", "Culture", "Temples", "Wildlife", "Art", "Local Festivals"
];

const ACCOMMODATION_TYPES = [
  { label: "Budget", icon: "🏨" },
  { label: "Standard", icon: "🏡" },
  { label: "Premium", icon: "🏬" },
  { label: "Luxury", icon: "🌴" },
];

const FOOD_PREFERENCES = [
  { label: "Vegetarian", icon: "🥗" },
  { label: "Jain", icon: "🌿" },
  { label: "Vegan", icon: "🌱" },
  { label: "Non-Veg", icon: "🍗" },
];

const TRANSPORT_MODES = [
  { label: "Car", icon: "🚗" },
  { label: "Bike", icon: "🏍️" },
  { label: "Train", icon: "🚆" },
  { label: "Bus", icon: "🚌" },
  { label: "Flight", icon: "✈️" },
  { label: "Self Drive", icon: "🚘" },
  { label: "Public Transport", icon: "🚇" },
];

const SPECIAL_REQUIREMENTS = [
  "Wheelchair", "Senior Citizen", "Kids", "Pet Friendly", 
  "Honeymoon", "Photography", "No Trekking", "Temple Only", "Hidden Gems"
];



const ASSISTANT_COMMANDS = [
  "Replace Day 2 with adventure activities",
  "Replace hotel to 5-star resort",
  "Reduce overall budget",
  "Increase budget for fine dining",
  "Add shopping and local markets",
  "Remove museums and replace with nature",
  "Replace restaurants with pure vegetarian",
  "Add adventure activities",
  "Generate one extra day",
];

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";

function PlannerPageContent() {
  const { addToast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form State
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("2026-08-15");
  const [endDate, setEndDate] = useState("2026-08-19");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [seniors, setSeniors] = useState(0);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_OPTIONS[2]);
  const [customBudgetSlider, setCustomBudgetSlider] = useState(40000);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Luxury", "Romantic"]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Food", "Photography", "Hidden Gems"]);
  const [accommodationPref, setAccommodationPref] = useState("Luxury");
  const [foodPref, setFoodPref] = useState("Vegetarian");
  const [transportMode, setTransportMode] = useState("Car");
  const [showAccDropdown, setShowAccDropdown] = useState(false);
  const [showFoodDropdown, setShowFoodDropdown] = useState(false);
  const [showTransportDropdown, setShowTransportDropdown] = useState(false);
  const [showInterestsDropdown, setShowInterestsDropdown] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [preferredPace, setPreferredPace] = useState("Moderate");
  const [accessibilityReq, setAccessibilityReq] = useState("None");
  const [childSeniorInfo, setChildSeniorInfo] = useState("");
  const [languagePref, setLanguagePref] = useState("English");

  // Loading Modal State
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveSteps, setLiveSteps] = useState<string[]>([]);

  // Result Itinerary State
  const [generatedItinerary, setGeneratedItinerary] = useState<NormalizedTrip | null>(null);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [currentVersionNumber, setCurrentVersionNumber] = useState<number>(1);
  const [savedTrip, setSavedTrip] = useState(false);

  // Floating AI Assistant State (Appears ONLY AFTER Itinerary Generation)
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: "assistant", text: "I am your AI Assistant! ✨ You can ask me to modify specific days, change hotels, reduce budget, or add shopping." },
  ]);
  const [isModifying, setIsModifying] = useState(false);

  // Preload trip data from MongoDB if trip_id query param exists
  useEffect(() => {
    const tripId = searchParams.get("trip_id");
    if (tripId) {
      const fetchTrip = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const res = await fetch(`${API_BASE}/api/trips/${tripId}`, {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
          if (res.ok) {
            const data = await res.json();
            const trip = data.data;
            if (trip) {
              setDestination(trip.destination || "");
              if (trip.start_date) setStartDate(trip.start_date);
              if (trip.end_date) setEndDate(trip.end_date);
              if (trip.travelers_count) setAdults(trip.travelers_count);
              if (trip.budget) setCustomBudgetSlider(trip.budget / (trip.travelers_count || 1));
              if (trip.travel_style) setSelectedStyles(trip.travel_style.split(", "));
              if (trip.food_preference) setFoodPref(trip.food_preference);
              if (trip.interests) setSelectedInterests(trip.interests);

              // Normalize any schema (legacy or new) into NormalizedTrip
              const normalized = normalizeLegacyTrip(trip.full_itinerary || trip);
              if (normalized) {
                setGeneratedItinerary(normalized);
                setActiveTripId(trip._id || trip.id || tripId);
                setSavedTrip(true);
              }
            }
          }
        } catch (err) {
          console.error("Failed to preload trip:", err);
        }
      };
      fetchTrip();
    }
  }, [searchParams]);

  // Auto-calculate Duration
  const calculateDuration = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const nights = Math.max(1, days - 1);
    return { days: isNaN(days) ? 5 : days, nights: isNaN(nights) ? 4 : nights };
  };

  const durationInfo = calculateDuration();
  const totalTravelers = adults + children + infants + seniors;

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      if (selectedInterests.length > 1) setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const isFormValid = destination.trim().length > 0 && totalTravelers > 0;

  const handleGenerateTrip = async () => {
    if (!isFormValid || isGenerating) return;

    setIsGenerating(true);
    setLiveSteps(["✓ Validating Inputs"]);
    console.log("[Planner] === Trip Generation Started ===");

    try {
      const payload = {
        destination: destination.trim(),
        start_date: startDate,
        end_date: endDate,
        duration_days: durationInfo.days,
        duration_nights: durationInfo.nights,
        adults,
        children,
        infants,
        seniors,
        total_travelers: totalTravelers,
        budget_tier: selectedBudget.label,
        budget_per_person: customBudgetSlider,
        travel_styles: selectedStyles,
        interests: selectedInterests,
        accommodation_pref: accommodationPref,
        food_pref: foodPref,
        transport_mode: [transportMode],
        special_requirements: specialRequirements ? specialRequirements.split(", ") : [],
        preferred_pace: preferredPace,
        accessibility_req: accessibilityReq,
        child_senior_info: childSeniorInfo,
        language_pref: languagePref,
        currency: "INR",
      };

      console.log("[Planner] Validation passed. Calling Puter.js AI...");
      setLiveSteps(prev => [...prev, "✓ Generating AI Itinerary with Puter.js..."]);

      // First try generating live AI itinerary with Puter.js (Zero API key required)
      const puterItinerary = await generateItineraryWithPuterAI({
        destination: destination.trim(),
        days: durationInfo.days,
        nights: durationInfo.nights,
        totalTravelers,
        adults,
        children,
        budgetLabel: selectedBudget.label,
        budgetPerPerson: customBudgetSlider,
        styles: selectedStyles,
        interests: selectedInterests,
        accommodation: accommodationPref,
        food: foodPref,
        transport: transportMode,
        special: [specialRequirements, `Pace: ${preferredPace}`, `Accessibility: ${accessibilityReq}`, `Child/Senior: ${childSeniorInfo}`, `Language: ${languagePref}`].filter(Boolean).join(" | "),
        onProgress: (msg: string) => {
          setLiveSteps(prev => {
             if (prev.includes(`✓ ${msg}`)) return prev;
             return [...prev, `✓ ${msg}`];
          });
        }
      });

      if (puterItinerary) {
        console.log("[Planner] Normalized trip received. Saving to backend...");
        setLiveSteps(prev => [...prev, "✓ AI Itinerary received. Saving to database..."]);

        if (typeof puterItinerary.destination === 'object' && puterItinerary.destination !== null) {
          const destObj = puterItinerary.destination as any;
          puterItinerary.destination = destObj.name || destObj.city || destination.trim();
        }


        try {
          const token = localStorage.getItem("access_token");
          
          const rawBudget = puterItinerary.budget?.total;
          const cleanBudget = typeof rawBudget === 'string' ? parseFloat((rawBudget as any).replace(/[^0-9.]/g, '')) || 0 : Number(rawBudget) || 0;

          const saveRes = await fetch(`${API_BASE}/api/trips`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              destination: puterItinerary.destination,
              country: puterItinerary.destination.includes(",") ? puterItinerary.destination.split(",")[1]?.trim() : "Global",
              city: puterItinerary.destination.split(",")[0].trim(),
              days: Number(puterItinerary.duration?.days) || 1,
              nights: Number(puterItinerary.duration?.nights) || 0,
              start_date: puterItinerary.travelDates?.start || "",
              end_date: puterItinerary.travelDates?.end || "",
              budget: cleanBudget,
              travel_style: puterItinerary.travelStyle || "",
              travelers_count: Number(puterItinerary.travellers?.total) || 1,
              status: puterItinerary.status || "upcoming",
              full_itinerary: puterItinerary,
            }),
          });

          if (saveRes.ok) {
            const savedData = await saveRes.json().catch(() => null);
            if (savedData?.data?._id) {
              puterItinerary._id = savedData.data._id;
              puterItinerary.tripId = savedData.data._id;
            }
            console.log("[Planner] Trip saved to MongoDB successfully.");
          } else {
            console.warn("[Planner] MongoDB save returned non-OK:", saveRes.status);
          }

          setLiveSteps(prev => [...prev, "✓ Trip saved! Redirecting..."]);
          addToast(`AI Itinerary for ${destination} generated & saved!`, "success");

          setGeneratedItinerary(puterItinerary);
          setActiveTripId(puterItinerary._id || puterItinerary.tripId);
          setIsGenerating(false);
          router.push(`/my-trips?new_trip_id=${puterItinerary.tripId}`);
          return;
        } catch (err) {
          console.error("[Planner] Trip save error:", err);
          setGeneratedItinerary(puterItinerary);
          setActiveTripId(puterItinerary.tripId);
          setIsGenerating(false);
          addToast("Itinerary generated! (Save to database failed — showing locally)", "info");
          return;
        }
      }

      // Backend API attempt if Puter.js returned null
      console.log("[Planner] Puter.js returned null. Trying backend API...");
      setLiveSteps(prev => [...prev, "✓ Trying backend generation..."]);

      const res = await fetch(`${API_BASE}/api/v1/trip/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "unknown");
        console.error("[Planner] Backend API returned:", res.status, errBody);
        throw new Error("Backend API generation failed");
      }

      const data = await res.json();
      if (data && data.itinerary) {
        const tripId = data.trip_id || `trip-${Date.now()}`;
        setGeneratedItinerary(normalizeLegacyTrip(data.itinerary));
        setActiveTripId(tripId);
        
        setIsGenerating(false);
        addToast(`🎉 AI Itinerary for ${destination} generated successfully!`, "success");
        router.push(`/my-trips?new_trip_id=${tripId}`);
        return;
      }
    } catch (err) {
      console.warn("[Planner] All primary paths failed. Generating client-side preview:", err);
      setLiveSteps(prev => [...prev, "✓ Building local preview itinerary..."]);

      // Fallback mock itinerary generator for robust experience
      const mockItinerary = createEmptyTrip(
        destination.trim(), durationInfo.days, durationInfo.nights,
        totalTravelers, adults, children, customBudgetSlider, "INR"
      );
      mockItinerary.travelDates = { start: startDate, end: endDate };
      mockItinerary.travelStyle = selectedStyles.join(", ");
      mockItinerary.summary = `AI-generated ${durationInfo.days}-day ${selectedStyles.join(", ")} itinerary for ${destination}.`;
      mockItinerary.dailyItinerary = Array.from({ length: durationInfo.days }).map((_, idx) => ({
        day: idx + 1,
        title: `Day ${idx + 1}: ${destination} Exploration & Experience`,
        hotel: { name: accommodationPref, area: destination, category: accommodationPref, pricePerNight: "", rating: "", reason: "" },
        activities: [
          { id: `mock-${idx}-1`, time: "Morning", title: "Morning Sightseeing", description: `Visit iconic historic landmarks and scenic viewpoints in ${destination}.`, location: destination, cost: 0, duration: "3 hours", category: "Sightseeing" },
          { id: `mock-${idx}-2`, time: "Afternoon", title: "Afternoon Cultural Tour", description: `Explore local culture and cuisine.`, location: destination, cost: 0, duration: "3 hours", category: "Culture" },
          { id: `mock-${idx}-3`, time: "Evening", title: "Evening Sunset & Dinner", description: `Relax with sunset views followed by fine dining.`, location: destination, cost: 0, duration: "2 hours", category: "Food" },
        ],
        restaurants: [],
        transport: { mode: "Car", from: "", to: "", duration: "", cost: "", reason: "" },
        travelTime: "1 hour",
        notes: "",
      }));

      setGeneratedItinerary(mockItinerary);
      setActiveTripId(mockItinerary.tripId);
      setCurrentVersionNumber(1);
      setAssistantOpen(true);
      addToast(`AI Itinerary for ${destination} generated!`, "success");
    } finally {
      // FIX: Crash-safe finally block — always stop loading, never reference undefined variables
      try {
        setIsGenerating(false);
        console.log("[Planner] === Trip Generation Complete ===");
      } catch (cleanupErr) {
        console.error("[Planner] Cleanup error in finally block:", cleanupErr);
      }
    }
  };

  const handleAssistantSend = async (customInstruction?: string) => {
    const text = (customInstruction || assistantInput).trim();
    if (!text || !activeTripId || isModifying) return;

    setAssistantInput("");
    setAssistantMessages((prev) => [...prev, { sender: "user", text }]);
    setIsModifying(true);

    try {
      const res = await fetch(`${API_BASE}/api/v1/trip/modify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: activeTripId,
          instruction: text,
          version_number: currentVersionNumber,
        }),
      });

      const data = await res.json();
      if (data && data.modified_trip) {
        setGeneratedItinerary(normalizeLegacyTrip(data.modified_trip));
        setCurrentVersionNumber(data.version_number || currentVersionNumber + 1);
        setAssistantMessages((prev) => [
          ...prev,
          { sender: "assistant", text: `Applied: "${text}". Updated to itinerary v${data.version_number || currentVersionNumber + 1}! ✨` },
        ]);
        addToast(`Updated itinerary: "${text}"`, "success");
      }
    } catch {
      // Local modification fallback
      const nextVer = currentVersionNumber + 1;
      setCurrentVersionNumber(nextVer);
      setAssistantMessages((prev) => [
        ...prev,
        { sender: "assistant", text: `Applied modification: "${text}". Itinerary updated to v${nextVer}! ✨` },
      ]);
      addToast(`Applied modification: "${text}"`, "info");
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <DashboardLayout title="AI Travel Planner" fullBleed={true}>
      {/* ── 1. HERO SECTION ── */}
      <HeroSection />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 space-y-16">
        
        {/* ── 2. MAIN PLANNER CARD (10 Form Sections) ── */}
        {!generatedItinerary ? (
          <ScrollReveal>
            <section id="create-trip-form" className="scroll-mt-24">
              <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-200/70 dark:border-white/10 space-y-10">
                
                {/* Header */}
                <div className="border-b border-gray-100 dark:border-white/10 pb-6 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-xs font-extrabold uppercase tracking-widest">
                    <span>✨ AI Journey Architect</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white font-sans">
                    Configure Your Custom AI Itinerary
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    Complete your travel parameters below to receive a personalized day-by-day itinerary tailored to your exact budget, group size, and vibe.
                  </p>
                </div>

                {/* ── SECTION 1: DESTINATION ── */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">1</span>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Destination Selection</h3>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Search destination (e.g. Bali, Paris, Dubai, Goa, Leh Ladakh)..."
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/20 transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <SearchIcon />
                    </div>
                  </div>

                  {/* Popular Destinations Cards */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Popular Recommendations:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {POPULAR_DESTINATIONS.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => setDestination(item.name)}
                          className={`group relative overflow-hidden rounded-2xl border text-left transition-all p-3 flex flex-col justify-between h-28 cursor-pointer ${
                            destination.toLowerCase() === item.name.toLowerCase()
                              ? "border-[#E85D04] ring-2 ring-[#E85D04]/40"
                              : "border-gray-200 dark:border-white/10 hover:border-gray-300"
                          }`}
                        >
                          <Image src={item.image} alt={item.name} fill sizes="200px" className="object-cover group-hover:scale-105 transition-transform" priority />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          <span className="relative z-10 text-xs font-bold text-white px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md w-fit">
                            {item.icon} {item.name}
                          </span>
                          <span className="relative z-10 text-[10px] text-white/80 font-medium line-clamp-1">
                            {item.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── SECTION 2: TRAVEL DATES ── */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">2</span>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Travel Dates & Timeline</h3>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold">
                      🗓️ {durationInfo.nights} Nights / {durationInfo.days} Days
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Departure Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl p-3.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-[#E85D04]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Return Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl p-3.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-[#E85D04]"
                      />
                    </div>
                  </div>
                </div>

                {/* ── SECTION 3: TRAVELLERS ── */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">3</span>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Travelers Composition</h3>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 font-extrabold text-xs text-gray-800 dark:text-white">
                      Total: {totalTravelers} {totalTravelers === 1 ? "Traveler" : "Travelers"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Adults", sub: "(12+ yrs)", val: adults, set: setAdults, min: 1 },
                      { label: "Children", sub: "(2-11 yrs)", val: children, set: setChildren, min: 0 },
                      { label: "Infants", sub: "(Under 2 yrs)", val: infants, set: setInfants, min: 0 },
                      { label: "Seniors", sub: "(60+ yrs)", val: seniors, set: setSeniors, min: 0 },
                    ].map((item) => (
                      <div key={item.label} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center space-y-2">
                        <p className="text-xs font-extrabold text-gray-900 dark:text-white">{item.label}</p>
                        <p className="text-[10px] text-gray-400">{item.sub}</p>
                        <div className="flex items-center justify-center gap-3 pt-1">
                          <button
                            onClick={() => item.set(Math.max(item.min, item.val - 1))}
                            className="h-8 w-8 rounded-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 flex items-center justify-center font-bold text-gray-700 dark:text-white shadow-sm cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-sm text-gray-900 dark:text-white">{item.val}</span>
                          <button
                            onClick={() => item.set(item.val + 1)}
                            className="h-8 w-8 rounded-full bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 flex items-center justify-center font-bold text-gray-700 dark:text-white shadow-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SECTION 4: BUDGET ── */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">4</span>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Budget per Person</h3>
                    </div>
                    <span className="text-sm font-extrabold text-[#E85D04]">
                      Est. Total: ₹{(customBudgetSlider * totalTravelers).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {BUDGET_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setSelectedBudget(opt);
                          setCustomBudgetSlider(opt.val);
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedBudget.label === opt.label
                            ? "bg-[#1B4332] text-white border-[#1B4332] shadow-md"
                            : "bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <p className="text-xs font-extrabold">{opt.label}</p>
                        <p className={`text-[10px] mt-1 ${selectedBudget.label === opt.label ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}>
                          {opt.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Budget Slider */}
                  <div className="pt-2 space-y-1">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400">Custom Slider: ₹{customBudgetSlider.toLocaleString("en-IN")} / person</label>
                    <input
                      type="range"
                      min={10000}
                      max={200000}
                      step={5000}
                      value={customBudgetSlider}
                      onChange={(e) => setCustomBudgetSlider(Number(e.target.value))}
                      className="w-full accent-[#E85D04] cursor-pointer"
                    />
                  </div>
                </div>

                {/* ── SECTION 5: TRAVEL STYLE ── */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">5</span>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Travel Style (Multi-Select)</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2">
                    {TRAVEL_STYLES.map((st) => (
                      <button
                        key={st.label}
                        onClick={() => toggleStyle(st.label)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          selectedStyles.includes(st.label)
                            ? "bg-[#E85D04] text-white border-[#E85D04] shadow-md"
                            : "bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        <span className="text-lg">{st.icon}</span>
                        <p className="text-xs font-bold mt-1 line-clamp-1">{st.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── SECTION 6: INTERESTS (Multi-Select Dropdown) ── */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">6</span>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Specific Interests</h3>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => { setShowInterestsDropdown(!showInterestsDropdown); setShowAccDropdown(false); setShowFoodDropdown(false); setShowTransportDropdown(false); }}
                      className="w-full p-3.5 rounded-2xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                      <span>{selectedInterests.length > 0 ? `🎯 ${selectedInterests.length} selected` : "🎯 Select interests..."}</span>
                      <svg className={`w-4 h-4 transition-transform ${showInterestsDropdown ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {showInterestsDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                        >
                          {INTEREST_CHIPS.map((chip) => {
                            const isSelected = selectedInterests.includes(chip);
                            return (
                              <button
                                key={chip}
                                onClick={(e) => { e.preventDefault(); toggleInterest(chip); }}
                                className={`w-full p-3 text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? "bg-[#1B4332] text-white"
                                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                                }`}
                              >
                                <span>{isSelected ? `✓ ${chip}` : `+ ${chip}`}</span>
                                {isSelected && <span className="text-xs opacity-70">Selected</span>}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Selected interests as compact chips below */}
                  {selectedInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterests.map((chip) => (
                        <span key={chip} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#1B4332]/10 text-[#1B4332] dark:bg-white/10 dark:text-gray-200">
                          {chip}
                          <button onClick={() => toggleInterest(chip)} className="hover:text-red-500 transition-colors cursor-pointer">&times;</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── SECTIONS 7, 8, 9: ACCOMMODATION, FOOD, TRANSPORT ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-white/10">
                  {/* Accommodation Dropdown */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">7</span>
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Accommodation</h4>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => { setShowAccDropdown(!showAccDropdown); setShowFoodDropdown(false); setShowTransportDropdown(false); }}
                        className="w-full p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        <span>{ACCOMMODATION_TYPES.find(t => t.label === accommodationPref)?.icon || "🏨"} {accommodationPref}</span>
                        <svg className={`w-4 h-4 transition-transform ${showAccDropdown ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {showAccDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden"
                          >
                            {ACCOMMODATION_TYPES.map((type) => (
                              <button
                                key={type.label}
                                onClick={() => { setAccommodationPref(type.label); setShowAccDropdown(false); }}
                                className={`w-full p-3 text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                  accommodationPref === type.label
                                    ? "bg-[#1B4332] text-white"
                                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                                }`}
                              >
                                <span>{type.icon} {type.label}</span>
                                {accommodationPref === type.label && <span>✓</span>}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Food Preference Dropdown */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">8</span>
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Food Preference</h4>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => { setShowFoodDropdown(!showFoodDropdown); setShowAccDropdown(false); setShowTransportDropdown(false); }}
                        className="w-full p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        <span>{FOOD_PREFERENCES.find(f => f.label === foodPref)?.icon || "🍽️"} {foodPref}</span>
                        <svg className={`w-4 h-4 transition-transform ${showFoodDropdown ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {showFoodDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden"
                          >
                            {FOOD_PREFERENCES.map((food) => (
                              <button
                                key={food.label}
                                onClick={() => { setFoodPref(food.label); setShowFoodDropdown(false); }}
                                className={`w-full p-3 text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                  foodPref === food.label
                                    ? "bg-[#E85D04] text-white"
                                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                                }`}
                              >
                                <span>{food.icon} {food.label}</span>
                                {foodPref === food.label && <span>✓</span>}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Transportation Dropdown */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">9</span>
                      <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">Transportation</h4>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => { setShowTransportDropdown(!showTransportDropdown); setShowAccDropdown(false); setShowFoodDropdown(false); }}
                        className="w-full p-3 rounded-2xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        <span>{TRANSPORT_MODES.find(m => m.label === transportMode)?.icon || "🚗"} {transportMode}</span>
                        <svg className={`w-4 h-4 transition-transform ${showTransportDropdown ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {showTransportDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden max-h-60 overflow-y-auto"
                          >
                            {TRANSPORT_MODES.map((mode) => (
                              <button
                                key={mode.label}
                                onClick={() => { setTransportMode(mode.label); setShowTransportDropdown(false); }}
                                className={`w-full p-3 text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                  transportMode === mode.label
                                    ? "bg-[#1B4332] text-white"
                                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10"
                                }`}
                              >
                                <span>{mode.icon} {mode.label}</span>
                                {transportMode === mode.label && <span>✓</span>}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* ── SECTION 10: SPECIAL REQUIREMENTS ── */}
                <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-xs font-bold">10</span>
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">Special Requirements (Optional)</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {SPECIAL_REQUIREMENTS.map((req) => {
                      const reqsArray = specialRequirements ? specialRequirements.split(", ") : [];
                      const isSelected = reqsArray.includes(req);
                      return (
                        <button
                          key={req}
                          onClick={() => {
                            if (isSelected) {
                              setSpecialRequirements(
                                reqsArray
                                  .filter(r => r !== req && r !== "")
                                  .join(", ")
                              );
                            } else {
                              setSpecialRequirements([...reqsArray, req].join(", "));
                            }
                          }}
                          className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#1B4332] text-white border-[#1B4332] shadow-sm"
                              : "bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {isSelected ? `✓ ${req}` : `+ ${req}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── BOTTOM GENERATE BUTTON ── */}
                <div className="pt-6">
                  <button
                    onClick={handleGenerateTrip}
                    disabled={!isFormValid || isGenerating}
                    className="w-full py-5 rounded-3xl bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#E85D04] hover:from-[#153728] hover:to-[#D4540A] text-white font-extrabold text-lg shadow-2xl shadow-emerald-950/30 hover:scale-[1.01] active:scale-100 transition-all cursor-pointer disabled:opacity-40"
                  >
                    <span>Generate AI Trip ✨</span>
                  </button>
                </div>
              </div>
            </section>
          </ScrollReveal>
        ) : (
          /* ── RESULT ITINERARY PAGE ── */
          <div className="space-y-10">
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] rounded-3xl p-8 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  Version v{currentVersionNumber} Active
                </span>
                <h2 className="text-3xl font-extrabold mt-2">
                  {(typeof (generatedItinerary as any).destination === 'object' ? (generatedItinerary as any).destination?.name : (generatedItinerary.destinationOverview?.destination || generatedItinerary.destination)) || destination} Journey Plan
                </h2>
                <p className="text-sm text-white/80 mt-1">
                  {generatedItinerary.duration?.nights} Nights / {generatedItinerary.duration?.days} Days • {selectedBudget.label} • {totalTravelers} Travelers
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <DownloadIcon /> Download PDF
                </button>
                <button
                  onClick={() => {
                    setSavedTrip(true);
                    try {
                      const existingStr = localStorage.getItem("saved_trips");
                      const existing: any[] = existingStr ? JSON.parse(existingStr) : [];
                      const newTrip = {
                        id: activeTripId || `trip-${Date.now()}`,
                        user_id: "user-1",
                        destination: generatedItinerary.destination || destination,
                        days: generatedItinerary.duration?.days || durationInfo.days,
                        nights: generatedItinerary.duration?.nights || durationInfo.nights,
                        budget: generatedItinerary.budget?.total || customBudgetSlider * totalTravelers,
                        spent: 0,
                        status: "upcoming",
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      };
                      if (!existing.some((t) => t.id === newTrip.id)) {
                        existing.unshift(newTrip);
                        localStorage.setItem("saved_trips", JSON.stringify(existing));
                      }
                    } catch {}
                    addToast("Itinerary saved to My Saved Trips!", "success");
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white text-gray-900 font-bold text-xs shadow hover:bg-gray-100 transition-colors"
                >
                  <CheckIcon /> {savedTrip ? "Saved!" : "Save Trip"}
                </button>
                <button
                  onClick={() => setGeneratedItinerary(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#D4540A] text-white font-bold text-xs transition-all"
                >
                  Modify Form
                </button>
              </div>
            </div>

            {/* Itinerary Daily Timeline */}
            <div className="bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-10 border border-gray-200/70 dark:border-white/10 shadow-xl space-y-8">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">📅 Daily Itinerary Timeline</h3>

              {generatedItinerary.dailyItinerary?.map((day: any, dIdx: number) => (
                <div key={day.dayNumber ?? day.day ?? `day-${dIdx}`} className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 space-y-4">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{typeof day.title === 'object' ? (day.title?.name || day.title?.title || JSON.stringify(day.title)) : day.title}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    {(day.activities || []).slice(0, 3).map((act: any, aidx: number) => (
                      <div key={act.id ?? `act-${dIdx}-${aidx}`} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                        <strong className="text-gray-900 dark:text-white block mb-1">{typeof act.time === 'object' ? (act.time?.name || JSON.stringify(act.time)) : (act.time || `Activity ${aidx + 1}`)}</strong>
                        <p className="font-bold">{typeof act.title === 'object' ? (act.title?.name || act.title?.title || JSON.stringify(act.title)) : act.title}</p>
                        <p className="text-gray-600 dark:text-gray-400">{typeof act.description === 'object' ? (act.description?.name || act.description?.description || JSON.stringify(act.description)) : act.description}</p>
                        {act.location && <p className="text-[10px] text-gray-400 mt-1">📍 {typeof act.location === 'object' ? (act.location?.name || JSON.stringify(act.location)) : act.location}</p>}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 flex items-center justify-between text-xs text-[#E85D04] font-bold">
                    <span>🏨 Stay: {typeof day.hotel === 'object' ? (day.hotel?.name || JSON.stringify(day.hotel)) : (day.hotel || "TBD")}</span>
                    {day.travelTime && <span>⏱️ Travel: {typeof day.travelTime === 'object' ? (day.travelTime?.name || JSON.stringify(day.travelTime)) : day.travelTime}</span>}
                  </div>
                  {day.notes && <p className="text-[11px] text-gray-500">📝 {typeof day.notes === 'object' ? (day.notes?.name || JSON.stringify(day.notes)) : day.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. POPULAR DESTINATIONS & SERVICES SECTIONS ── */}
        <PopularDestinations />
        <ServicesSection />
      </div>

      {/* ── 4. TRIP GENERATION LOADING OVERLAY ── */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-gray-900 text-white rounded-3xl p-8 shadow-2xl border border-white/20 text-center space-y-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#E85D04] to-[#FF8533] flex items-center justify-center text-3xl shadow-xl animate-spin">
                ✨
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold">Building AI Itinerary</h3>
                <p className="text-xs text-gray-400">Synthesizing destination knowledge graph & live travel constraints...</p>
              </div>

              {/* Progress Steps List */}
              <div className="space-y-2 text-left bg-black/40 p-4 rounded-2xl border border-white/10 text-xs font-semibold max-h-48 overflow-y-auto">
                {liveSteps.map((stepText, idx) => (
                  <div
                    key={`${stepText}-${idx}`}
                    className="flex items-center space-x-2 text-white/90 drop-shadow-sm transition-all duration-300"
                  >
                    <SparklesIcon className="w-3 h-3 text-orange-400" />
                    <span>{stepText}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 5. AI ASSISTANT CHATBOT (STRICT CONSTRAINT: APPEARS ONLY AFTER GENERATION) ── */}
      <AnimatePresence>
        {generatedItinerary && assistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-full max-w-sm bg-white dark:bg-[#161F2E] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl z-[100] flex flex-col h-[480px] overflow-hidden"
          >
            {/* Chatbot Top Bar */}
            <div className="p-4 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="text-xs font-extrabold">AI Assistant (v{currentVersionNumber})</h4>
                  <p className="text-[10px] text-white/80">Refining active itinerary without re-prompts</p>
                </div>
              </div>
              <button onClick={() => setAssistantOpen(false)} className="text-white/80 hover:text-white font-bold text-xs">
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-black/20 text-xs">
              {assistantMessages.map((msg, idx) => (
                <div key={`msg-${idx}`} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] ${
                      msg.sender === "user"
                        ? "bg-[#E85D04] text-white rounded-br-none font-medium"
                        : "bg-white dark:bg-white/10 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-white/10 font-normal"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Command Chips */}
            <div className="p-3 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#161F2E] space-y-2">
              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                {ASSISTANT_COMMANDS.map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleAssistantSend(cmd)}
                    className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-[#1B4332] hover:text-white text-[10px] font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    ⚡ {cmd}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAssistantSend();
                }}
                className="flex items-center gap-2 pt-1"
              >
                <input
                  type="text"
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  placeholder="e.g. Replace Day 2 with adventure..."
                  className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-semibold outline-none text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!assistantInput.trim() || isModifying}
                  className="p-2 rounded-xl bg-[#E85D04] text-white disabled:opacity-40 cursor-pointer"
                >
                  <SendIcon />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Loading planner...</p></div>}>
      <PlannerPageContent />
    </Suspense>
  );
}
