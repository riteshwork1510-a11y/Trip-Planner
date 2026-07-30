"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Sparkles, MapPin, Route, Star, Shield, BarChart3 } from "lucide-react";

const floatingDestinations = [
  { city: "Paris", country: "France", emoji: "🗼", color: "from-rose-100 to-amber-100", x: 8, y: 12, delay: 0 },
  { city: "Bali", country: "Indonesia", emoji: "🌴", color: "from-emerald-100 to-teal-100", x: 62, y: 8, delay: 1.5 },
  { city: "Tokyo", country: "Japan", emoji: "🗾", color: "from-sky-100 to-indigo-100", x: 18, y: 52, delay: 3 },
  { city: "Santorini", country: "Greece", emoji: "🏛️", color: "from-blue-100 to-purple-100", x: 58, y: 48, delay: 4.5 },
  { city: "Maldives", country: "Maldives", emoji: "🏝️", color: "from-cyan-100 to-blue-100", x: 38, y: 68, delay: 2 },
];

const stats = [
  { value: "10K+", label: "Trips Generated", icon: Route },
  { value: "150+", label: "Destinations", icon: MapPin },
  { value: "50K+", label: "Happy Travellers", icon: Star },
  { value: "98%", label: "Satisfaction", icon: BarChart3 },
];

function FloatingDestinationCard({ city, country, emoji, color, x, y, delay }: {
  city: string; country: string; emoji: string; color: string; x: number; y: number; delay: number;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-br ${color} border border-white/40 shadow-lg shadow-black/5 backdrop-blur-md`}>
        <span className="text-xl">{emoji}</span>
        <div>
          <p className="text-xs font-bold text-[#1B4332]">{city}</p>
          <p className="text-[10px] font-medium text-[#636E72]">{country}</p>
        </div>
      </div>
    </motion.div>
  );
}

function BrandBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1B4332 0%, #143326 30%, #0D2818 60%, #1B4332 100%)",
        }}
      />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#E85D04]/10 blur-[140px] -top-32 -right-16" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-400/8 blur-[120px] bottom-0 -left-24" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#2D6A4F]/10 blur-[100px] top-1/2 left-1/3" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
        <path d="M-50,200 C200,120 400,280 600,180 S900,260 1100,160 S1400,220 1500,180" stroke="white" strokeWidth="1.5" strokeDasharray="8 12" style={{ animation: "route-dash 3s linear infinite" }} />
        <path d="M100,750 C300,550 500,650 700,450 S1000,550 1200,350" stroke="#E85D04" strokeWidth="1" strokeDasharray="6 10" style={{ animation: "route-dash 4s linear infinite 1s" }} />
        <path d="M-20,650 C180,700 350,600 550,670 S800,630 1000,690 S1300,640 1500,670" stroke="#2D6A4F" strokeWidth="1" strokeDasharray="4 8" style={{ animation: "route-dash 5s linear infinite 2s" }} />
        <circle cx="200" cy="180" r="4" fill="#E85D04" style={{ animation: "glow-pulse 3s ease-in-out infinite" }} />
        <circle cx="600" cy="220" r="3" fill="white" style={{ animation: "glow-pulse 4s ease-in-out infinite 1s" }} />
        <circle cx="1000" cy="190" r="5" fill="#E85D04" style={{ animation: "glow-pulse 3.5s ease-in-out infinite 2s" }} />
      </svg>
      <div className="absolute top-[12%] left-[15%] w-48 h-48 rounded-full bg-[#E85D04]/6 blur-[70px]" style={{ animation: "glow-pulse 10s ease-in-out infinite" }} />
      <div className="absolute top-[55%] right-[10%] w-40 h-40 rounded-full bg-emerald-400/6 blur-[60px]" style={{ animation: "glow-pulse 13s ease-in-out infinite 4s" }} />
    </div>
  );
}

function TrustBadges() {
  return (
    <motion.div
      className="flex flex-wrap gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      {[
        { icon: Shield, text: "256-bit Encryption" },
        { icon: Star, text: "Trusted by 50K+ Users" },
        { icon: Sparkles, text: "AI-Powered Planning" },
      ].map((badge, i) => (
        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 backdrop-blur-sm">
          <badge.icon className="w-3 h-3 text-[#E85D04]" />
          <span className="text-[11px] font-medium text-white/70">{badge.text}</span>
        </div>
      ))}
    </motion.div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FDF8F0] font-sans selection:bg-[#E85D04]/20 selection:text-[#1B4332]">
      {/* ── Left Side: Brand Experience Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative items-center justify-center p-10 shrink-0 overflow-hidden">
        <BrandBackground />

        <div className="relative z-10 w-full max-w-xl mx-auto space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/" className="inline-flex items-center gap-3 group">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white shadow-xl"
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Compass className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                OptiTrip<span className="text-[#E85D04]">Planner</span>
              </span>
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-widest border border-white/15 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E85D04]" />
              Next-Gen AI Travel Platform
            </motion.span>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Plan Your Dream{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-amber-200">
                AI-Powered Journey
              </span>
            </h1>

            <p className="text-base text-white/70 leading-relaxed font-medium max-w-md">
              Experience intelligent trip generation, natural language itinerary editing, and personalized recommendations crafted just for you.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-4 gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <stat.icon className="w-4 h-4 text-[#E85D04] mb-1.5" />
                <p className="text-lg font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px] text-white/50 font-semibold leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Floating Destination Cards */}
          <div className="relative h-28">
            {floatingDestinations.map((dest) => (
              <FloatingDestinationCard key={dest.city} {...dest} />
            ))}
          </div>

          {/* Trust Indicators */}
          <TrustBadges />
        </div>
      </div>

      {/* ── Mobile: Condensed Brand Header ── */}
      <div className="lg:hidden relative overflow-hidden bg-gradient-to-br from-[#1B4332] to-[#0D2818] px-6 pt-10 pb-8 text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[300px] h-[300px] rounded-full bg-[#E85D04]/15 blur-[80px] -top-12 -right-12" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[60px] bottom-0 -left-8" />
        </div>
        <div className="relative z-10 space-y-2 text-center">
          <Link href="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              OptiTrip<span className="text-[#E85D04]">Planner</span>
            </span>
          </Link>
          <p className="text-sm text-white/60 font-medium">Your AI Journey Starts Here</p>
        </div>
      </div>

      {/* ── Right Side: Auth Content Area ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#FDF8F0] via-[#F5EFE4] to-[#FDF8F0] relative overflow-y-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[400px] h-[400px] rounded-full bg-[#1B4332]/4 blur-[100px] top-20 -left-32" />
          <div className="absolute w-[350px] h-[350px] rounded-full bg-[#E85D04]/3 blur-[90px] bottom-20 -right-24" />
        </div>
        <div className="relative z-10 w-full max-w-[440px]">
          {children}
        </div>
      </div>
    </div>
  );
}
