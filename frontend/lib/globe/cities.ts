import type { Geometry } from "geojson";
import { geoBounds, geoContains } from "d3-geo";

export interface CityFeature {
  id: string;
  name: string;
  stateId: string;
  countryId: string;
  coordinates: [number, number]; // [lng, lat]
  population: number;
  area: number;
  touristPlacesCount: number;
  airportAvailable: boolean;
  railwayAvailable: boolean;
  travelRating: number;
  bestSeason: "Summer" | "Winter" | "Monsoon" | "Spring" | "All Year";
  weatherCategory: "Tropical" | "Arid" | "Temperate" | "Continental" | "Polar" | "Mild";
  categories: string[];
}

export interface CityFilterState {
  minPopulation?: number;
  minRating?: number;
  season?: string;
  airport?: boolean;
  railway?: boolean;
  categories: string[]; // required categories
}

// Random mock names for generation
const PREFIXES = ["San ", "New ", "Port ", "Lake ", "Mount ", "Fort ", "North ", "South ", "East ", "West ", ""];
const ROOTS = ["wood", "bridge", "stone", "water", "ville", "town", "burg", "ton", "field", "land", "mont", "ford", "port"];
const SUFFIXES = [" City", " Springs", " Valley", " Point", " Beach", " Park", " Heights", " Station", ""];

function generateCityName(): string {
  const pre = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const root = ROOTS[Math.floor(Math.random() * ROOTS.length)];
  const suf = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const name = pre + root.charAt(0).toUpperCase() + root.slice(1) + suf;
  return name.trim();
}

const CATEGORIES = ["Beach", "Hill Station", "Religious", "Historical", "Wildlife", "Adventure", "Family", "Luxury", "Budget"];
const SEASONS = ["Summer", "Winter", "Monsoon", "Spring", "All Year"] as const;
const WEATHERS = ["Tropical", "Arid", "Temperate", "Continental", "Polar", "Mild"] as const;

export function generateMockCitiesForState(stateFeature: GeoJSON.Feature<Geometry>, countryId: string, count: number = 30): CityFeature[] {
  const bounds = geoBounds(stateFeature);
  const minLng = bounds[0][0];
  const minLat = bounds[0][1];
  const maxLng = bounds[1][0];
  const maxLat = bounds[1][1];
  
  const stateId = String(stateFeature.id || (stateFeature.properties as any)?.name || "Unknown");

  const cities: CityFeature[] = [];
  let attempts = 0;
  
  while (cities.length < count && attempts < count * 100) {
    attempts++;
    const lng = minLng + Math.random() * (maxLng - minLng);
    const lat = minLat + Math.random() * (maxLat - minLat);
    
    // Ensure point is actually inside the complex polygon, not just the bounding box
    if (geoContains(stateFeature, [lng, lat])) {
      
      const numCats = 1 + Math.floor(Math.random() * 3);
      const shuffledCats = [...CATEGORIES].sort(() => 0.5 - Math.random());
      
      cities.push({
        id: `city-${stateId}-${cities.length}`,
        name: generateCityName(),
        stateId,
        countryId,
        coordinates: [lng, lat],
        population: 50000 + Math.floor(Math.random() * 5000000),
        area: 10 + Math.floor(Math.random() * 900),
        touristPlacesCount: Math.floor(Math.random() * 50),
        airportAvailable: Math.random() > 0.7,
        railwayAvailable: Math.random() > 0.3,
        travelRating: 3 + (Math.random() * 2), // 3.0 to 5.0
        bestSeason: SEASONS[Math.floor(Math.random() * SEASONS.length)],
        weatherCategory: WEATHERS[Math.floor(Math.random() * WEATHERS.length)],
        categories: shuffledCats.slice(0, numCats)
      });
    }
  }

  // If geoContains fails too much (e.g. invalid polygon or crossing antimeridian), 
  // fallback to just using bounding box
  while (cities.length < count) {
    const lng = minLng + Math.random() * (maxLng - minLng);
    const lat = minLat + Math.random() * (maxLat - minLat);
    const numCats = 1 + Math.floor(Math.random() * 3);
    cities.push({
      id: `city-${stateId}-${cities.length}`,
      name: generateCityName(),
      stateId,
      countryId,
      coordinates: [lng, lat],
      population: 50000 + Math.floor(Math.random() * 5000000),
      area: 10 + Math.floor(Math.random() * 900),
      touristPlacesCount: Math.floor(Math.random() * 50),
      airportAvailable: Math.random() > 0.7,
      railwayAvailable: Math.random() > 0.3,
      travelRating: 3 + (Math.random() * 2),
      bestSeason: SEASONS[Math.floor(Math.random() * SEASONS.length)],
      weatherCategory: WEATHERS[Math.floor(Math.random() * WEATHERS.length)],
      categories: [...CATEGORIES].sort(() => 0.5 - Math.random()).slice(0, numCats)
    });
  }

  return cities;
}

export function filterCities(cities: CityFeature[], filters: CityFilterState): CityFeature[] {
  return cities.filter(city => {
    if (filters.minPopulation && city.population < filters.minPopulation) return false;
    if (filters.minRating && city.travelRating < filters.minRating) return false;
    if (filters.season && city.bestSeason !== filters.season) return false;
    if (filters.airport && !city.airportAvailable) return false;
    if (filters.railway && !city.railwayAvailable) return false;
    
    if (filters.categories && filters.categories.length > 0) {
      const hasAllCats = filters.categories.every(c => city.categories.includes(c));
      if (!hasAllCats) return false;
    }
    
    return true;
  });
}
