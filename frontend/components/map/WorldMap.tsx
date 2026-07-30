"use client";

import { memo, useCallback, useEffect, useState, useMemo, useRef } from "react";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Geometry } from "geojson";
import {
  geoNaturalEarth1,
  geoPath,
  geoGraticule10,
  type GeoProjection,
} from "d3-geo";
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from "d3-zoom";
import { select } from "d3-selection";
import { motion, AnimatePresence } from "framer-motion";

import CountryLayer from "./CountryLayer";
import CountryLabels from "./CountryLabels";
import StateLayer from "./StateLayer";
import MapTooltip from "./MapTooltip";
import StateTooltip from "./StateTooltip";
import CityLayer from "./CityLayer";
import CityTooltip from "./CityTooltip";
import TouristPlaceLayer from "./TouristPlaceLayer";
import MapContainer from "./MapContainer";
import MapControls from "./MapControls";
import MapLegend from "./MapLegend";
import MapBreadcrumb from "./MapBreadcrumb";
import { resolveCountry } from "@/hooks/useWorldMap";
import { getCountryMeta } from "@/lib/globe/country-meta";
import type { CountryFeature } from "@/types/country";
import type { CityFeature, CityFilterState } from "@/lib/globe/cities";
import type { TouristPlace, TouristPlaceFilterState } from "@/lib/globe/tourist-places";

const TOPOJSON_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CountryGeo {
  id: string;
  feature: GeoJSON.Feature<Geometry>;
}

interface WorldMapProps {
  currentView?: "world" | "country" | "regions" | "state";
  onCountryHover: (country: CountryFeature | null, screenPos: { x: number; y: number } | null) => void;
  onCountrySelect: (country: CountryFeature | null) => void;
  hoveredId: string | null;
  selectedId: string | null;
  onStateHover?: (state: any | null, pos: { x: number; y: number } | null) => void;
  onStateSelect?: (state: any | null) => void;
  hoveredStateId?: string | null;
  selectedState?: any | null;
  onCityHover?: (city: CityFeature | null, pos: { x: number; y: number } | null) => void;
  onCitySelect?: (city: CityFeature | null) => void;
  hoveredCityId?: string | null;
  selectedCity?: CityFeature | null;
  cityFilters?: CityFilterState;
  
  onPlaceHover?: (place: TouristPlace | null, pos: { x: number; y: number } | null) => void;
  onPlaceSelect?: (place: TouristPlace | null) => void;
  hoveredPlaceId?: string | null;
  selectedPlace?: TouristPlace | null;
  placeFilters?: TouristPlaceFilterState;
}

function WorldMapInner({
  currentView = "world",
  onCountryHover,
  onCountrySelect,
  hoveredId,
  selectedId,
  onStateHover,
  onStateSelect,
  hoveredStateId,
  selectedState,
  onCityHover,
  onCitySelect,
  hoveredCityId,
  selectedCity,
  cityFilters,
  onPlaceHover,
  onPlaceSelect,
  hoveredPlaceId,
  selectedPlace,
  placeFilters,
}: WorldMapProps) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [countries, setCountries] = useState<CountryGeo[]>([]);
  const [topology, setTopology] = useState<Topology | null>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 500 });
  const [isLoading, setIsLoading] = useState(true);
  
  const [zoomScale, setZoomScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomBehavior = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const projection = useMemo<GeoProjection>(() => {
    return geoNaturalEarth1()
      .scale(dimensions.width / 5.5)
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions.width, dimensions.height]);

  const pathGenerator = useMemo(
    () => geoPath().projection(projection),
    [projection],
  );

  const spherePath = useMemo(
    () => pathGenerator({ type: "Sphere" } as any) ?? "",
    [pathGenerator],
  );

  const graticulePath = useMemo(
    () => pathGenerator(geoGraticule10() as any) ?? "",
    [pathGenerator],
  );

  const bordersPath = useMemo(() => {
    if (!topology || countries.length === 0) return "";
    try {
      const mesh = topojson.mesh(
        topology,
        topology.objects.countries as any,
        (a, b) => a !== b,
      );
      return pathGenerator(mesh as any) ?? "";
    } catch {
      return "";
    }
  }, [topology, countries.length, pathGenerator]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(TOPOJSON_URL);
        const topo: Topology = await res.json();
        if (cancelled) return;

        const geo = topojson.feature(
          topo,
          topo.objects.countries,
        ) as GeoJSON.FeatureCollection<Geometry>;

        const mapped: CountryGeo[] = geo.features
          .filter((f) => f.id !== undefined)
          .map((f) => ({ id: String(f.id), feature: f }));

        setTopology(topo);
        setCountries(mapped);
        setTimeout(() => setIsLoading(false), 500); 
      } catch (err) {
        console.error("Failed to load world topology:", err);
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove, {
      passive: true,
    });
    return () =>
      window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const svg = select(svgRef.current);
    
    zoomBehavior.current = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 40])
      .translateExtent([
        [0, 0],
        [dimensions.width, dimensions.height],
      ])
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        if (gRef.current) {
          gRef.current.setAttribute("transform", event.transform.toString());
        }
        setZoomScale(event.transform.k);
      });

    svg.call(zoomBehavior.current);
  }, [dimensions]);

  useEffect(() => {
    if (!selectedId || !svgRef.current || !zoomBehavior.current) return;

    const countryGeo = countries.find((c) => c.id === selectedId);
    if (!countryGeo) return;

    try {
      // Do not auto-zoom to the country if we haven't clicked "Explore" yet
      if (currentView === "world") {
         return;
      }

      // Prioritize State bounds if a state is selected and we are in state view
      if (currentView === "state" && selectedState) {
         const stateBounds = pathGenerator.bounds(selectedState as any);
         if (stateBounds && !isNaN(stateBounds[0][0])) {
            const sdx = stateBounds[1][0] - stateBounds[0][0];
            const sdy = stateBounds[1][1] - stateBounds[0][1];
            const sx = (stateBounds[0][0] + stateBounds[1][0]) / 2;
            const sy = (stateBounds[0][1] + stateBounds[1][1]) / 2;
            const sscale = Math.max(1, Math.min(25, 0.8 / Math.max(sdx / dimensions.width, sdy / dimensions.height)));
            const stranslate = [
              dimensions.width / 2 - sscale * sx,
              dimensions.height / 2 - sscale * sy
            ];
            (select(svgRef.current) as any).transition().duration(850).ease((t: number) => t * (2 - t)).call(zoomBehavior.current.transform, zoomIdentity.translate(stranslate[0], stranslate[1]).scale(sscale));
            return;
         }
      }

      const bounds = pathGenerator.bounds(countryGeo.feature as any);
      if (!bounds || isNaN(bounds[0][0])) return;

      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;

      const scale = Math.max(1, Math.min(15, 0.8 / Math.max(dx / dimensions.width, dy / dimensions.height)));
      
      const translate = [
        dimensions.width / 2 - scale * x,
        dimensions.height / 2 - scale * y
      ];

      (select(svgRef.current) as any)
        .transition()
        .duration(850)
        .ease((t: number) => t * (2 - t))
        .call(
          zoomBehavior.current.transform,
          zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
    } catch (e) {
      console.warn("Failed to zoom to bounds", e);
    }
  }, [selectedId, selectedState, currentView, countries, pathGenerator, dimensions]);

  // City Zoom
  useEffect(() => {
    // Cannot easily zoom without full CityFeature passed in this step, but we will pass it from page.tsx soon if needed, 
    // or we can ignore automatic panning to city if they just click it (it highlights it instead).
  }, [selectedCity?.id]);

  const handleHover = useCallback(
    (country: CountryFeature | null, pos: { x: number; y: number } | null) => {
      onCountryHover(country, pos ?? mousePos);
    },
    [onCountryHover, mousePos],
  );

  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomBehavior.current) {
      (select(svgRef.current) as any).transition().duration(300).call(zoomBehavior.current.scaleBy, 1.5);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomBehavior.current) {
      (select(svgRef.current) as any).transition().duration(300).call(zoomBehavior.current.scaleBy, 1 / 1.5);
    }
  }, []);

  const handleResetMap = useCallback(() => {
    if (svgRef.current && zoomBehavior.current) {
      (select(svgRef.current) as any).transition().duration(750).call(zoomBehavior.current.transform, zoomIdentity);
      onCountrySelect(null);
      if (onStateSelect) onStateSelect(null);
      if (onCitySelect) onCitySelect(null);
      if (onPlaceSelect) onPlaceSelect(null);
    }
  }, [onCountrySelect, onStateSelect, onCitySelect, onPlaceSelect]);

  const selectedCountryMeta = selectedId ? getCountryMeta(selectedId) : null;
  const selectedCountryName = selectedId ? resolveCountry(selectedId)?.name : null;

  return (
    <MapContainer>
      <div ref={containerRef} className="w-full h-full relative overflow-hidden">
        
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#060e15] backdrop-blur-sm"
            >
              <div className="h-10 w-10 border-4 border-white/10 border-t-[#E85D04] rounded-full animate-spin mb-4" />
              <p className="text-white/50 text-sm font-medium tracking-wide">Initializing World Map...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <MapBreadcrumb 
          countryName={selectedCountryName ?? null}
          stateName={currentView === "regions" && !selectedState ? "Regions" : selectedState?.properties?.name || null}
          cityName={selectedCity?.name || null}
          placeName={selectedPlace?.name || null}
          onWorldClick={handleResetMap}
          onCountryClick={() => { 
            if (onStateSelect) onStateSelect(null); 
            if (onCitySelect) onCitySelect(null);
            if (onPlaceSelect) onPlaceSelect(null);
          }}
          onStateClick={() => {
            if (onCitySelect) onCitySelect(null);
            if (onPlaceSelect) onPlaceSelect(null);
          }}
          onCityClick={() => {
            if (onPlaceSelect) onPlaceSelect(null);
          }}
        />

        <MapControls 
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetMap}
        />
        <MapLegend />

        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          style={{ width: "100%", height: "100%", outline: "none", cursor: "grab" }}
          className="block"
          onClick={() => {
            onCountrySelect(null);
            if (onStateSelect) onStateSelect(null);
            if (onCitySelect) onCitySelect(null);
            if (onPlaceSelect) onPlaceSelect(null);
          }}
        >
          <g ref={gRef}>
            {spherePath && (
              <path 
                d={spherePath} 
                fill="#0a1520" 
                stroke="none" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onCountrySelect(null); 
                  if (onStateSelect) onStateSelect(null); 
                  if (onCitySelect) onCitySelect(null);
                  if (onPlaceSelect) onPlaceSelect(null);
                }} 
              />
            )}

            {graticulePath && (
              <path
                d={graticulePath}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={0.5}
                style={{ pointerEvents: "none" }}
              />
            )}

            <motion.g
              initial={false}
              animate={{ opacity: selectedId ? (selectedState ? 0.15 : 0.3) : 1 }}
              transition={{ duration: 0.5 }}
            >
              <CountryLayer
                countries={countries}
                pathGenerator={pathGenerator}
                hoveredId={hoveredId}
                selectedId={selectedId ?? null}
                hiddenCountryId={currentView === "regions" || currentView === "state" ? selectedId : null}
                onCountryHover={handleHover}
                onCountrySelect={onCountrySelect}
              />
            </motion.g>

            {bordersPath && (
              <path
                d={bordersPath}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.4}
                strokeLinejoin="round"
                style={{ pointerEvents: "none" }}
              />
            )}
            
            {/* Show Country labels if no country is selected */}
            {!selectedId && (
              <CountryLabels 
                countries={countries}
                pathGenerator={pathGenerator}
                zoomScale={zoomScale}
              />
            )}

            {/* Render State Layer if in regions or state view */}
            {(currentView === "regions" || currentView === "state") && selectedId && selectedCountryMeta && selectedCountryName && onStateHover && onStateSelect && (
              <motion.g
                 initial={false}
                 animate={{ opacity: selectedState ? 0.4 : 1 }}
                 transition={{ duration: 0.5 }}
              >
                <StateLayer
                  countryAlpha3={selectedCountryMeta.alpha2}
                  countryName={selectedCountryName}
                  pathGenerator={pathGenerator}
                  hoveredStateId={hoveredStateId ?? null}
                  selectedStateId={selectedState?.id ?? null}
                  onStateHover={onStateHover}
                  onStateSelect={onStateSelect}
                />
              </motion.g>
            )}

            {/* Render City Layer if state is selected and we are in state view */}
            {currentView === "state" && selectedState && selectedId && onCityHover && onCitySelect && cityFilters && (
              <CityLayer
                stateFeature={selectedState}
                countryId={selectedId}
                projection={projection}
                zoomScale={zoomScale}
                dimensions={dimensions}
                hoveredCityId={hoveredCityId ?? null}
                selectedCityId={selectedCity?.id ?? null}
                filters={cityFilters}
                onCityHover={onCityHover}
                onCitySelect={onCitySelect}
              />
            )}

            {/* Render Tourist Place Layer if city is selected */}
            {selectedCity && onPlaceHover && onPlaceSelect && placeFilters && (
              <TouristPlaceLayer
                cityFeature={selectedCity}
                projection={projection}
                zoomScale={zoomScale}
                dimensions={dimensions}
                hoveredPlaceId={hoveredPlaceId ?? null}
                selectedPlaceId={selectedPlace?.id ?? null}
                filters={placeFilters}
                onPlaceHover={onPlaceHover}
                onPlaceSelect={onPlaceSelect}
              />
            )}
          </g>
        </svg>
      </div>

      {!selectedId && (
        <MapTooltip
          country={hoveredId ? resolveCountry(hoveredId) : null}
          position={mousePos}
        />
      )}
    </MapContainer>
  );
}

const WorldMap = memo(WorldMapInner);
export default WorldMap;
