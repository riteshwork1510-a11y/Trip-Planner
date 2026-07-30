"use client";

import { memo, useEffect, useState, useMemo, useRef, useCallback } from "react";
import Supercluster from "supercluster";
import { motion, AnimatePresence } from "framer-motion";
import type { GeoProjection } from "d3-geo";
import type { Geometry } from "geojson";
import { generateMockCitiesForState, filterCities, type CityFeature, type CityFilterState } from "@/lib/globe/cities";

interface CityLayerProps {
  stateFeature: GeoJSON.Feature<Geometry>;
  countryId: string;
  projection: GeoProjection;
  zoomScale: number;
  dimensions: { width: number; height: number };
  hoveredCityId: string | null;
  selectedCityId: string | null;
  filters: CityFilterState;
  onCityHover: (city: CityFeature | null, pos: { x: number; y: number } | null) => void;
  onCitySelect: (city: CityFeature | null) => void;
}

// Caching generated cities per state
const citiesCache = new Map<string, CityFeature[]>();

function CityLayerInner({
  stateFeature,
  countryId,
  projection,
  zoomScale,
  dimensions,
  hoveredCityId,
  selectedCityId,
  filters,
  onCityHover,
  onCitySelect
}: CityLayerProps) {
  const [cities, setCities] = useState<CityFeature[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const clusterer = useRef(new Supercluster({ radius: 40, maxZoom: 20 }));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate or load cities for this state
  useEffect(() => {
    let cancelled = false;
    const stateName = String(stateFeature.properties?.name || stateFeature.id);
    const stateId = stateName.toLowerCase().replace(/\s+/g, '-');
    const cacheKey = `cities-${countryId}-${stateId}`;
    
    if (citiesCache.has(cacheKey)) {
      setCities(citiesCache.get(cacheKey)!);
      setError(null);
      return;
    }

    async function loadCities() {
      setIsLoading(true);
      setError(null);
      
      // We resolve country name since countryId might be a numeric ISO code
      let countrySlug = countryId.toLowerCase().replace(/\s+/g, '-');
      if (countryId === "356") countrySlug = "india";
      else if (countryId === "840") countrySlug = "united-states";
      else if (countryId === "124") countrySlug = "canada";
      else if (countryId === "036") countrySlug = "australia";

      try {
        const url = `/data/cities/${countrySlug}/${stateId}.json`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`No city data available for ${stateName}`);
        }
        
        const data = await res.json() as CityFeature[];
        if (cancelled) return;

        if (data && data.length > 0) {
          citiesCache.set(cacheKey, data);
          setCities(data);
        } else {
          throw new Error("No city data available.");
        }
      } catch (err: any) {
        if (!cancelled) {
          console.warn(err.message);
          setCities([]);
          setError("No city data available.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    // Small timeout to allow state layer animation to finish first
    const timer = setTimeout(() => {
      loadCities();
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [stateFeature, countryId]);

  // Apply filters and load into supercluster
  useEffect(() => {
    if (cities.length === 0) return;
    
    const filtered = filterCities(cities, filters);
    
    const geojsonFeatures = filtered.map(city => ({
      type: "Feature" as const,
      properties: {
        cluster: false,
        cityId: city.id,
        cityData: city
      },
      geometry: {
        type: "Point" as const,
        coordinates: city.coordinates
      }
    }));
    
    clusterer.current.load(geojsonFeatures as any);
    
    // Trigger re-render of clusters
    setClusters([...clusterer.current.getClusters([-180, -90, 180, 90], Math.floor(zoomScale))]);
  }, [cities, filters, zoomScale]);

  // Handle zooming/panning to update clusters dynamically
  useEffect(() => {
    if (cities.length > 0) {
      // In a real app we'd calculate exact bounding box based on map inverse projection
      // For now we just cluster over the whole world at current zoom
      const newClusters = clusterer.current.getClusters([-180, -90, 180, 90], Math.floor(zoomScale));
      setClusters(newClusters);
    }
  }, [zoomScale, cities.length]);


  const handleMouseEnter = useCallback((city: CityFeature, e: React.MouseEvent) => {
    onCityHover(city, { x: e.clientX, y: e.clientY });
  }, [onCityHover]);

  const handleMouseMove = useCallback((city: CityFeature, e: React.MouseEvent) => {
    onCityHover(city, { x: e.clientX, y: e.clientY });
  }, [onCityHover]);

  const handleMouseLeave = useCallback(() => {
    onCityHover(null, null);
  }, [onCityHover]);

  if (error) {
    let textX = dimensions.width / 2;
    let textY = dimensions.height / 2;
    // @ts-ignore
    if (typeof window !== 'undefined' && window.d3 && window.d3.geoCentroid) {
       // fallback if d3 is available globally, otherwise we can just use the middle of bounds
    } else {
       // Since we have projection we can try to find center of bounds
       const d3Geo = require('d3-geo');
       const centroid = d3Geo.geoCentroid(stateFeature);
       const pos = projection(centroid);
       if (pos) {
         textX = pos[0];
         textY = pos[1];
       }
    }

    return (
      <g className="city-layer-error" style={{ pointerEvents: "none" }}>
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize={16 / Math.max(1, Math.sqrt(zoomScale))}
        >
          {error}
        </text>
      </g>
    );
  }

  return (
    <g className="city-layer" style={{ pointerEvents: "auto" }}>
      <AnimatePresence>
        {clusters.map((cluster) => {
          const [lng, lat] = cluster.geometry.coordinates;
          const pos = projection([lng, lat]);
          if (!pos) return null;
          const [x, y] = pos;
          
          const isCluster = cluster.properties.cluster;

          if (isCluster) {
            // Render Cluster Marker
            return (
              <motion.g
                key={`cluster-${cluster.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                transform={`translate(${x}, ${y})`}
                // Since supercluster scales we need to reverse scale the visuals to keep them same size
                style={{ transformOrigin: "center" }}
              >
                <circle r={12 / Math.sqrt(zoomScale)} fill="rgba(232, 93, 4, 0.4)" />
                <circle r={8 / Math.sqrt(zoomScale)} fill="#E85D04" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5 / zoomScale} />
                <text
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize={8 / Math.sqrt(zoomScale)}
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  {cluster.properties.point_count}
                </text>
              </motion.g>
            );
          } else {
            // Render Individual City Marker
            const city = cluster.properties.cityData as CityFeature;
            const isSelected = selectedCityId === city.id;
            const isHovered = hoveredCityId === city.id;
            
            // Adjust marker size based on zoom so it doesn't get huge
            const baseSize = 4 / Math.sqrt(zoomScale);
            const r = isSelected || isHovered ? baseSize * 1.5 : baseSize;
            
            return (
              <motion.g
                key={city.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                transform={`translate(${x}, ${y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e: any) => handleMouseEnter(city, e)}
                onMouseMove={(e: any) => handleMouseMove(city, e)}
                onMouseLeave={handleMouseLeave}
                onClick={(e: any) => {
                  e.stopPropagation();
                  onCitySelect(city);
                }}
              >
                {/* Glow effect when active */}
                {(isSelected || isHovered) && (
                  <circle r={r * 2.5} fill="rgba(232, 93, 4, 0.3)" filter="blur(2px)" />
                )}
                
                <circle
                  r={r}
                  fill={isSelected ? "#E85D04" : "#ffffff"}
                  stroke={isSelected ? "rgba(255,255,255,0.9)" : "rgba(232, 93, 4, 0.8)"}
                  strokeWidth={1 / zoomScale}
                  style={{ transition: "all 0.2s ease" }}
                />
              </motion.g>
            );
          }
        })}
      </AnimatePresence>
    </g>
  );
}

const CityLayer = memo(CityLayerInner);
export default CityLayer;
