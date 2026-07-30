"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

interface AITripPlannerCardProps {
  onGenerate?: (tripData: any) => void;
}

export default function AITripPlannerCard({ onGenerate }: AITripPlannerCardProps) {
  const { addToast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"form" | "generating" | "complete">("form");

  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [travelers, setTravelers] = useState("2 Travelers");
  const [budget, setBudget] = useState("₹50,000 - ₹1,00,000");
  const [style, setStyle] = useState("Luxury & Relaxed");

  const handleGenerate = () => {
    if (!destination) {
      addToast("Please enter a destination (e.g. Bali, Paris, Goa)", "warning");
      return;
    }

    setIsGenerating(true);
    setStep("generating");

    setTimeout(() => {
      setIsGenerating(false);
      setStep("complete");
      addToast(`🎉 AI Itinerary for ${destination} generated successfully!`, "success");
      if (onGenerate) {
        onGenerate({ destination, dates, travelers, budget, style });
      }
    }, 2500);
  };

  const handleReset = () => {
    setStep("form");
    setDestination("");
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#1B4332] via-[#143326] to-[#0A1B14] rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10 text-white relative overflow-hidden">
      {/* Ambient Glow background */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E85D04]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 relative z-10"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold uppercase tracking-widest text-[#FF8533]">
                <span>✨ AI-Powered Trip Planner</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                Craft Your Next Journey in Seconds
              </h2>
              <p className="text-sm sm:text-base text-gray-300 max-w-xl">
                Specify your travel desires and let WanderAI build a bespoke day-by-day itinerary tailored to your exact budget and style.
              </p>
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Destination */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  📍 Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bali, Paris, Leh Ladakh"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/30 transition-all"
                />
              </div>

              {/* Travel Dates */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  📅 Dates / Month
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next Month, 5 Days"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/30 transition-all"
                />
              </div>

              {/* Travelers */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  👥 Travelers
                </label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/30 transition-all cursor-pointer"
                >
                  <option value="1 Traveler" className="text-gray-900">1 Traveler (Solo)</option>
                  <option value="2 Travelers" className="text-gray-900">2 Travelers (Couple)</option>
                  <option value="4+ Family" className="text-gray-900">4+ Family</option>
                  <option value="Group Friends" className="text-gray-900">Group Friends</option>
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  💳 Estimated Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/30 transition-all cursor-pointer"
                >
                  <option value="Under ₹30,000" className="text-gray-900">Under ₹30,000 (Budget)</option>
                  <option value="₹30,000 - ₹70,000" className="text-gray-900">₹30,000 - ₹70,000 (Comfort)</option>
                  <option value="₹70,000 - ₹1,50,000" className="text-gray-900">₹70,000 - ₹1,50,000 (Luxury)</option>
                  <option value="₹1,50,000+" className="text-gray-900">₹1,50,000+ (Ultra Luxury)</option>
                </select>
              </div>

              {/* Travel Style */}
              <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                  🎯 Travel Style & Vibe
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white outline-none focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/30 transition-all cursor-pointer"
                >
                  <option value="Romantic & Scenic" className="text-gray-900">Romantic & Scenic</option>
                  <option value="Adventure & Outdoors" className="text-gray-900">Adventure & Outdoors</option>
                  <option value="Culture & Heritage" className="text-gray-900">Culture & Heritage</option>
                  <option value="Luxury & Relaxed" className="text-gray-900">Luxury & Relaxed</option>
                  <option value="Foodie & Shopping" className="text-gray-900">Foodie & Shopping</option>
                </select>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerate}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E85D04] to-[#F37216] hover:from-[#D4540A] hover:to-[#E85D04] text-white font-extrabold text-base shadow-xl shadow-[#E85D04]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-100 transition-all cursor-pointer flex items-center justify-center gap-2.5"
              >
                <span>✨ Generate AI Itinerary</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-16 text-center space-y-6 relative z-10"
          >
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
              <div className="w-20 h-20 rounded-full bg-[#E85D04] flex items-center justify-center text-3xl shadow-xl shadow-[#E85D04]/40 animate-spin">
                ✨
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Crafting Itinerary for {destination}...</h3>
              <p className="text-sm text-gray-300">Analyzing weather, optimal flight routes, 5-star hotel availability, and local hidden gems.</p>
            </div>
          </motion.div>
        )}

        {step === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 space-y-6 relative z-10"
          >
            <div className="p-6 rounded-2xl bg-white/10 border border-white/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  ✅ AI Generated Itinerary Ready
                </span>
                <span className="text-xs text-gray-300 font-semibold">{dates || "5 Days"} • {travelers}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">{destination || "Bali"} Experience</h3>
              <p className="text-sm text-gray-200">
                Day 1: Private Airport Arrival & Villa Check-in • Day 2: Sunset Temple Tour & Gourmet Seafood • Day 3: Waterfall Trekking & Spa • Day 4: Beach Club & Shopping • Day 5: Farewell Brunch & Departure.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors cursor-pointer"
              >
                Plan Another Trip
              </button>
              <button
                onClick={() => addToast("Itinerary saved to your account!", "success")}
                className="px-6 py-3 rounded-xl bg-[#E85D04] hover:bg-[#D4540A] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Save & View Full Itinerary
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
