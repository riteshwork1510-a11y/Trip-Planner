"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const BrandCompassIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
  </svg>
);

const FOOTER_LINKS = {
  destinations: [
    { label: "🇮🇳 India Tours", href: "/destinations/india" },
    { label: "🌍 Europe Expeditions", href: "/destinations/europe" },
    { label: "🏝️ Bali & Islands", href: "/destinations/bali" },
    { label: "🏙️ Dubai Luxury", href: "/destinations/dubai" },
    { label: "🗼 Paris & Riviera", href: "/destinations/paris" },
    { label: "🏔️ Swiss Alps", href: "/destinations/swiss-alps" },
  ],
  services: [
    { label: "📄 Visa Assistance", href: "/services#visa" },
    { label: "✈️ Flight Bookings", href: "/services#flights" },
    { label: "🏨 5-Star Hotel Stays", href: "/services#hotels" },
    { label: "🛡️ Travel Insurance", href: "/services#insurance" },
    { label: "🚘 Airport Transfers", href: "/services#transfers" },
    { label: "✨ AI Trip Planner", href: "/planner" },
  ],
  company: [
    { label: "About WanderAI", href: "/about" },
    { label: "Travel Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
    { label: "Support & Help", href: "/support" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Accreditations", href: "/about#accreditation" },
    { label: "Refund Policy", href: "/terms#refunds" },
  ],
};

const TRUST_BADGES = ["IATA Accredited #96-3241", "TAAI Member #8410", "TAFI Verified", "ISO 9001:2015 Quality"];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white border-t border-white/10 relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#1B4332]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#E85D04]/10 blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E85D04] to-[#FF8533] flex items-center justify-center text-white shadow-lg shadow-[#E85D04]/30 group-hover:scale-105 transition-transform duration-300">
                <BrandCompassIcon />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight font-sans">
                  Opti<span className="text-[#FF8533]">TripPlanner</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
                  Luxury Travel Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              World-class AI travel planner offering bespoke day-by-day itineraries, luxury hotel reservations, flight bookings, and 24/7 travel intelligence.
            </p>

            {/* Newsletter Input */}
            <div className="pt-2 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#E85D04]">Subscribe to Luxury Deals</span>
              <div className="flex items-center gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#E85D04] transition-colors"
                />
                <button className="px-4 py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#D4540A] text-white font-extrabold text-xs shadow transition-all cursor-pointer">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links Columns */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#E85D04]">Destinations</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              {FOOTER_LINKS.destinations.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#E85D04]">Services</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#E85D04]">Company & Legal</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-300">
              {FOOTER_LINKS.company.concat(FOOTER_LINKS.legal).slice(0, 6).map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Accreditations & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div className="flex flex-wrap items-center gap-3">
            {TRUST_BADGES.map((b) => (
              <span key={b} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-[11px] font-semibold">
                ✓ {b}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-right">
            <p>© {new Date().getFullYear()} OptiTripPlanner Inc. All rights reserved. Enterprise AI Travel Platform.</p>
            <span className="hidden sm:inline text-gray-700">|</span>
            <p className="text-gray-400">
              Design & Developed by{" "}
              <a
                href="https://www.optiinfo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF8533] hover:text-[#E85D04] font-bold hover:underline transition-colors"
              >
                Opti Matrix Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
