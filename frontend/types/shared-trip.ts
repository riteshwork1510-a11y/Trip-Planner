// ══════════════════════════════════════════════════════════════════════════════
// SHARED TRIP SCHEMA — Single Source of Truth
// Used by: Planner → Puter.js → FastAPI → MongoDB → My Trips → Trip Details
// ══════════════════════════════════════════════════════════════════════════════

export interface SharedDestinationOverview {
  destination: string;
  bestTime: string;
  currentWeather: string;
  temperature: string;
  currency: string;
  language: string;
  famousFor: string;
  mapCoordinates: string;
}

export interface SharedTripHighlights {
  top10Attractions: string[];
  hiddenGems: string[];
  unescoSites: string[];
  localFestivals: string[];
  famousFood: string[];
  bestSunset: string[];
  bestSunrise: string[];
  shopping: string[];
  adventure: string[];
  photographySpots: string[];
}

export interface SharedRouteOptimization {
  summary: string;
  totalDistance: string;
  totalTravelTime: string;
  fuelEstimate: string;
  avoidBacktrackingStrategy: string;
}

export interface SharedActivity {
  placeName?: string;
  address?: string;
  distance?: string;
  travelTime?: string;
  rating?: string;
  openingHours?: string;
  entryFee?: string;
  bestTime?: string;
  expectedDuration?: string;
  coordinates?: string;
  category?: string;
  description?: string;
  id?: string;
  time?: string;
  title?: string;
  location?: string;
  cost?: number;
  duration?: string;
  tips?: string;
}

export interface SharedDay {
  dayNumber?: number;
  day?: number;
  title: string;
  activities: SharedActivity[];
  hotel?: SharedHotelOption;
  restaurants?: SharedRestaurantOption[];
  transport?: SharedTransportation;
  travelTime?: string;
  notes?: string;
}

export interface SharedNearbyAttractions {
  primaryAttraction: string;
  within2km: string[];
  within5km: string[];
  within10km: string[];
  within20km: string[];
}

export interface SharedHotelOption {
  name: string;
  rating: string;
  price: string;
  distanceFromAttraction: string;
  bookingLink: string;
}

export interface SharedHotels {
  budget: SharedHotelOption[];
  standard: SharedHotelOption[];
  premium: SharedHotelOption[];
  luxury: SharedHotelOption[];
}

export interface SharedRestaurantOption {
  name: string;
  rating: string;
  cuisine: string;
  price: string;
  distance: string;
}

export interface SharedRestaurants {
  breakfast: SharedRestaurantOption[];
  lunch: SharedRestaurantOption[];
  dinner: SharedRestaurantOption[];
  snack: SharedRestaurantOption[];
}

export interface SharedTransportation {
  taxi: string;
  auto: string;
  metro: string;
  bus: string;
  rentalBike: string;
  rentalCar: string;
  walkingRoute: string;
}

export interface SharedCostBreakdown {
  hotel: string;
  food: string;
  fuel: string;
  transport: string;
  tickets: string;
  shopping: string;
  misc: string;
  grandTotal: string;
}

export interface SharedPackingChecklist {
  clothing: string[];
  electronics: string[];
  documents: string[];
  health: string[];
  weatherItems: string[];
  photography: string[];
  localEssentials: string[];
}

export interface SharedWeatherForecast {
  dayNumber: number;
  temperature: string;
  rainChance: string;
  humidity: string;
  sunrise: string;
  sunset: string;
}

export interface SharedEmergencyInformation {
  hospital: string;
  police: string;
  atm: string;
  fuelStation: string;
  pharmacy: string;
}

export interface SharedLocalTips {
  dressCode: string[];
  templeRules: string[];
  scamAlerts: string[];
  photographyRules: string[];
  localLanguage: string[];
  safetyTips: string[];
}


// ══════════════════════════════════════════════════════════════════════════════
// NormalizedTrip — THE canonical trip shape consumed by every layer
// ══════════════════════════════════════════════════════════════════════════════

export interface NormalizedTrip {
  tripId: string;
  generationId: string;
  destination: string; // From overview
  
  destinationOverview?: SharedDestinationOverview;
  tripHighlights?: SharedTripHighlights;
  routeOptimization?: SharedRouteOptimization;
  dailyItinerary: SharedDay[];
  nearbyAttractions?: SharedNearbyAttractions[];
  hotels?: SharedHotels;
  restaurants?: SharedRestaurants;
  transportation?: SharedTransportation;
  costBreakdown?: SharedCostBreakdown;
  packingChecklist?: SharedPackingChecklist;
  weatherForecast?: SharedWeatherForecast[];
  emergencyInformation?: SharedEmergencyInformation;
  localTips?: SharedLocalTips;

  // Compatibility & metadata properties
  travelStyle?: string;
  travelDates?: { start: string; end: string };
  duration?: { days: number; nights: number };
  budget?: { perPerson: number; total: number; currency: string; label?: string };
  travellers?: { total: number; adults: number; children: number };
  summary?: string;
  weather?: { bestSeason?: string; temperature?: string; rainfall?: string; advice?: string };
  hotelsList?: any[];
  restaurantsList?: any[];
  packingList?: any;

  createdAt: string;
  updatedAt: string;
  status: "upcoming" | "completed" | "cancelled" | "draft";
  _id?: string;
  user_id?: string;
  cover_image?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
// Helper: string extractor for AI objects
// ══════════════════════════════════════════════════════════════════════════════

export function extractString(value: any, fallback: string = ""): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const keys = ["name", "title", "label", "city", "mode", "category", "description", "time"];
    for (const k of keys) {
      if (value[k] && typeof value[k] === "string") {
        return value[k];
      }
    }
    if (Array.isArray(value)) {
      return value.map(v => extractString(v)).join(", ");
    }
  }
  return fallback;
}

// ══════════════════════════════════════════════════════════════════════════════
// Backward-compat normalizer: legacy → NormalizedTrip
// ══════════════════════════════════════════════════════════════════════════════

export function normalizeLegacyTrip(raw: any): NormalizedTrip {
  const now = new Date().toISOString();

  // If it's already the new shape, just return it
  if (raw && raw.destinationOverview && raw.dailyItinerary && raw.dailyItinerary.length > 0 && raw.dailyItinerary[0]?.activities !== undefined) {
    return {
      tripId: raw.tripId || raw.id || raw._id || `trip-${Date.now()}`,
      generationId: raw.generationId || "",
      destination: raw.destinationOverview?.destination || raw.destination || "Unknown",
      destinationOverview: raw.destinationOverview || { destination: "Unknown", bestTime: "", currentWeather: "", temperature: "", currency: "", language: "", famousFor: "", mapCoordinates: "" },
      tripHighlights: raw.tripHighlights || { top10Attractions: [], hiddenGems: [], unescoSites: [], localFestivals: [], famousFood: [], bestSunset: [], bestSunrise: [], shopping: [], adventure: [], photographySpots: [] },
      routeOptimization: raw.routeOptimization || { summary: "", totalDistance: "", totalTravelTime: "", fuelEstimate: "", avoidBacktrackingStrategy: "" },
      dailyItinerary: raw.dailyItinerary || [],
      nearbyAttractions: raw.nearbyAttractions || [],
      hotels: raw.hotels || { budget: [], standard: [], premium: [], luxury: [] },
      restaurants: raw.restaurants || { breakfast: [], lunch: [], dinner: [], snack: [] },
      transportation: raw.transportation || { taxi: "", auto: "", metro: "", bus: "", rentalBike: "", rentalCar: "", walkingRoute: "" },
      costBreakdown: raw.costBreakdown || { hotel: "", food: "", fuel: "", transport: "", tickets: "", shopping: "", misc: "", grandTotal: "" },
      packingChecklist: raw.packingChecklist || { clothing: [], electronics: [], documents: [], health: [], weatherItems: [], photography: [], localEssentials: [] },
      weatherForecast: raw.weatherForecast || [],
      emergencyInformation: raw.emergencyInformation || { hospital: "", police: "", atm: "", fuelStation: "", pharmacy: "" },
      localTips: raw.localTips || { dressCode: [], templeRules: [], scamAlerts: [], photographyRules: [], localLanguage: [], safetyTips: [] },
      createdAt: raw.createdAt || raw.created_at || now,
      updatedAt: raw.updatedAt || raw.updated_at || now,
      status: raw.status || "upcoming",
      _id: raw._id,
      user_id: raw.user_id,
      cover_image: raw.cover_image,
    };
  }

  // Fallback default
  return {
    tripId: raw?.tripId || `trip-${Date.now()}`,
    generationId: raw?.generationId || "",
    destination: raw?.destination || "Unknown",
    destinationOverview: { destination: raw?.destination || "Unknown", bestTime: "", currentWeather: "", temperature: "", currency: "", language: "", famousFor: "", mapCoordinates: "" },
    tripHighlights: { top10Attractions: [], hiddenGems: [], unescoSites: [], localFestivals: [], famousFood: [], bestSunset: [], bestSunrise: [], shopping: [], adventure: [], photographySpots: [] },
    routeOptimization: { summary: "", totalDistance: "", totalTravelTime: "", fuelEstimate: "", avoidBacktrackingStrategy: "" },
    dailyItinerary: [],
    nearbyAttractions: [],
    hotels: { budget: [], standard: [], premium: [], luxury: [] },
    restaurants: { breakfast: [], lunch: [], dinner: [], snack: [] },
    transportation: { taxi: "", auto: "", metro: "", bus: "", rentalBike: "", rentalCar: "", walkingRoute: "" },
    costBreakdown: { hotel: "", food: "", fuel: "", transport: "", tickets: "", shopping: "", misc: "", grandTotal: "" },
    packingChecklist: { clothing: [], electronics: [], documents: [], health: [], weatherItems: [], photography: [], localEssentials: [] },
    weatherForecast: [],
    emergencyInformation: { hospital: "", police: "", atm: "", fuelStation: "", pharmacy: "" },
    localTips: { dressCode: [], templeRules: [], scamAlerts: [], photographyRules: [], localLanguage: [], safetyTips: [] },
    createdAt: now,
    updatedAt: now,
    status: "upcoming",
  };
}

export function normalizeFromAlternateAI(data: Record<string, any>, params?: any): NormalizedTrip {
    return normalizeLegacyTrip(data);
}

export function createEmptyTrip(
  destination: string,
  days: number,
  nights: number,
  total: number,
  adults: number,
  children: number,
  perPerson: number,
  currency: string
): NormalizedTrip {
  const now = new Date().toISOString();
  
  const dailyItinerary: SharedDay[] = [];
  for (let i = 1; i <= days; i++) {
    dailyItinerary.push({
      dayNumber: i,
      title: `Day ${i}: ${destination} Exploration`,
      activities: []
    });
  }

  return {
    tripId: `trip-${Date.now()}`,
    generationId: `gen-${Date.now()}`,
    destination,
    destinationOverview: { destination, bestTime: "", currentWeather: "", temperature: "", currency, language: "", famousFor: "", mapCoordinates: "" },
    tripHighlights: { top10Attractions: [], hiddenGems: [], unescoSites: [], localFestivals: [], famousFood: [], bestSunset: [], bestSunrise: [], shopping: [], adventure: [], photographySpots: [] },
    routeOptimization: { summary: "", totalDistance: "", totalTravelTime: "", fuelEstimate: "", avoidBacktrackingStrategy: "" },
    dailyItinerary,
    nearbyAttractions: [],
    hotels: { budget: [], standard: [], premium: [], luxury: [] },
    restaurants: { breakfast: [], lunch: [], dinner: [], snack: [] },
    transportation: { taxi: "", auto: "", metro: "", bus: "", rentalBike: "", rentalCar: "", walkingRoute: "" },
    costBreakdown: { hotel: "", food: "", fuel: "", transport: "", tickets: "", shopping: "", misc: "", grandTotal: "" },
    packingChecklist: { clothing: [], electronics: [], documents: [], health: [], weatherItems: [], photography: [], localEssentials: [] },
    weatherForecast: [],
    emergencyInformation: { hospital: "", police: "", atm: "", fuelStation: "", pharmacy: "" },
    localTips: { dressCode: [], templeRules: [], scamAlerts: [], photographyRules: [], localLanguage: [], safetyTips: [] },
    createdAt: now,
    updatedAt: now,
    status: "upcoming"
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateNormalizedTrip(trip: NormalizedTrip): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!trip.tripId) errors.push("tripId is missing");
  return { valid: errors.length === 0, errors, warnings };
}

export type { NormalizedTrip as TripSchema };
