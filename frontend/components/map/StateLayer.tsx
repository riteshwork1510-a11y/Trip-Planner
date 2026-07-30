"use client";

import { memo, useEffect, useState, useCallback } from "react";
import type { Geometry } from "geojson";
import type { GeoPath } from "d3-geo";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import { motion, AnimatePresence } from "framer-motion";

interface StateFeature extends GeoJSON.Feature<Geometry> {
  id: string;
  properties: {
    name: string;
    [key: string]: any;
  };
}

interface StateLayerProps {
  countryAlpha3: string;
  countryName: string;
  pathGenerator: GeoPath;
  hoveredStateId: string | null;
  selectedStateId: string | null;
  onStateHover: (state: StateFeature | null, pos: { x: number; y: number } | null) => void;
  onStateSelect: (state: StateFeature | null) => void;
}

const DEFAULT_FILL = "rgba(26, 35, 50, 0.4)";
const HOVER_FILL = "rgba(38, 53, 72, 0.7)";
const SELECTED_FILL = "rgba(232, 93, 4, 0.5)";
const STROKE_COLOR = "rgba(255,255,255,0.15)";
const HOVER_STROKE = "rgba(255,255,255,0.4)";
const SELECTED_STROKE = "#E85D04";

// Caching states to prevent refetching
const topologyCache = new Map<string, StateFeature[] | null>();

function StateLayerInner({
  countryAlpha3,
  countryName,
  pathGenerator,
  hoveredStateId,
  selectedStateId,
  onStateHover,
  onStateSelect,
}: StateLayerProps) {
  const [states, setStates] = useState<StateFeature[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStates() {
      setIsLoading(true);
      
      const cacheKey = countryAlpha3.toLowerCase();
      if (topologyCache.has(cacheKey)) {
        setStates(topologyCache.get(cacheKey)!);
        setIsLoading(false);
        return;
      }

      try {
        const countrySlug = countryName.toLowerCase().replace(/\s+/g, '-');
        
        let url = `/geojson/${countrySlug}-states.geojson`;
        if (countrySlug === 'canada') {
          url = `/geojson/canada-provinces.geojson`;
        } else if (countrySlug === 'united-states' || countrySlug === 'usa') {
          url = `/geojson/usa-states.geojson`;
        }

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load ${url}`);
        }
        
        const geo = await res.json() as GeoJSON.FeatureCollection<Geometry>;
        if (cancelled) return;

        if (geo && geo.features) {
          const mapped: StateFeature[] = geo.features.map((f, i) => ({
            ...f,
            id: String(f.id || f.properties?.NAME_1 || f.properties?.NAME || f.properties?.name || f.properties?.st_nm || f.properties?.statename || `state-${i}`),
            properties: {
              name: f.properties?.NAME_1 || f.properties?.NAME || f.properties?.name || f.properties?.st_nm || f.properties?.statename || "Unknown State",
              ...f.properties
            }
          }));
          topologyCache.set(cacheKey, mapped);
          setStates(mapped);
        } else {
          topologyCache.set(cacheKey, null);
          setStates(null);
        }
      } catch (err) {
        console.warn("Could not load states for", countryName, err);
        topologyCache.set(cacheKey, null);
        setStates(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadStates();

    return () => {
      cancelled = true;
    };
  }, [countryAlpha3, countryName]);

  const handleMouseEnter = useCallback(
    (state: StateFeature, e: React.MouseEvent) => {
      const pos = { x: e.clientX, y: e.clientY };
      onStateHover(state, pos);
    },
    [onStateHover],
  );

  const handleMouseMove = useCallback(
    (state: StateFeature, e: React.MouseEvent) => {
      const pos = { x: e.clientX, y: e.clientY };
      onStateHover(state, pos);
    },
    [onStateHover],
  );

  const handleMouseLeave = useCallback(() => {
    onStateHover(null, null);
  }, [onStateHover]);

  const handleClick = useCallback(
    (state: StateFeature) => {
      onStateSelect(state);
    },
    [onStateSelect],
  );

  if (isLoading) return null;
  if (!states || states.length === 0) return null; // Graceful degradation

  return (
    <g className="state-layer">
      <AnimatePresence>
        {states.map((state) => {
          const d = pathGenerator(state);
          if (!d) return null;

          const isHovered = state.id === hoveredStateId;
          const isSelected = state.id === selectedStateId;
          const isActive = isHovered || isSelected;

          const fillColor = isSelected ? SELECTED_FILL : isHovered ? HOVER_FILL : DEFAULT_FILL;
          const strokeColor = isSelected ? SELECTED_STROKE : isActive ? HOVER_STROKE : STROKE_COLOR;
          const strokeWidth = isActive ? 0.4 : 0.2;

          return (
            <motion.path
              key={state.id}
              d={d}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                outline: "none",
                cursor: "pointer",
                transition: "fill 0.2s ease, stroke 0.2s ease",
              }}
              onMouseEnter={(e: any) => handleMouseEnter(state, e)}
              onMouseMove={(e: any) => handleMouseMove(state, e)}
              onMouseLeave={handleMouseLeave}
              onClick={(e: any) => {
                e.stopPropagation();
                handleClick(state);
              }}
            />
          );
        })}
      </AnimatePresence>
    </g>
  );
}

const StateLayer = memo(StateLayerInner);
export default StateLayer;
