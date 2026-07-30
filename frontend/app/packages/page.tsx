"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { TOUR_PACKAGES_DATA, TourPackage } from "@/lib/packages-data";
import { useToast } from "@/components/ui/Toast";

// Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#E85D04" : "none"} stroke={filled ? "#E85D04" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CATEGORY_TABS = [
  { id: "all", label: "All Packages", icon: "✨" },
  { id: "international", label: "International", icon: "🌍" },
  { id: "domestic", label: "In India", icon: "🇮🇳" },
  { id: "honeymoon", label: "Honeymoon", icon: "💖" },
  { id: "luxury", label: "Luxury", icon: "💎" },
  { id: "beach", label: "Beach & Island", icon: "🏖️" },
  { id: "adventure", label: "Adventure", icon: "🏔️" },
];

export default function PackagesPage() {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [modalPackage, setModalPackage] = useState<TourPackage | null>(null);

  const toggleWishlist = (id: string, name: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((w) => w !== id));
      addToast(`Removed ${name} from saved packages`, "info");
    } else {
      setWishlist([...wishlist, id]);
      addToast(`Added ${name} to saved packages!`, "success");
    }
  };

  const filteredPackages = useMemo(() => {
    return TOUR_PACKAGES_DATA.filter((pkg) => {
      let matchesTab = true;
      if (activeTab !== "all") {
        matchesTab = pkg.category === activeTab;
      }

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTab;

      const matchesSearch =
        pkg.title.toLowerCase().includes(q) ||
        pkg.destination.toLowerCase().includes(q) ||
        pkg.country.toLowerCase().includes(q) ||
        pkg.highlights.some((h) => h.toLowerCase().includes(q));

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <DashboardLayout
      title="Holiday Packages"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Packages" }]}
    >
      <div className="space-y-10 pb-16">
        {/* ── Hero Search Section ── */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#143326] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E85D04]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#2D6A4F]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-semibold uppercase tracking-widest border border-white/15">
              <CompassIcon /> Premium Curated Tours
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              World-Class <span className="text-[#E85D04]">Holiday Packages</span>
            </h1>

            <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Handcrafted all-inclusive tour packages with 5-star accommodations, private transfers, and bespoke AI customization.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center">
                <div className="absolute left-4 text-white/50">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search packages by destination, country, or experience..."
                  className="w-full bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl py-4 pl-12 pr-10 text-white placeholder-white/50 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#E85D04] focus:border-transparent transition-all shadow-xl"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 text-white/50 hover:text-white text-sm font-semibold">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Category Filter Tabs ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#1B4332] text-white shadow-lg shadow-[#1B4332]/20 scale-105"
                    : "bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/80 dark:border-white/10 shadow-sm"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Results Header ── */}
        <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {activeTab === "all" ? "All Featured Tour Packages" : CATEGORY_TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
              Showing {filteredPackages.length} curated package{filteredPackages.length === 1 ? "" : "s"}
            </p>
          </div>

          <Link
            href="/planner"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E85D04]/10 hover:bg-[#E85D04]/20 text-[#E85D04] font-semibold text-xs sm:text-sm transition-all"
          >
            ✨ Create Custom AI Package
          </Link>
        </div>

        {/* ── Packages Grid ── */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPackages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group bg-white dark:bg-[#121824] rounded-3xl overflow-hidden border border-gray-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Card Banner Image */}
                    <div className="relative h-60 w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                      <Image src={pkg.image} alt={pkg.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover group-hover:scale-108 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        {pkg.isMostPopular ? (
                          <span className="px-3 py-1 rounded-full bg-[#E85D04] text-white text-xs font-extrabold shadow-md uppercase tracking-wider">
                            🔥 Most Popular
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                            {pkg.duration}
                          </span>
                        )}

                        <button
                          onClick={() => toggleWishlist(pkg.id, pkg.title)}
                          className="p-2 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-md hover:bg-white text-gray-800 transition-colors shadow cursor-pointer"
                          title="Save to wishlist"
                        >
                          <HeartIcon filled={wishlist.includes(pkg.id)} />
                        </button>
                      </div>

                      {/* Bottom Banner Title */}
                      <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white/80">{pkg.destination}, {pkg.country}</span>
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
                            <StarIcon /> {pkg.rating} ({pkg.reviewsCount})
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold leading-snug drop-shadow mt-0.5 line-clamp-1">
                          {pkg.title}
                        </h3>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-4">
                      {/* Price & Duration */}
                      <div className="flex items-baseline justify-between border-b border-gray-100 dark:border-white/10 pb-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting From</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-[#1B4332] dark:text-emerald-400">
                              ₹{pkg.priceStarting.toLocaleString("en-IN")}
                            </span>
                            {pkg.originalPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                ₹{pkg.originalPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-300">
                          {pkg.groupSize}
                        </span>
                      </div>

                      {/* Package Highlights */}
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E85D04]">Key Highlights:</span>
                        {pkg.highlights.slice(0, 3).map((h, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                            <CheckIcon />
                            <span className="line-clamp-1">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-6 pt-0 flex items-center gap-3">
                    <button
                      onClick={() => setModalPackage(pkg)}
                      className="flex-1 py-3 rounded-2xl bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>View Details</span>
                      <ArrowRightIcon />
                    </button>
                    <Link
                      href="/planner"
                      className="py-3 px-4 rounded-2xl bg-[#E85D04]/10 hover:bg-[#E85D04]/20 text-[#E85D04] text-xs font-bold transition-colors"
                    >
                      Enquire
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#121824] rounded-3xl p-12 text-center border border-gray-200 dark:border-white/10 space-y-4 max-w-md mx-auto my-8">
            <div className="text-4xl">🧳</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No packages found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              We couldn't find any holiday packages matching "{searchQuery}".
            </p>
            <button onClick={() => { setSearchQuery(""); setActiveTab("all"); }} className="px-5 py-2.5 rounded-xl bg-[#1B4332] text-white text-sm font-semibold">
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Package Quick View Modal */}
      <AnimatePresence>
        {modalPackage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-md" onClick={() => setModalPackage(null)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#161F2E] rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/10 space-y-6 text-gray-900 dark:text-white max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/10 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-xs font-bold uppercase">{modalPackage.category} Package</span>
                  <h3 className="text-2xl font-extrabold mt-1">{modalPackage.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{modalPackage.destination}, {modalPackage.country} • {modalPackage.duration}</p>
                </div>
                <button onClick={() => setModalPackage(null)} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10">✕</button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-extrabold text-[#E85D04] uppercase text-xs mb-2">Package Inclusions:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {modalPackage.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <CheckIcon /> <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-[#1B4332] dark:text-emerald-400 uppercase text-xs mb-2">Highlights & Itinerary Overview:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    {modalPackage.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Price per Person</span>
                  <span className="text-2xl font-extrabold text-[#1B4332] dark:text-emerald-400">₹{modalPackage.priceStarting.toLocaleString("en-IN")}</span>
                </div>
                <Link href="/planner" onClick={() => setModalPackage(null)} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E85D04] to-[#F37216] text-white font-extrabold text-xs shadow">
                  Book / Customize with AI ✨
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
