"use client";

import { memo } from "react";
import type { Geometry } from "geojson";
import type { GeoPath } from "d3-geo";
import { resolveCountry } from "@/hooks/useWorldMap";

interface CountryGeo {
  id: string;
  feature: GeoJSON.Feature<Geometry>;
}

interface CountryLabelsProps {
  countries: CountryGeo[];
  pathGenerator: GeoPath;
  zoomScale: number;
}

function CountryLabelsInner({
  countries,
  pathGenerator,
  zoomScale,
}: CountryLabelsProps) {
  // Only show labels when reasonably zoomed in (e.g. scale > 2)
  if (zoomScale < 2.5) return null;

  return (
    <g style={{ pointerEvents: "none" }}>
      {countries.map(({ id, feature }) => {
        const country = resolveCountry(id);
        if (!country) return null;

        // Try to get a sensible center point
        let centroid: [number, number];
        try {
          centroid = pathGenerator.centroid(feature as any);
          if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) return null;
        } catch {
          return null;
        }

        // Calculate rough area to hide small country labels
        const area = pathGenerator.area(feature as any);
        // At zoomScale 3, we want to show labels for countries with area > 100
        const isLargeEnough = area * zoomScale * zoomScale > 800;
        if (!isLargeEnough) return null;

        // To prevent text from becoming gigantic, we scale it inversely,
        // but the prompt says "Labels should scale with zoom", 
        // so we just provide a baseline size. We can bound it slightly.
        const fontSize = Math.max(3, 12 / zoomScale);

        return (
          <text
            key={id}
            x={centroid[0]}
            y={centroid[1]}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="rgba(255, 255, 255, 0.7)"
            fontSize={fontSize}
            fontWeight={600}
            style={{
              textShadow: "0px 1px 4px rgba(0,0,0,0.8)",
              transition: "opacity 0.3s ease",
            }}
          >
            {country.name}
          </text>
        );
      })}
    </g>
  );
}

const CountryLabels = memo(CountryLabelsInner);
export default CountryLabels;
