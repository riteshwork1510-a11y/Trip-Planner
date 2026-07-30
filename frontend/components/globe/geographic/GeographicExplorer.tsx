"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CountryFeature } from "@/lib/globe/countries";
import { getCountryMeta, getCountryFlag } from "@/lib/globe/country-meta";
import { getCountryHierarchy, type RegionData, type CityData } from "@/lib/globe/geography";
import CityDetailPanel from "./CityDetailPanel";

type NavLevel = "country" | "region" | "city";

interface GeographicExplorerProps {
  country: CountryFeature;
  onReset: () => void;
  onCitySelect?: (city: CityData, region: RegionData) => void;
  initialRegionName?: string;
  initialCityName?: string;
}

export default function GeographicExplorer({ country, onReset, onCitySelect, initialRegionName, initialCityName }: GeographicExplorerProps) {
  const meta = getCountryMeta(country.id);
  const flag = getCountryFlag(meta.alpha2);
  const hierarchy = getCountryHierarchy(country.id);

  const initRegion = initialRegionName
    ? hierarchy.regions.find((r) => r.name === initialRegionName) ?? null
    : null;
  const initCity = initRegion && initialCityName
    ? initRegion.cities.find((c) => c.name === initialCityName) ?? null
    : null;

  const [level, setLevel] = useState<NavLevel>(
    initCity ? "city" : initRegion ? "region" : "country",
  );
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(initRegion);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(initCity);
  const [search, setSearch] = useState("");

  const navigateToRegion = useCallback((region: RegionData) => {
    setSelectedRegion(region);
    setSelectedCity(null);
    setLevel("region");
    setSearch("");
  }, []);

  const navigateToCity = useCallback((city: CityData) => {
    setSelectedCity(city);
    setLevel("city");
    setSearch("");
    onCitySelect?.(city, selectedRegion!);
  }, [onCitySelect, selectedRegion]);

  const goBack = useCallback(() => {
    if (level === "city") {
      setLevel("region");
      setSelectedCity(null);
    } else if (level === "region") {
      setLevel("country");
      setSelectedRegion(null);
    }
    setSearch("");
  }, [level]);

  const breadcrumbs = useMemo(() => {
    const crumbs: { label: string; onClick: () => void }[] = [
      { label: country.name, onClick: () => { setLevel("country"); setSelectedRegion(null); setSelectedCity(null); setSearch(""); } },
    ];
    if (selectedRegion) {
      crumbs.push({
        label: selectedRegion.name,
        onClick: () => { setLevel("region"); setSelectedCity(null); setSearch(""); },
      });
    }
    if (selectedCity) {
      crumbs.push({ label: selectedCity.name, onClick: () => {} });
    }
    return crumbs;
  }, [country.name, selectedRegion, selectedCity]);

  const filteredRegions = useMemo(() => {
    if (!search) return hierarchy.regions;
    const q = search.toLowerCase();
    return hierarchy.regions.filter((r) => r.name.toLowerCase().includes(q));
  }, [hierarchy.regions, search]);

  const filteredCities = useMemo(() => {
    if (!selectedRegion) return [];
    if (!search) return selectedRegion.cities;
    const q = search.toLowerCase();
    return selectedRegion.cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [selectedRegion, search]);

  const itemCount = level === "country" ? filteredRegions.length : filteredCities.length;
  const searchPlaceholder = level === "country"
    ? `Search ${hierarchy.regionLabel.toLowerCase()}...`
    : "Search cities...";

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] border border-white/[0.08] text-2xl flex-shrink-0 select-none">
          {flag}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/95 font-bold text-base leading-tight truncate">{country.name}</p>
          <p className="text-white/40 text-[11px]">{country.region}</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-[10px] font-semibold uppercase tracking-wider flex-shrink-0">
          <PlaneIcon className="h-3 w-3" /> Selected
        </span>
      </div>

      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/20 text-[10px]">&#8250;</span>}
            {i < breadcrumbs.length - 1 ? (
              <button
                onClick={crumb.onClick}
                className="text-white/45 hover:text-white/70 text-[11px] font-medium transition-colors truncate max-w-[120px]"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-white/70 text-[11px] font-semibold truncate max-w-[120px]">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* ── Back + Search ── */}
      {level !== "country" && (
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/65 text-xs mb-2 transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to {level === "city" ? selectedRegion?.name : hierarchy.regionLabel}
        </button>
      )}

      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-3 py-2 text-white/80 placeholder:text-white/25 text-xs outline-none focus:border-white/[0.15] transition-colors"
        />
      </div>

      {/* ── Stats ── */}
      <div className="flex items-center justify-between mb-2 px-0.5">
        <p className="text-white/30 text-[10px] uppercase tracking-wider font-medium">
          {level === "country" ? hierarchy.regionLabel : "Cities"}
        </p>
        <p className="text-white/25 text-[10px]">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-1 pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <AnimatePresence mode="wait">
          {level === "country" && (
            <motion.div
              key="regions"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-1"
            >
              {filteredRegions.map((region) => (
                <button
                  key={region.name}
                  onClick={() => navigateToRegion(region)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B4332]/30 text-[#3B82F6] flex-shrink-0">
                      <MapPinIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-white/70 group-hover:text-white/90 text-sm font-medium truncate transition-colors">
                      {region.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-white/25 text-[10px]">{region.cities.length} cities</span>
                    <svg className="h-3.5 w-3.5 text-white/20 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
              {filteredRegions.length === 0 && (
                <EmptyState text="No regions found" />
              )}
            </motion.div>
          )}

          {level === "region" && selectedRegion && (
            <motion.div
              key={`cities-${selectedRegion.name}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              className="space-y-1"
            >
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => navigateToCity(city)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-200 text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E85D04]/10 text-[#E85D04] flex-shrink-0">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <span className="text-white/70 group-hover:text-white/90 text-sm font-medium transition-colors">
                      {city.name}
                    </span>
                  </div>
                  <svg className="h-3.5 w-3.5 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
              {filteredCities.length === 0 && (
                <EmptyState text="No cities found" />
              )}
            </motion.div>
          )}

          {level === "city" && selectedCity && selectedRegion && (
            <motion.div
              key={`city-detail-${selectedCity.name}`}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
            >
              <CityDetailPanel
                city={selectedCity}
                region={selectedRegion}
                countryName={country.name}
                countryFlag={flag}
                onBack={goBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer CTA ── */}
      {level === "country" && (
        <div className="pt-3 mt-3 border-t border-white/[0.06] flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#E85D04]/15 hover:bg-[#E85D04]/25 text-[#E85D04] text-xs font-semibold transition-colors">
            <PlaneIcon className="h-3.5 w-3.5" />
            Explore Country
          </button>
          <button
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/70 text-xs font-medium transition-colors border border-white/[0.06]"
          >
            <GlobeIcon className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Shared Sub-components ────────────────────── */

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-white/25 text-xs">{text}</p>
    </div>
  );
}

/* ─── Icons ────────────────────────────────────── */

function MapPinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function PlaneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
  );
}

function GlobeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9 9 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}
