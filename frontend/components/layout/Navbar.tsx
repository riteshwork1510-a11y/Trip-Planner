"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import DestinationsMegaMenu from "./DestinationsMegaMenu";

import ServicesMegaMenu from "./ServicesMegaMenu";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  hasDestinationsMega?: boolean;
  hasServicesMega?: boolean;
}

// Icons matching exact image design
const HomeNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ExploreNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const DestinationsNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

const TripPlannerNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const AboutUsNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const BrandCompassLogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PackagesNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const ServicesNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const ContactNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: <HomeNavIcon /> },
  { label: "Destinations", href: "/destinations", icon: <DestinationsNavIcon />, hasDestinationsMega: true },
  { label: "Packages", href: "/packages", icon: <PackagesNavIcon /> },
  { label: "Services", href: "/services", icon: <ServicesNavIcon />, hasServicesMega: true },
  { label: "About", href: "/about", icon: <AboutUsNavIcon /> },
  { label: "Contact", href: "/contact", icon: <ContactNavIcon /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [destMegaOpen, setDestMegaOpen] = useState(false);
  const [servicesMegaOpen, setServicesMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = useCallback(
    (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href)),
    [pathname]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setDestMegaOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#CBE3D6]/95 dark:bg-[#121824]/95 backdrop-blur-xl border-b border-[#1B4332]/10 shadow-md"
            : "bg-[#D6E8DC] dark:bg-[#161F2E] border-b border-[#1B4332]/10"
        }`}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* ── Left Side: Dark Green Pill Logo + User Name Dropdown ── */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                  <BrandCompassLogoIcon />
                </div>
                <span className="text-lg font-extrabold text-[#1B4332] dark:text-white font-sans tracking-tight">
                  OptiTripPlanner
                </span>
              </Link>

              {/* User Dropdown Next to Logo (matching image design) */}
              <div className="relative ml-2" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-full hover:bg-[#1B4332]/10 dark:hover:bg-white/10 transition-colors text-[#1B4332] dark:text-gray-200 text-xs font-bold cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1B4332] text-white flex items-center justify-center text-[10px] font-extrabold shadow-sm">
                    {user?.full_name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "RG"}
                  </div>
                  <span className="font-bold text-xs">{user?.full_name?.split(" ")[0] || "Ritesh"}</span>
                  <ChevronDownIcon />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-[#161F2E] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 py-2 z-50 text-xs text-gray-800 dark:text-gray-200"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-white/10">
                        <p className="font-extrabold">{user?.full_name || "Ritesh Gajjar"}</p>
                        <p className="text-[10px] text-gray-400 truncate">{user?.email || "ritesh.optimatrix@gmail.com"}</p>
                      </div>
                      <div className="py-1 font-semibold space-y-0.5">
                        <Link href="/my-trips" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                          🧳 My Trips
                        </Link>
                        <Link href="/settings" className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                          ⚙️ Settings
                        </Link>
                        <button
                          onClick={() => { setProfileOpen(false); logout(); }}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          🚪 Log Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Center Navigation Items with Icons ── */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <div
                    key={item.href}
                    className="relative py-2"
                    onMouseEnter={() => {
                      if (item.hasDestinationsMega) setDestMegaOpen(true);
                      if (item.hasServicesMega) setServicesMegaOpen(true);
                    }}
                    onMouseLeave={() => {
                      if (item.hasDestinationsMega) setDestMegaOpen(false);
                      if (item.hasServicesMega) setServicesMegaOpen(false);
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`
                        relative flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-extrabold transition-all duration-200 cursor-pointer
                        ${
                          active
                            ? "bg-[#B4D6C1] dark:bg-[#1B4332] text-[#1B4332] dark:text-white shadow-sm"
                            : "text-[#2D4A3E] dark:text-gray-300 hover:bg-[#C2DFC9] dark:hover:bg-white/10 hover:text-[#1B4332] dark:hover:text-white"
                        }
                      `}
                    >
                      <span className="text-[#1B4332] dark:text-emerald-400">{item.icon}</span>
                      <span className="leading-snug">{item.label}</span>
                      {(item.hasDestinationsMega || item.hasServicesMega) && <ChevronDownIcon />}
                      {active && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#1B4332] dark:bg-emerald-400 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* ── Right Side: Animated AI "+ AI Trip Planner" CTA Button & Mobile Hamburger ── */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/planner"
                className="hidden sm:inline-flex relative group overflow-hidden items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-white text-xs font-extrabold shadow-lg shadow-[#E85D04]/30 hover:scale-[1.04] active:scale-100 transition-all duration-300 cursor-pointer border border-white/20"
              >
                {/* Continuous Shimmering AI Gradient Background */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#E85D04] via-[#F37216] via-[#FF8533] to-[#E85D04] bg-[length:200%_auto] animate-[gradient_3s_ease_infinite]" />
                
                {/* Glowing Subtle Pulsing Overlay */}
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Sparkle & Text Content */}
                <span className="relative z-10 text-amber-200 animate-pulse text-sm">✨</span>
                <span className="relative z-10 tracking-wide uppercase font-extrabold text-xs">AI Trip Planner</span>
              </Link>

              {/* Hamburger Button for Mobile & Tablet */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#1B4332] dark:text-white hover:bg-[#1B4332]/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <MenuIcon />
              </button>
            </div>

          </div>

          {/* Desktop MegaMenu Containers */}
          <DestinationsMegaMenu
            isOpen={destMegaOpen}
            onMouseEnter={() => setDestMegaOpen(true)}
            onMouseLeave={() => setDestMegaOpen(false)}
          />

          <ServicesMegaMenu
            isOpen={servicesMegaOpen}
            onMouseEnter={() => setServicesMegaOpen(true)}
            onMouseLeave={() => setServicesMegaOpen(false)}
          />
        </div>
      </motion.nav>

      {/* ── Premium Mobile Side Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[100]">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out Drawer Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 h-full w-[320px] max-w-[85vw] bg-[#D6E8DC] dark:bg-[#121824] shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div>
                <div className="flex items-center justify-between p-5 border-b border-[#1B4332]/10 dark:border-white/10 bg-[#CBE3D6] dark:bg-[#1A2332]">
                  <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-9 h-9 rounded-xl bg-[#1B4332] text-white flex items-center justify-center font-bold shadow">
                      <BrandCompassLogoIcon />
                    </div>
                    <span className="text-lg font-extrabold text-[#1B4332] dark:text-white">
                      OptiTripPlanner
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-[#1B4332] dark:text-gray-400 hover:bg-[#1B4332]/10 dark:hover:bg-white/10 transition-colors"
                  >
                    <XIcon />
                  </button>
                </div>

                {/* Mobile Navigation List */}
                <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                          active
                            ? "bg-[#1B4332] text-white shadow-md"
                            : "text-[#1B4332] dark:text-gray-200 hover:bg-[#CBE3D6] dark:hover:bg-white/5"
                        }`}
                      >
                        <span className={active ? "text-amber-300" : "text-[#1B4332] dark:text-emerald-400"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="p-4 border-t border-[#1B4332]/10 dark:border-white/10 bg-[#CBE3D6] dark:bg-[#1A2332] space-y-3">
                <Link
                  href="/planner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E85D04] via-[#F37216] to-[#FF8533] text-white font-extrabold text-xs shadow-lg uppercase tracking-wider"
                >
                  <span>✨ AI Trip Planner</span>
                </Link>

                {!user && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2.5 text-xs font-extrabold border border-[#1B4332]/20 dark:border-white/20 text-[#1B4332] dark:text-white rounded-xl hover:bg-[#1B4332]/10 transition-colors"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2.5 text-xs font-extrabold bg-[#1B4332] text-white rounded-xl hover:bg-[#153728] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
