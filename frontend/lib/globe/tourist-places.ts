import type { CityFeature } from "./cities";

export type TouristPlaceCategory = 
  | "Historical" | "Adventure" | "Religious" | "Nature" 
  | "Wildlife" | "Beach" | "Mountain" | "Shopping" 
  | "Food" | "Nightlife" | "Luxury" | "Family" 
  | "Photography" | "Romantic" | "Hidden Gems" 
  | "UNESCO" | "Temple" | "Museum" | "Hill" 
  | "Lake" | "Waterfall" | "Fort" | "Palace" 
  | "National Park" | "Monument";

export interface TouristPlace {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  cityName: string;
  state: string;
  country: string;
  coordinates: [number, number]; // [longitude, latitude]
  
  category: TouristPlaceCategory;
  subCategory: string;
  
  shortDescription: string;
  longDescription: string;
  
  heroImage: string;
  galleryImages: string[];
  
  rating: number;
  reviewCount: number;
  
  entryFee: string;
  openingTime: string;
  closingTime: string;
  
  averageVisitDuration: string;
  bestTimeToVisit: string;
  bestSeason: string;
  recommendedVisitTime: string; // e.g. "Morning", "Evening"
  
  crowdLevel: "Low" | "Medium" | "High";
  difficulty: "Easy" | "Moderate" | "Hard" | "N/A";
  
  familyFriendly: boolean;
  wheelchairAccessible: boolean;
  parkingAvailable: boolean;
  foodAvailable: boolean;
  washroomAvailable: boolean;
  
  officialWebsite: string;
  googleMapsLink: string;
  contactNumber: string;
  
  weatherCategory: string;
  estimatedCost: string; // "$", "$$", "$$$", "Free"
  tourDuration: string;
  
  tags: string[];
  nearbyAttractions: string[];
  nearbyRestaurants: string[];
  nearbyHotels: string[];
  travelTips: string[];
  
  status: "Open" | "Closed" | "Temporarily Closed";
}

export interface TouristPlaceFilterState {
  categories: TouristPlaceCategory[];
}

// Helper to generate a random number within range
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Categories to pick from
const CATEGORIES: TouristPlaceCategory[] = [
  "Historical", "Adventure", "Religious", "Nature", "Wildlife",
  "Beach", "Mountain", "Shopping", "Food", "Nightlife",
  "Luxury", "Family", "Photography", "Romantic", "Hidden Gems",
  "UNESCO", "Temple", "Museum", "Hill", "Lake", "Waterfall",
  "Fort", "Palace", "National Park", "Monument"
];

const SEASONS = ["Spring", "Summer", "Monsoon", "Autumn", "Winter", "All Year"];
const CROWD = ["Low", "Medium", "High"] as const;
const COSTS = ["Free", "$", "$$", "$$$"];
const TIMES = ["Morning", "Afternoon", "Evening", "Anytime"];

function generateMockPlaceName(category: TouristPlaceCategory): string {
  const prefixes = ["Grand", "Ancient", "Royal", "Sacred", "Hidden", "Majestic", "Crystal", "Golden", "Emerald"];
  const suffixes: Record<string, string[]> = {
    "Historical": ["Ruins", "Quarter", "Square", "Heritage Site"],
    "Temple": ["Shrine", "Temple", "Sanctuary", "Pagoda"],
    "Beach": ["Cove", "Bay", "Shores", "Sands"],
    "Museum": ["Gallery", "Institute", "Museum", "Exhibition"],
    "Nature": ["Gardens", "Park", "Reserve", "Valley"],
    "Mountain": ["Peak", "Ridge", "Summit", "Pass"],
    "Lake": ["Waters", "Lake", "Lagoon", "Reservoir"],
    "Fort": ["Citadel", "Fortress", "Bastion", "Castle"],
    "Palace": ["Palace", "Court", "Mansion", "Estate"],
    "Shopping": ["Market", "Bazaar", "Plaza", "Avenue"]
  };

  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const cats = suffixes[category as keyof typeof suffixes] || ["Spot", "Point", "Attraction", "Center"];
  const s = cats[Math.floor(Math.random() * cats.length)];
  return `${p} ${s}`;
}

export function generateTouristPlacesForCity(city: CityFeature, count: number = 30): TouristPlace[] {
  const places: TouristPlace[] = [];
  const [cityLng, cityLat] = city.coordinates;
  
  // Radius roughly 0.1 to 0.3 degrees for places around a city (10-30km)
  const maxRadius = 0.2;

  for (let i = 0; i < count; i++) {
    // Generate coordinate within circle
    const r = maxRadius * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const lng = cityLng + r * Math.cos(theta);
    const lat = cityLat + r * Math.sin(theta);
    
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const name = generateMockPlaceName(category) + ` of ${city.name}`;
    const id = `place-${city.id}-${i}`;
    
    places.push({
      id,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      cityId: city.id,
      cityName: city.name,
      state: city.stateId,
      country: city.countryId,
      coordinates: [lng, lat],
      
      category,
      subCategory: "Popular Destination",
      
      shortDescription: `A stunning ${category.toLowerCase()} attraction in the heart of ${city.name}, perfect for explorers.`,
      longDescription: `Experience the breathtaking beauty and deep history of ${name}. Visitors from all over the world come to ${city.name} specifically to witness this remarkable ${category.toLowerCase()}. It offers incredible views, rich cultural significance, and an unforgettable journey. Whether you are traveling solo or with family, this destination promises memories that will last a lifetime.`,
      
      heroImage: `https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=80&w=1200&h=800`,
      galleryImages: [
        `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800&h=600`,
        `https://images.unsplash.com/photo-1504150558240-0b4fd8946624?auto=format&fit=crop&q=80&w=800&h=600`,
        `https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=800&h=600`
      ],
      
      rating: Number(randomInRange(3.5, 5.0).toFixed(1)),
      reviewCount: Math.floor(randomInRange(50, 5000)),
      
      entryFee: COSTS[Math.floor(Math.random() * COSTS.length)],
      openingTime: "09:00 AM",
      closingTime: "06:00 PM",
      
      averageVisitDuration: `${Math.floor(randomInRange(1, 4))} hours`,
      bestTimeToVisit: TIMES[Math.floor(Math.random() * TIMES.length)],
      bestSeason: SEASONS[Math.floor(Math.random() * SEASONS.length)],
      recommendedVisitTime: "Morning",
      
      crowdLevel: CROWD[Math.floor(Math.random() * CROWD.length)],
      difficulty: "Easy",
      
      familyFriendly: Math.random() > 0.2,
      wheelchairAccessible: Math.random() > 0.4,
      parkingAvailable: Math.random() > 0.3,
      foodAvailable: Math.random() > 0.1,
      washroomAvailable: true,
      
      officialWebsite: `https://example.com/places/${id}`,
      googleMapsLink: `https://maps.google.com/?q=${lat},${lng}`,
      contactNumber: "+1 234 567 8900",
      
      weatherCategory: "Pleasant",
      estimatedCost: COSTS[Math.floor(Math.random() * COSTS.length)],
      tourDuration: "Half Day",
      
      tags: [category, "Must Visit", "Photography"],
      nearbyAttractions: ["Local Market", "City Square"],
      nearbyRestaurants: ["Cafe Central", "Bistro 42"],
      nearbyHotels: ["Grand Plaza", "City Inn"],
      travelTips: ["Wear comfortable shoes", "Carry water", "Book in advance during peak season"],
      
      status: "Open"
    });
  }
  return places;
}

export function filterTouristPlaces(places: TouristPlace[], filters: TouristPlaceFilterState): TouristPlace[] {
  return places.filter((p) => {
    if (filters.categories.length > 0 && !filters.categories.includes(p.category)) {
      return false;
    }
    return true;
  });
}
