export interface CountryFeature {
  id: string;
  name: string;
  region: string;
  polygons: number[][][];
  feature?: any;
}

export interface MapTooltipData {
  country: CountryFeature | null;
  position: { x: number; y: number } | null;
}

export interface WorldMapCallbacks {
  onCountryHover: (
    country: CountryFeature | null,
    screenPos: { x: number; y: number } | null,
  ) => void;
  onCountrySelect: (country: CountryFeature | null) => void;
  hoveredId: string | null;
  selectedId: string | null;
}

export interface CountryMeta {
  alpha2: string;
  capital: string;
  subdivisions: { label: string; count: string }[];
  cities: string;
  summary: string;
}
