"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal, StaggerContainer, staggerItem } from "@/components/animations/animation-utils";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  link: string;
  accentColor: string;
}

const SERVICES: Service[] = [
  {
    id: "visa",
    title: "Visa Assistance",
    description: "Hassle-free visa processing for over 80+ countries with 99.4% approval rate and document verification.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    badge: "Fast Track",
    link: "/services#visa",
    accentColor: "from-blue-500 to-indigo-600",
  },
  {
    id: "flights",
    title: "Flight Bookings",
    description: "Exclusive corporate & leisure airfares across major global airlines with flexible date change options.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    link: "/services#flights",
    accentColor: "from-sky-500 to-cyan-600",
  },
  {
    id: "hotels",
    title: "Luxury Hotel Stays",
    description: "Handpicked 4-star, 5-star & boutique resort stays with complimentary breakfast and room upgrades.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0V5" />
      </svg>
    ),
    badge: "Vetted 5★",
    link: "/services#hotels",
    accentColor: "from-amber-500 to-orange-600",
  },
  {
    id: "insurance",
    title: "Travel Insurance",
    description: "Comprehensive medical, baggage loss, flight cancellation, and emergency assistance worldwide.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    link: "/services#insurance",
    accentColor: "from-emerald-500 to-teal-600",
  },
  {
    id: "transfers",
    title: "Airport & Local Transfers",
    description: "Private chauffeur-driven luxury sedans, SUVs, and coaches for seamless point-to-point transit.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    link: "/services#transfers",
    accentColor: "from-purple-500 to-violet-600",
  },
  {
    id: "cruises",
    title: "Cruise Packages",
    description: "All-inclusive ocean voyages & river cruises with gourmet dining, Broadway-style shows & island excursions.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    link: "/services#cruises",
    accentColor: "from-rose-500 to-pink-600",
  },
  {
    id: "corporate",
    title: "Corporate MICE Travel",
    description: "Tailored business travel management, international conferences, incentive trips, and team retreats.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    badge: "B2B Customized",
    link: "/services#corporate",
    accentColor: "from-[#1B4332] to-[#2D6A4F]",
  },
  {
    id: "ai-planning",
    title: "AI Trip Planning",
    description: "Instant personalized day-by-day itineraries calculated by AI based on budget, travel style, and preferences.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    badge: "AI Powered",
    link: "/planner",
    accentColor: "from-[#E85D04] to-[#F37216]",
  },
];

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12" strokeWidth={2} strokeLinecap="round" />
    <polyline points="12 5 19 12 12 19" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ServicesSection() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#121824] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#E85D04]">
              End-To-End Travel Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white font-sans">
              Comprehensive Travel Services
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              From instant AI itineraries and flight reservations to 5-star hotel bookings and visa assistance — we manage every detail.
            </p>
          </div>
        </ScrollReveal>

        {/* Services Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {SERVICES.map((service) => (
            <motion.div key={service.id} variants={staggerItem}>
              <Link
                href={service.link}
                className="group relative flex flex-col justify-between p-7 h-full bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200/70 dark:border-white/10 hover:border-transparent hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
              >
                {/* Glow Backdrop on Hover */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${service.accentColor} opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500`} />

                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.accentColor} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    {service.badge && (
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-200">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2.5 group-hover:text-[#E85D04] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Arrow Action */}
                <div className="pt-6 mt-6 border-t border-gray-200/50 dark:border-white/10 flex items-center gap-2 text-sm font-bold text-[#E85D04] group-hover:translate-x-1 transition-transform">
                  <span>Learn More</span>
                  <ArrowRightIcon />
                </div>
              </Link>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
