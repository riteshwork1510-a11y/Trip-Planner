"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/components/ui/Toast";

// Icons
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CompassIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Services Data Structure
const SERVICES_DATA = [
  {
    id: "visa",
    title: "Visa Assistance",
    badge: "Fast Track",
    stats: "99.4% Approval Rate Across 80+ Countries",
    icon: "📄",
    tagline: "Hassle-Free Express Tourist & Business Visa Documentation",
    description: "End-to-end embassy visa submission, document validation, appointment scheduling, and express processing for Schengen, USA, UK, UAE, Japan, and Singapore visas.",
    features: [
      "Dedicated Visa Concierge Specialist",
      "Document Check & Pre-Screening Audit",
      "Embassy Appointment Booking",
      "Express 48-Hour Urgent Processing",
      "Complimentary Cover Letter Drafting",
    ],
    pricing: "Starts from ₹1,499 per applicant",
  },
  {
    id: "flights",
    title: "Flight Bookings",
    badge: "Corporate Rates",
    stats: "Up to 30% Off Commercial Airlines",
    icon: "✈️",
    tagline: "Exclusive First, Business & Economy Airfare Deals",
    description: "Access unpublished corporate airfares, zero-cancellation fee flights, free seat selection, and 24/7 flight rescheduling assistance.",
    features: [
      "Access to Unpublished Airline Tariffs",
      "Zero Cancellation Fee Options",
      "Flexible Date Change Waivers",
      "Complimentary Airport Lounge Access Pass",
      "24/7 Irregular Ops Flight Monitoring",
    ],
    pricing: "Starts from ₹2,999 domestic / ₹14,999 international",
  },
  {
    id: "hotels",
    title: "Luxury Hotels & Resorts",
    badge: "Vetted 5★",
    stats: "15,000+ Vetted 4★ & 5★ Properties",
    icon: "🏨",
    tagline: "Guaranteed Room Upgrades, Late Check-outs & VIP Perks",
    description: "Curated handpicked luxury resorts, private villas, boutique heritage stays, and 5-star hotel chains with complimentary breakfast and resort credits.",
    features: [
      "Guaranteed Room Upgrade on Arrival",
      "Complimentary Gourmet Daily Breakfast",
      "$100 Hotel Resort Credit",
      "Flexible Early Check-in / Late Check-out",
      "Direct General Manager VIP Welcome",
    ],
    pricing: "Starts from ₹4,500 / night",
  },
  {
    id: "insurance",
    title: "Travel Insurance",
    badge: "Full Protection",
    stats: "$500,000 Medical Cover Included",
    icon: "🛡️",
    tagline: "Comprehensive Cashless Global Health & Trip Shield",
    description: "Instant cashless medical emergency coverage, flight delay compensation, lost baggage reimbursement, and trip interruption protection worldwide.",
    features: [
      "Cashless Hospitalization in 150+ Countries",
      "Full Baggage Loss & Baggage Delay Reimbursement",
      "Flight Delay & Cancellation Compensation",
      "Adventure Sports & Extreme Activity Coverage",
      "24/7 Global Medical Helpline",
    ],
    pricing: "Starts from ₹499 / trip",
  },
  {
    id: "transfers",
    title: "Airport & City Transfers",
    badge: "Chauffeur Driven",
    stats: "100% Punctual Pickup Guarantee",
    icon: "🚘",
    tagline: "Luxury Mercedes, Audi & SUV Chauffeur Pickups",
    description: "Pre-booked door-to-door airport pickups, intercity private chauffeur drives, and luxury car rentals with flight tracking and free waiting time.",
    features: [
      "Live Flight Tracking & Free 60-min Airport Wait Time",
      "Uniformed English-Speaking Chauffeurs",
      "Sanitized Luxury Fleet (Mercedes, BMW, Audi, Alphard)",
      "All Tolls, Parking & Driver Charges Included",
      "Child Seat & Extra Luggage Space Options",
    ],
    pricing: "Starts from ₹1,200 per transfer",
  },
  {
    id: "cruises",
    title: "Cruise Packages",
    badge: "All Inclusive",
    stats: "200+ Ocean & River Voyages",
    icon: "🚢",
    tagline: "Royal Caribbean, Celebrity Cruises & River Expedition Cabins",
    description: "All-inclusive ocean liner cruises, Mediterranean voyages, Norwegian Fjords, and Mekong river expeditions with balcony suites and beverage packages.",
    features: [
      "All-Inclusive Dining & Specialty Restaurants",
      "Ocean-View & Private Balcony Suite Upgrades",
      "Onboard Entertainment & Casino Passes",
      "Exclusive Shore Excursions Included",
      "Onboard Credit Vouchers ($250 per stateroom)",
    ],
    pricing: "Starts from ₹35,000 per person",
  },
  {
    id: "corporate",
    title: "Corporate Travel & MICE",
    badge: "B2B Solutions",
    stats: "500+ Successful Offsites & Retreats",
    icon: "💼",
    tagline: "End-to-End Corporate Retreats, Offsites & Event Management",
    description: "Seamless company offsites, leadership retreats, conference venue booking, employee incentive travel, and dedicated corporate travel account managers.",
    features: [
      "Dedicated Corporate Account Manager",
      "Automated GST Invoice & Expense Reconciliation",
      "Custom Team-Building & Gala Night Management",
      "Group Flight & Charter Jet Bookings",
      "24/7 Employee Emergency Travel Desk",
    ],
    pricing: "Custom Enterprise Quotes",
  },
];

export default function ServicesPage() {
  const { addToast } = useToast();
  const [activeServiceModal, setActiveServiceModal] = useState<typeof SERVICES_DATA[0] | null>(null);

  const handleEnquire = (title: string) => {
    addToast(`Enquiry submitted for ${title}! A travel specialist will contact you shortly.`, "success");
    setActiveServiceModal(null);
  };

  return (
    <DashboardLayout
      title="Travel Services"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
    >
      <div className="space-y-12 pb-16">
        {/* ── Hero Banner ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#143326] via-[#1B4332] to-[#2D6A4F] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E85D04]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2D6A4F]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold uppercase tracking-widest border border-white/15">
              <CompassIcon /> Premium Travel Concierge
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Comprehensive <span className="text-[#E85D04]">Travel Services</span>
            </h1>

            <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              From fast-track visa processing to luxury chauffeur transfers, 5-star hotel perks, and corporate retreats — we handle every detail.
            </p>
          </div>
        </div>

        {/* ── Quick Jump Anchor Navigation Bar ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SERVICES_DATA.map((srv) => (
            <a
              key={srv.id}
              href={`#${srv.id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-[#1B4332] hover:text-white border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all whitespace-nowrap shadow-sm"
            >
              <span>{srv.icon}</span>
              <span>{srv.title}</span>
            </a>
          ))}
        </div>

        {/* ── Detailed Services List ── */}
        <div className="space-y-12">
          {SERVICES_DATA.map((srv, index) => (
            <motion.section
              key={srv.id}
              id={srv.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="scroll-mt-28 bg-white dark:bg-[#121824] rounded-3xl p-6 sm:p-10 border border-gray-200/80 dark:border-white/10 shadow-xl space-y-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-100 dark:border-white/10 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-3 rounded-2xl bg-gray-100 dark:bg-white/10 shadow-inner">{srv.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{srv.title}</h2>
                        <span className="px-3 py-0.5 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-xs font-extrabold uppercase">
                          {srv.badge}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{srv.stats}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 pt-1">{srv.tagline}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400">{srv.pricing}</span>
                  <button
                    onClick={() => setActiveServiceModal(srv)}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] hover:from-[#143326] hover:to-[#1B4332] text-white text-xs font-extrabold shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    Enquire Now ✨
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">{srv.description}</p>

              {/* Service Features Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#E85D04]">What's Included:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {srv.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs font-semibold text-gray-800 dark:text-gray-200">
                      <CheckIcon />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* ── AI Planner CTA Banner ── */}
        <div className="rounded-3xl bg-gradient-to-r from-[#E85D04] via-[#F37216] to-[#FF8533] text-white p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Need custom itinerary planning with these services?</h3>
            <p className="text-white/90 text-sm sm:text-base max-w-xl">
              Use our AI Trip Planner to combine flights, luxury hotel stays, visa assistance, and transfers into one seamless itinerary.
            </p>
          </div>
          <Link
            href="/planner"
            className="px-6 py-3.5 rounded-2xl bg-white text-[#E85D04] hover:bg-amber-50 font-bold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 whitespace-nowrap"
          >
            Launch AI Planner ✨
          </Link>
        </div>
      </div>

      {/* Service Enquiry Modal */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setActiveServiceModal(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-md bg-white dark:bg-[#161F2E] rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10 space-y-6 text-gray-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeServiceModal.icon}</span>
                  <div>
                    <h3 className="text-lg font-extrabold">{activeServiceModal.title}</h3>
                    <p className="text-xs text-[#E85D04] font-bold">{activeServiceModal.pricing}</p>
                  </div>
                </div>
                <button onClick={() => setActiveServiceModal(null)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">✕</button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleEnquire(activeServiceModal.title); }} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className="block text-gray-500">Your Full Name</label>
                  <input type="text" required placeholder="John Doe" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-[#E85D04]" />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-500">Email Address</label>
                  <input type="email" required placeholder="john@example.com" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-[#E85D04]" />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-500">Phone Number</label>
                  <input type="tel" required placeholder="+91 98765 43210" className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-[#E85D04]" />
                </div>
                <div className="space-y-1">
                  <label className="block text-gray-500">Special Notes or Travel Dates</label>
                  <textarea rows={2} placeholder="Share travel dates, group size or specific requests..." className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-[#E85D04]" />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#E85D04] text-white font-extrabold text-xs shadow hover:scale-[1.01] transition-transform">
                  Submit Enquiry ✨
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
