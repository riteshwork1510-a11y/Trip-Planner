"use client";

import { memo, useCallback } from "react";
import type { Geometry } from "geojson";
import type { GeoPath } from "d3-geo";
import { resolveCountry } from "@/hooks/useWorldMap";
import type { CountryFeature } from "@/types/country";

interface CountryGeo {
  id: string;
  feature: GeoJSON.Feature<Geometry>;
}

interface CountryLayerProps {
  countries: CountryGeo[];
  pathGenerator: GeoPath;
  hoveredId: string | null;
  selectedId: string | null;
  onCountryHover: (
    country: CountryFeature | null,
    pos: { x: number; y: number } | null,
  ) => void;
  onCountrySelect: (country: CountryFeature | null) => void;
  hiddenCountryId?: string | null;
}

const DEFAULT_FILL = "#1a2332";
const HOVER_FILL = "#263548";
const SELECTED_FILL = "#E85D04";
const STROKE_COLOR = "rgba(255,255,255,0.08)";
const HOVER_STROKE = "rgba(255,255,255,0.25)";

function CountryLayerInner({
  countries,
  pathGenerator,
  hoveredId,
  selectedId,
  onCountryHover,
  onCountrySelect,
  hiddenCountryId,
}: CountryLayerProps) {
  const handleMouseEnter = useCallback(
    (country: CountryFeature, e: React.MouseEvent) => {
      const pos = { x: e.clientX, y: e.clientY };
      onCountryHover(country, pos);
    },
    [onCountryHover],
  );

  const handleMouseMove = useCallback(
    (country: CountryFeature, e: React.MouseEvent) => {
      const pos = { x: e.clientX, y: e.clientY };
      onCountryHover(country, pos);
    },
    [onCountryHover],
  );

  const handleMouseLeave = useCallback(() => {
    onCountryHover(null, null);
  }, [onCountryHover]);

  const handleClick = useCallback(
    (country: CountryFeature) => {
      onCountrySelect(country);
    },
    [onCountrySelect],
  );

  return (
    <g>
      {countries.map(({ id, feature }) => {
        if (id === hiddenCountryId) return null;

        const country = resolveCountry(id);
        if (!country) return null;

        const d = pathGenerator(feature);
        if (!d) return null;

        const isHovered = id === hoveredId;
        const isSelected = id === selectedId;
        const isActive = isHovered || isSelected;

        const fillColor = isSelected
          ? SELECTED_FILL
          : isHovered
            ? HOVER_FILL
            : DEFAULT_FILL;

        const strokeColor = isActive ? HOVER_STROKE : STROKE_COLOR;
        const strokeWidth = isActive ? 0.8 : 0.4;

        return (
          <path
            key={id}
            d={d}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            tabIndex={0}
            role="button"
            aria-label={country.name}
            style={{
              outline: "none",
              transition: "fill 0.2s ease, stroke 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => handleMouseEnter(country, e)}
            onMouseMove={(e) => handleMouseMove(country, e)}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(country);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick(country);
              } else if (e.key === "Escape") {
                e.preventDefault();
                onCountrySelect(null);
              } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                const next = (e.currentTarget.nextElementSibling ||
                  e.currentTarget.parentElement?.firstElementChild) as HTMLElement;
                if (next) next.focus();
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                const prev = (e.currentTarget.previousElementSibling ||
                  e.currentTarget.parentElement?.lastElementChild) as HTMLElement;
                if (prev) prev.focus();
              }
            }}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
              onCountryHover(country, pos);
            }}
            onBlur={() => {
              onCountryHover(null, null);
            }}
          />
        );
      })}
    </g>
  );
}

const CountryLayer = memo(CountryLayerInner);
export default CountryLayer;
