"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Icons
const SparklesIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2" />
  </svg>
);

const CompassIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
  </svg>
);

const ShieldIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CpuIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const GlobeIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const STATS = [
  { value: "10,000+", label: "AI Itineraries Created", desc: "Crafted with 99.8% precision" },
  { value: "150+", label: "Destinations Covered", desc: "Global cities & hidden gems" },
  { value: "0–100", label: "Smart Recommendation Score", desc: "Algorithmic personalization" },
  { value: "Instant", label: "Natural Language Edits", desc: "Version control & Diffing" },
];

const PLATFORM_PILLARS = [
  {
    icon: <CpuIcon className="text-[#E85D04]" />,
    title: "Conversational AI Engine",
    description:
      "Powered by Opti Matrix AI and Google Gemini API, our conversational assistant asks intelligent 1-by-1 questions to understand your budget, dates, and interests.",
  },
  {
    icon: <SparklesIcon className="text-emerald-600 dark:text-emerald-400" />,
    title: "Natural Language Modification",
    description:
      "Modify existing itineraries by typing simple instructions like 'Remove museums', 'Increase budget to ₹25,000', or 'Add 1 extra day' with full Undo/Redo support.",
  },
  {
    icon: <GlobeIcon className="text-[#E85D04]" />,
    title: "Multi-Currency Intelligence",
    description:
      "Seamless support for global currencies including INR (₹), USD ($), EUR (€), GBP (£), and AED with real-time budget breakdown calculations.",
  },
  {
    icon: <ShieldIcon className="text-emerald-600 dark:text-emerald-400" />,
    title: "0–100 Smart Recommendation Ranking",
    description:
      "Intelligent scoring algorithm evaluating interest alignment (+30), ratings (+15), budget match (+15), and family suitability (+10).",
  },
];

const LEADERSHIP_TEAM = [
  {
    name: "Opti Matrix AI Team",
    role: "Principal AI Architecture & Engineering",
    bio: "Pioneering stateful conversational trip planning, generative itinerary engines, and multi-version diffing.",
    avatar: "🤖",
  },
  {
    name: "Ritesh Gajjar",
    role: "Lead Software Architect & Product Lead",
    bio: "Architecting high-performance Next.js 15+, FastAPI backends, and full-stack travel domain infrastructure.",
    avatar: "👨‍💻",
  },
  {
    name: "WanderAI Domain Experts",
    role: "Travel & Cultural Curation Specialists",
    bio: "Curating authentic regional heritage circuits, homestays, culinary experiences, and local travel tips.",
    avatar: "🌍",
  },
];

export default function AboutPage() {
  return (
    <DashboardLayout
      title="About WanderAI"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
    >
      <div className="space-y-12 pb-20">
        {/* Hero Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0D2818] via-[#1B4332] to-[#2D6A4F] text-white p-8 sm:p-14 shadow-2xl">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold uppercase tracking-widest border border-white/20">
              <SparklesIcon /> Powered by Opti Matrix AI
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Revolutionizing How the World <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-emerald-300">
                Plans & Experiences Travel.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium">
              WanderAI combines generative AI, stateful conversational intelligence, and natural language itinerary modifications to create hyper-personalized, day-by-day travel plans in seconds.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/planner"
                className="px-6 py-3.5 rounded-2xl bg-[#E85D04] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105"
              >
                Try AI Planner Now ✨
              </Link>
              <Link
                href="/recommendations"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all"
              >
                Explore Recommendations 🌍
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#121826] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-2"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1B4332] dark:text-green-400">{stat.value}</p>
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">{stat.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Our Mission & Vision */}
        <section className="bg-white dark:bg-[#121826] p-8 sm:p-12 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E85D04] dark:text-orange-400">Our Vision</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Making Effortless Travel Planning Accessible to Everyone
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Traditional travel planning requires hours of researching blogs, comparing hotels, calculating budgets, and juggling map locations. WanderAI eliminates friction by understanding your exact preferences through natural conversation.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <span>✓</span> 100% Personalization tailored to budget, pace & interests
              </li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <span>✓</span> Zero hardcoded templates – real-time generative intelligence
              </li>
              <li className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <span>✓</span> Complete version control with instant Undo/Redo
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 dark:bg-[#1A2332] p-8 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#1B4332] text-white">
                <CompassIcon />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">Opti Matrix AI Architecture</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Enterprise AI Infrastructure</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Built on Next.js 15+, Python FastAPI microservices, MongoDB collection persistence, and Google Gemini REST API integrations with robust retry resilience.
            </p>
          </div>
        </section>

        {/* Platform Pillars */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E85D04] dark:text-orange-400">Technology Stack</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Core Platform Features</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLATFORM_PILLARS.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-[#121826] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3 hover:shadow-md transition-all"
              >
                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#1A2332] w-fit">{pillar.icon}</div>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{pillar.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Leadership & Engineering Team */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E85D04] dark:text-orange-400">The Minds Behind WanderAI</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Leadership & Engineering</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEADERSHIP_TEAM.map((member, idx) => (
              <div key={idx} className="bg-white dark:bg-[#121826] p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-3 text-center hover:shadow-md transition-shadow">
                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-tr from-[#1B4332] to-[#2D6A4F] text-2xl flex items-center justify-center shadow-md">
                  {member.avatar}
                </div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-xs font-bold text-[#E85D04] dark:text-orange-400">{member.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Plan Your Next Vacation?</h2>
            <p className="text-xs sm:text-sm text-white/80 font-medium">Create your custom AI itinerary in less than 60 seconds.</p>
          </div>
          <Link
            href="/planner"
            className="px-8 py-4 rounded-2xl bg-[#E85D04] hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 whitespace-nowrap"
          >
            Start Planning Now ✨
          </Link>
        </section>
      </div>
    </DashboardLayout>
  );
}
