"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  title: string;
  type: "Destination" | "Package" | "Hotel" | "Blog" | "Country" | "City";
  subtitle: string;
  link: string;
}

const SEARCH_DATABASE: SearchResult[] = [
  { id: "s1", title: "Bali, Indonesia", type: "Destination", subtitle: "Tropical beaches, temples & rice terraces", link: "/destinations/bali" },
  { id: "s2", title: "Swiss Alps Express", type: "Package", subtitle: "7 Days Luxury train & mountain tour", link: "/packages?id=swiss" },
  { id: "s3", title: "Burj Al Arab Luxury Suite", type: "Hotel", subtitle: "5-Star Ultra Luxury Stay in Dubai", link: "/services#hotels" },
  { id: "s4", title: "10 Best Beaches in Goa for Couples", type: "Blog", subtitle: "Travel guide & insider tips", link: "/blog/goa-beaches" },
  { id: "s5", title: "France", type: "Country", subtitle: "Europe • Paris, Riviera, Normandy", link: "/destinations/france" },
  { id: "s6", title: "Kyoto", type: "City", subtitle: "Japan • Historic shrines & gardens", link: "/destinations/kyoto" },
  { id: "s7", title: "Maldives Overwater Villa Package", type: "Package", subtitle: "4 Days All-Inclusive Resort Stay", link: "/packages?id=maldives" },
];

export default function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = query.trim() === ""
    ? SEARCH_DATABASE.slice(0, 4)
    : SEARCH_DATABASE.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#161F2E] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-3">
              <span className="text-xl">🔍</span>
              <input
                type="text"
                autoFocus
                placeholder="Search destinations, packages, hotels, blogs, countries..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-lg font-medium outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              />
              <button
                onClick={onClose}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-3">
                {query.trim() === "" ? "⚡ Popular Searches" : `Results (${results.length})`}
              </div>

              {results.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">
                  No matching destinations or packages found for "{query}".
                </div>
              ) : (
                results.map((item) => (
                  <Link
                    key={item.id}
                    href={item.link}
                    onClick={onClose}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#E85D04] transition-colors">
                          {item.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.subtitle}</p>
                    </div>
                    <span className="text-gray-400 group-hover:text-[#E85D04] group-hover:translate-x-1 transition-all">→</span>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
