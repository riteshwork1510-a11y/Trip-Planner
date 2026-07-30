"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchGlobe, type SearchEntry } from "@/lib/globe/search";

interface SearchBarProps {
  onSelect: (entry: SearchEntry) => void;
  onOpen?: () => void;
}

function debounce<F extends (...args: Parameters<F>) => void>(fn: F, ms: number): F {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as unknown as F;
}

function TypeBadge({ type }: { type: SearchEntry["type"] }) {
  const styles: Record<string, string> = {
    country: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    region: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    city: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    tourist_place: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };
  const labels: Record<string, string> = {
    country: "Country",
    region: "Region",
    city: "City",
    tourist_place: "Attraction",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles[type] || styles.city}`}>
      {labels[type] || "Place"}
    </span>
  );
}

export default function SearchBar({ onSelect, onOpen }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useMemo(
    () =>
      debounce((q: string) => {
        if (!q.trim()) {
          setResults([]);
          setIsOpen(false);
          setIsLoading(false);
          return;
        }
        const r = searchGlobe(q, 12);
        setResults(r);
        setIsOpen(true);
        setActiveIndex(-1);
        setIsLoading(false);
      }, 120),
    [],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setQuery(v);
      setIsLoading(true);
      doSearch(v);
    },
    [doSearch],
  );

  const handleFocus = useCallback(() => {
    onOpen?.();
    if (query.trim() && results.length > 0) setIsOpen(true);
  }, [onOpen, query, results.length]);

  const selectEntry = useCallback(
    (entry: SearchEntry) => {
      setQuery("");
      setResults([]);
      setIsOpen(false);
      setActiveIndex(-1);
      onSelect(entry);
      inputRef.current?.blur();
    },
    [onSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
      }
      if (e.key === "Enter" && activeIndex >= 0 && activeIndex < results.length) {
        e.preventDefault();
        selectEntry(results[activeIndex]);
      }
    },
    [results, activeIndex, selectEntry],
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const showDropdown = isOpen && (query.trim().length > 0);

  return (
    <motion.div
      className="w-full max-w-xl mx-auto relative"
      ref={containerRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#1B4332]/20 via-[#E85D04]/10 to-[#3B82F6]/15 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
        <div className="relative flex items-center gap-3 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-2xl px-5 py-3.5 transition-all duration-300 group-focus-within:border-white/[0.25] group-focus-within:bg-white/[0.12]">
          <div className="text-white/40 group-focus-within:text-white/70 transition-colors">
            {isLoading ? (
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search countries, states, cities, or destinations..."
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-white placeholder:text-white/35 text-sm sm:text-base outline-none font-light tracking-wide"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="text-white/30 hover:text-white/60 transition-colors p-1 -mr-1"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1.5 text-white/25 text-xs">
            <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 font-mono text-[10px]">&#8984;</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-white/15 bg-white/5 font-mono text-[10px]">K</kbd>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="bg-[#0a1a22]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
              <div ref={listRef} className="max-h-[380px] overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                {results.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <div className="text-white/20 mb-2">
                      <svg className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <p className="text-white/40 text-sm">No results found</p>
                    <p className="text-white/25 text-xs mt-1">Try searching for a country, state, or city</p>
                  </div>
                ) : (
                  results.map((entry, i) => (
                    <button
                      key={entry.id}
                      onClick={() => selectEntry(entry)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-all duration-150 ${
                        activeIndex === i
                          ? "bg-white/[0.08]"
                          : "hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {entry.type === "country" ? (
                          <svg className="h-4 w-4 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                          </svg>
                        ) : entry.type === "region" ? (
                          <svg className="h-4 w-4 text-sky-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-.543a2.003 2.003 0 103.078-1.436 2.003 2.003 0 00-3.078 1.436zM3.75 21h16.5" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 text-amber-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          <span className="text-white/90 text-sm font-medium truncate">{entry.name}</span>
                          <TypeBadge type={entry.type} />
                        </div>
                        <p className="text-white/35 text-xs mt-0.5 truncate">
                          {entry.type === "country"
                            ? entry.parentName
                            : entry.type === "region"
                            ? `${entry.parentName}, ${entry.regionName}`
                            : `${entry.parentName}, ${entry.regionName}`}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-white/20">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </button>
                  ))
                )}
              </div>
              {results.length > 0 && (
                <div className="border-t border-white/[0.06] px-5 py-2.5 flex items-center gap-3 text-[11px] text-white/25">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-[9px]">&uarr;</kbd>
                    <kbd className="px-1 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-[9px]">&darr;</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-[9px]">&crarr;</kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-[9px]">esc</kbd>
                    close
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
