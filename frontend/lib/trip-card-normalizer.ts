import { MyTrip } from "@/types/my-trips";

const DESTINATION_CATALOG: Record<string, { destination: string; city: string; state: string; country: string; category: string; image: string }> = {
  ambaji: {
    destination: "Ambaji Temple",
    city: "Ambaji",
    state: "Gujarat",
    country: "India",
    category: "Spiritual",
    image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80",
  },
  dwarka: {
    destination: "Dwarkadhish Temple",
    city: "Dwarka",
    state: "Gujarat",
    country: "India",
    category: "Spiritual",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
  },
  pavagadh: {
    destination: "Kalika Mata Temple",
    city: "Halol",
    state: "Gujarat",
    country: "India",
    category: "Spiritual",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80",
  },
  somnath: {
    destination: "Somnath Temple",
    city: "Veraval",
    state: "Gujarat",
    country: "India",
    category: "Spiritual",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80",
  },
  manali: {
    destination: "Manali Valley",
    city: "Manali",
    state: "Himachal Pradesh",
    country: "India",
    category: "Nature & Adventure",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
  },
  goa: {
    destination: "Goa Beaches",
    city: "Panaji",
    state: "Goa",
    country: "India",
    category: "Beach & Party",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
  },
  paris: {
    destination: "Eiffel Tower & Louvre",
    city: "Paris",
    state: "Île-de-France",
    country: "France",
    category: "Culture & Romance",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  dubai: {
    destination: "Burj Khalifa & Marina",
    city: "Dubai",
    state: "Dubai",
    country: "United Arab Emirates",
    category: "Luxury & Safari",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },
  bali: {
    destination: "Ubud & Kuta",
    city: "Denpasar",
    state: "Bali",
    country: "Indonesia",
    category: "Beach & Honeymoon",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  },
  leh: {
    destination: "Pangong Lake & Khardung La",
    city: "Leh",
    state: "Ladakh",
    country: "India",
    category: "Adventure Trek",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
  },
};

const TITLE_TEMPLATES = [
  "Spiritual Journey to {dest}",
  "Sacred {dest} Expedition",
  "Historic {dest} Experience",
  "Weekend Escape to {dest}",
  "{dest} Heritage Exploration",
  "Luxury Gateway to {dest}",
  "Discover {dest}",
];

export function normalizeTripCard(rawDoc: any, idx: number = 0): MyTrip {
  const fi = rawDoc.full_itinerary || rawDoc.itinerary || rawDoc;

  // 1. Destination & Location Hierarchy
  const rawDest = rawDoc.destination || fi.destination || fi.destinationOverview?.destination || "Ambaji Temple";
  const destClean = typeof rawDest === "object" ? (rawDest.name || rawDest.city || "Ambaji Temple") : String(rawDest);

  let match = null;
  const destLower = destClean.toLowerCase();
  for (const [k, v] of Object.entries(DESTINATION_CATALOG)) {
    if (destLower.includes(k) || k.includes(destLower)) {
      match = v;
      break;
    }
  }

  const city = rawDoc.city || fi.destinationOverview?.city || (match ? match.city : destClean.split(",")[0].trim());
  const state = rawDoc.state || fi.destinationOverview?.state || (match ? match.state : "Gujarat");
  let country = rawDoc.country || fi.destinationOverview?.country || (match ? match.country : "India");
  if (country.toLowerCase() === "global" || !country) country = "India";

  // 2. Days & Nights Logic (Days MUST equal Nights + 1)
  const rawDays = rawDoc.durationDays || rawDoc.days || fi.duration?.days || 3;
  const durationDays = Math.max(1, parseInt(String(rawDays)) || 3);
  const durationNights = Math.max(0, durationDays - 1);

  // 3. Budget (NEVER zero)
  let rawBudget = rawDoc.budgetTotal || rawDoc.budget || rawDoc.total_budget || fi.budget?.total || 0;
  if (typeof rawBudget === "string") {
    rawBudget = parseFloat(rawBudget.replace(/[^0-9.]/g, "")) || 0;
  }
  let budgetTotal = Number(rawBudget) || 0;

  const rawTravelers = rawDoc.travelersCount || rawDoc.travelers_count || fi.travellers?.total || 2;
  const travelersCount = Math.max(1, parseInt(String(rawTravelers)) || 2);

  if (budgetTotal <= 0) {
    budgetTotal = Math.max(12000, durationDays * travelersCount * 3500);
  }

  const minimumBudget = Math.floor(budgetTotal * 0.85);
  const recommendedBudget = Math.floor(budgetTotal);
  const maximumBudget = Math.floor(budgetTotal * 1.20);
  const budgetFormatted = `₹${minimumBudget.toLocaleString("en-IN")}–₹${maximumBudget.toLocaleString("en-IN")}`;

  // 4. Style (Never empty)
  let travelStyle = rawDoc.travelStyle || rawDoc.travel_style || fi.travelStyle || (match ? match.category : "Spiritual & Heritage");
  if (!travelStyle || ["empty", "unknown", "global", "none"].includes(travelStyle.trim().toLowerCase())) {
    travelStyle = "Spiritual & Heritage";
  }

  // 5. Dynamic Trip Title
  let tripTitle = rawDoc.trip_title || rawDoc.packageName || rawDoc.tripTitle;
  if (!tripTitle || tripTitle.toLowerCase() === destClean.toLowerCase() || tripTitle.toLowerCase().includes("itinerary")) {
    const hash = Math.abs(destClean.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0));
    tripTitle = TITLE_TEMPLATES[hash % TITLE_TEMPLATES.length].replace("{dest}", destClean);
  }

  // 6. Cover Image
  const coverImage = rawDoc.coverImage || rawDoc.cover_image || fi.cover_image || (match ? match.image : "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80");

  // 7. Travel Dates & Status
  const startDate = rawDoc.startDate || rawDoc.start_date || fi.travelDates?.start || "2026-08-15";
  const endDate = rawDoc.endDate || rawDoc.end_date || fi.travelDates?.end || "2026-08-18";

  const todayStr = new Date().toISOString().split("T")[0];
  let status: "upcoming" | "ongoing" | "completed" | "cancelled" | "draft" = "upcoming";
  if (endDate < todayStr) status = "completed";
  else if (startDate <= todayStr && todayStr <= endDate) status = "ongoing";
  else status = (rawDoc.status as any) || "upcoming";

  // 8. Weather Info
  const weatherInfo = fi.weather || {
    temperature: "28°C",
    condition: "Sunny & Pleasant",
    season: "Winter Comfort",
  };

  const rawId = rawDoc._id || rawDoc.id || rawDoc.trip_id || fi.tripId || `trip-${idx + 1}`;
  const id = typeof rawId === "object" && rawId !== null ? rawId.toString() : String(rawId);

  return {
    id,
    tripId: id,
    destination: destClean,
    city,
    state,
    country,
    tripTitle,
    packageName: tripTitle,
    coverImage,
    startDate,
    endDate,
    durationDays,
    durationNights,
    budgetTotal: recommendedBudget,
    minimumBudget,
    recommendedBudget,
    maximumBudget,
    budgetFormatted,
    travelStyle,
    travelersCount,
    status,
    subtitle: `${travelersCount} Adults • ${travelStyle} • ${startDate.slice(0, 7)}`,
    summary: `${durationDays} Days / ${durationNights} Nights • ${travelersCount} Travelers • ${budgetFormatted} • ${travelStyle}`,
    weatherInfo,
    createdAt: rawDoc.created_at || rawDoc.createdAt || new Date().toISOString(),
    updatedAt: rawDoc.updated_at || rawDoc.updatedAt || new Date().toISOString(),
  };
}
