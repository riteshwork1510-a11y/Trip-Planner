"use client";

import { memo, useEffect, useState, useMemo, useRef, useCallback } from "react";
import Supercluster from "supercluster";
import { motion, AnimatePresence } from "framer-motion";
import type { GeoProjection } from "d3-geo";
import type { CityFeature } from "@/lib/globe/cities";
import { generateTouristPlacesForCity, filterTouristPlaces, type TouristPlace, type TouristPlaceFilterState } from "@/lib/globe/tourist-places";

interface TouristPlaceLayerProps {
  cityFeature: CityFeature;
  projection: GeoProjection;
  zoomScale: number;
  dimensions: { width: number; height: number };
  hoveredPlaceId: string | null;
  selectedPlaceId: string | null;
  filters: TouristPlaceFilterState;
  onPlaceHover: (place: TouristPlace | null, pos: { x: number; y: number } | null) => void;
  onPlaceSelect: (place: TouristPlace | null) => void;
}

// Caching generated places per city
const placesCache = new Map<string, TouristPlace[]>();

function getCategoryColor(category: string) {
  switch (category) {
    case "Historical":
    case "Fort":
    case "Palace":
    case "Monument":
    case "UNESCO":
      return "#E9C46A"; // Gold/Historical
    case "Nature":
    case "National Park":
    case "Wildlife":
    case "Mountain":
    case "Hill":
      return "#2A9D8F"; // Green/Nature
    case "Lake":
    case "Waterfall":
    case "Beach":
      return "#457B9D"; // Blue/Water
    case "Adventure":
      return "#E76F51"; // Orange/Action
    case "Religious":
    case "Temple":
      return "#F4A261"; // Saffron/Religious
    case "Shopping":
    case "Food":
    case "Nightlife":
    case "Luxury":
      return "#9D4EDD"; // Purple/Commercial
    case "Museum":
    case "Photography":
    case "Hidden Gems":
    default:
      return "#E85D04"; // Default brand orange
  }
}

function TouristPlaceLayerInner({
  cityFeature,
  projection,
  zoomScale,
  dimensions,
  hoveredPlaceId,
  selectedPlaceId,
  filters,
  onPlaceHover,
  onPlaceSelect
}: TouristPlaceLayerProps) {
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const clusterer = useRef(new Supercluster({ radius: 30, maxZoom: 30 }));

  // Generate or load places for this city
  useEffect(() => {
    const cityId = cityFeature.id;
    const cacheKey = `places-${cityId}`;
    
    if (placesCache.has(cacheKey)) {
      setPlaces(placesCache.get(cacheKey)!);
    } else {
      const timer = setTimeout(() => {
        const newPlaces = generateTouristPlacesForCity(cityFeature, 45); // Generate 45 places per city
        placesCache.set(cacheKey, newPlaces);
        setPlaces(newPlaces);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [cityFeature]);

  // Apply filters and load into supercluster
  useEffect(() => {
    if (places.length === 0) return;
    
    const filtered = filterTouristPlaces(places, filters);
    
    const geojsonFeatures = filtered.map(place => ({
      type: "Feature" as const,
      properties: {
        cluster: false,
        placeId: place.id,
        placeData: place
      },
      geometry: {
        type: "Point" as const,
        coordinates: place.coordinates
      }
    }));
    
    clusterer.current.load(geojsonFeatures as any);
    
    setClusters([...clusterer.current.getClusters([-180, -90, 180, 90], Math.floor(zoomScale))]);
  }, [places, filters, zoomScale]);

  // Handle zooming/panning dynamically
  useEffect(() => {
    if (places.length > 0) {
      const newClusters = clusterer.current.getClusters([-180, -90, 180, 90], Math.floor(zoomScale));
      setClusters(newClusters);
    }
  }, [zoomScale, places.length]);

  const handleMouseEnter = useCallback((place: TouristPlace, e: React.MouseEvent) => {
    onPlaceHover(place, { x: e.clientX, y: e.clientY });
  }, [onPlaceHover]);

  const handleMouseMove = useCallback((place: TouristPlace, e: React.MouseEvent) => {
    onPlaceHover(place, { x: e.clientX, y: e.clientY });
  }, [onPlaceHover]);

  const handleMouseLeave = useCallback(() => {
    onPlaceHover(null, null);
  }, [onPlaceHover]);

  return (
    <g className="tourist-place-layer" style={{ pointerEvents: "auto" }}>
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
                style={{ transformOrigin: "center" }}
              >
                <circle r={14 / Math.sqrt(zoomScale)} fill="rgba(255, 255, 255, 0.9)" />
                <circle r={11 / Math.sqrt(zoomScale)} fill="#2A9D8F" stroke="rgba(255,255,255,1)" strokeWidth={1.5 / zoomScale} />
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
            // Render Individual Tourist Place Marker
            const place = cluster.properties.placeData as TouristPlace;
            const isSelected = selectedPlaceId === place.id;
            const isHovered = hoveredPlaceId === place.id;
            
            const color = getCategoryColor(place.category);
            const baseSize = 5 / Math.sqrt(zoomScale);
            const r = isSelected || isHovered ? baseSize * 1.5 : baseSize;
            
            return (
              <motion.g
                key={place.id}
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                transform={`translate(${x}, ${y})`}
                style={{ cursor: "pointer" }}
                onMouseEnter={(e: any) => handleMouseEnter(place, e)}
                onMouseMove={(e: any) => handleMouseMove(place, e)}
                onMouseLeave={handleMouseLeave}
                onClick={(e: any) => {
                  e.stopPropagation();
                  onPlaceSelect(place);
                }}
              >
                {/* Pin shape */}
                <path
                  d={`M0,0 C${r},0 ${r * 1.5},-${r * 1.5} 0,-${r * 3} C-${r * 1.5},-${r * 1.5} -${r},0 0,0 Z`}
                  fill={isSelected || isHovered ? "white" : color}
                  stroke={isSelected || isHovered ? color : "white"}
                  strokeWidth={0.8 / zoomScale}
                  transform={`translate(0, ${r * 1.5})`}
                  style={{ filter: isSelected ? "drop-shadow(0px 0px 4px rgba(0,0,0,0.5))" : "none" }}
                />
                
                {/* Inner dot */}
                <circle
                  cx={0}
                  cy={-r * 0.8}
                  r={r * 0.4}
                  fill={isSelected || isHovered ? color : "white"}
                />
              </motion.g>
            );
          }
        })}
      </AnimatePresence>
    </g>
  );
}

const TouristPlaceLayer = memo(TouristPlaceLayerInner);
export default TouristPlaceLayer;
