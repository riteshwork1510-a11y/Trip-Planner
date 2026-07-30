export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  category: "international" | "domestic" | "honeymoon" | "adventure" | "beach" | "luxury";
  duration: string; // e.g. "6 Days / 5 Nights"
  priceStarting: number; // in INR
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  groupSize: string; // e.g. "Max 12 People"
  isMostPopular?: boolean;
  highlights: string[];
  inclusions: string[];
}

export const TOUR_PACKAGES_DATA: TourPackage[] = [
  {
    id: "pkg-1",
    slug: "bali-tropical-paradise",
    title: "Bali Tropical Escapes & Temple Odyssey",
    destination: "Bali",
    country: "Indonesia",
    category: "beach",
    duration: "6 Days / 5 Nights",
    priceStarting: 48500,
    originalPrice: 62000,
    rating: 4.9,
    reviewsCount: 342,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    groupSize: "Private / Small Group",
    isMostPopular: true,
    highlights: ["Uluwatu Sunset Temple Tour", "Ubud Monkey Forest & Rice Terraces", "Nusa Penida Island Speedboat Day Cruise", "Balinese Spa & Seafood Dinner"],
    inclusions: ["4-Star Hotel Resort Stay", "Daily Breakfast & Seafood Dinners", "Airport Speedboat Transfers", "Private Guided Chauffeur"],
  },
  {
    id: "pkg-2",
    slug: "swiss-alps-scenic-railways",
    title: "Swiss Alps, Lakes & Glacier Express",
    destination: "Swiss Alps",
    country: "Switzerland",
    category: "luxury",
    duration: "7 Days / 6 Nights",
    priceStarting: 135000,
    originalPrice: 160000,
    rating: 4.95,
    reviewsCount: 218,
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    groupSize: "Small Group (Max 10)",
    isMostPopular: true,
    highlights: ["Scenic Glacier Express Train Pass", "Mount Titlis Cable Car with Ice Flyer", "Lucerne & Interlaken Lake Cruises", "Jungfraujoch Top of Europe Expedition"],
    inclusions: ["Swiss Travel Pass 1st Class", "Luxury Mountain Resort Stay", "Daily Breakfasts & Fondue Dinners", "English Mountain Guide"],
  },
  {
    id: "pkg-3",
    slug: "dubai-desert-glitz",
    title: "Dubai Glitz, Desert Safari & Luxury Yacht",
    destination: "Dubai",
    country: "UAE",
    category: "international",
    duration: "5 Days / 4 Nights",
    priceStarting: 42000,
    originalPrice: 54000,
    rating: 4.85,
    reviewsCount: 412,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    groupSize: "Private Group",
    isMostPopular: false,
    highlights: ["Burj Khalifa 124th Floor Observatory", "Desert 4x4 Dune Bashing & BBQ", "Dubai Marina VIP Yacht Cruise", "Future Museum & Miracle Garden"],
    inclusions: ["5-Star Hotel Stay", "Airport Transfers in Luxury SUV", "Desert Safari with BBQ", "UAE Tourist Visa Assistance"],
  },
  {
    id: "pkg-4",
    slug: "paris-romantic-escape",
    title: "Paris Romance, Louvre & Riviera Getaway",
    destination: "Paris & Nice",
    country: "France",
    category: "honeymoon",
    duration: "8 Days / 7 Nights",
    priceStarting: 118000,
    originalPrice: 140000,
    rating: 4.9,
    reviewsCount: 189,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    groupSize: "Couples Only",
    isMostPopular: true,
    highlights: ["Eiffel Tower VIP Priority Access", "Seine River Candlelight Dinner Cruise", "Louvre Museum Skip-The-Line Tour", "French Riviera TGV Bullet Train Expedition"],
    inclusions: ["Boutique Parisian Hotels", "Daily Gourmet Breakfasts", "Seine Dinner Cruise", "Intercity TGV Train Pass"],
  },
  {
    id: "pkg-5",
    slug: "leh-ladakh-expedition",
    title: "Leh Ladakh High Pass & Pangong Tso Odyssey",
    destination: "Leh Ladakh",
    country: "India",
    category: "adventure",
    duration: "7 Days / 6 Nights",
    priceStarting: 28500,
    originalPrice: 36000,
    rating: 4.8,
    reviewsCount: 520,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    groupSize: "Max 12 People",
    isMostPopular: false,
    highlights: ["Pangong Tso Lake Luxury Camps", "Khardung La Pass (17,982 ft) Crossing", "Nubra Valley Double-Hump Camel Safari", "Magnetic Hill & Indus Sangam Confluence"],
    inclusions: ["Modified 4x4 SUV Transport", "Inner Line Wildlife Permits", "All Meals Included", "Oxygen Cylinder Supported SUV"],
  },
  {
    id: "pkg-6",
    slug: "goa-beach-bliss",
    title: "Goa Beach Bliss, Catamaran Cruise & Nightlife",
    destination: "Goa",
    country: "India",
    category: "beach",
    duration: "4 Days / 3 Nights",
    priceStarting: 14999,
    originalPrice: 21000,
    rating: 4.75,
    reviewsCount: 680,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    groupSize: "Any Size",
    isMostPopular: false,
    highlights: ["Private Beachfront Resort Access", "Mandovi River Sunset Catamaran Cruise", "Dudsagar Waterfalls Jeep Trek", "Water Sports at Calangute Beach"],
    inclusions: ["Beachfront Resort Accommodation", "Daily Breakfast & Cocktail Passes", "Scooter or Car Rentals", "Airport Airport Pick & Drop"],
  },
];
