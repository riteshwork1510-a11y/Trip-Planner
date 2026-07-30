// ============================================================
// Types
// ============================================================

export type ActivityCategory = "food" | "transport" | "hotel" | "activity" | "shopping";
export type TripStatus = "upcoming" | "completed" | "draft";
export type ExpenseCategory = "Hotels" | "Food" | "Transportation" | "Activities" | "Shopping" | "Miscellaneous";

export interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  cost: number;
  duration: string;
  category: ActivityCategory;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}

export interface TripPreferences {
  foodPreference: string;
  interests: string[];
  budget: number;
}

export interface Trip {
  id: string;
  destination: string;
  coverImage: string;
  days: number;
  nights: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  travelStyle: string;
  status: TripStatus;
  itinerary: ItineraryDay[];
  preferences: TripPreferences;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  bestSeason: string;
  avgDuration: string;
  rating: number;
  country: string;
}

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  currency: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  preferences: {
    foodPreference: string;
    interests: string[];
    preferredBudget: string;
  };
}

// ============================================================
// User
// ============================================================

export const currentUser: User = {
  name: "Ritesh Gajjar",
  email: "ritesh.gajjar@gmail.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  preferences: {
    foodPreference: "Vegetarian",
    interests: ["Adventure", "Culture", "Photography", "Food"],
    preferredBudget: "Mid-range",
  },
};

// ============================================================
// Destinations
// ============================================================

export const destinations: Destination[] = [
  {
    id: "dest-1",
    name: "Manali",
    description:
      "Nestled in the Kullu Valley, Manali is a breathtaking hill station surrounded by towering snow-capped peaks, lush pine forests, and the gushing Beas River. From adventurous treks to serene monasteries, it offers a perfect blend of nature and culture.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop",
    bestSeason: "March - June, October - February",
    avgDuration: "4 - 5 Days",
    rating: 4.7,
    country: "India",
  },
  {
    id: "dest-2",
    name: "Goa",
    description:
      "India's smallest state packs a mighty punch with its golden-sand beaches, vibrant nightlife, centuries-old Portuguese churches, and aromatic spice plantations. Whether you seek relaxation or revelry, Goa delivers.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    bestSeason: "November - February",
    avgDuration: "3 - 5 Days",
    rating: 4.5,
    country: "India",
  },
  {
    id: "dest-3",
    name: "Dwarka",
    description:
      "One of the four sacred Char Dham pilgrimage sites, Dwarka is steeped in Hindu mythology as the ancient kingdom of Lord Krishna. The magnificent Dwarkadhish Temple and the serene coastal landscapes make it a spiritually enriching destination.",
    image: "https://images.unsplash.com/photo-1609766857326-18b4f3b00f1e?w=800&h=600&fit=crop",
    bestSeason: "October - March",
    avgDuration: "2 - 3 Days",
    rating: 4.3,
    country: "India",
  },
  {
    id: "dest-4",
    name: "Dubai",
    description:
      "A glittering metropolis rising from the desert, Dubai is a city of superlatives — home to the world's tallest building, opulent shopping malls, man-made islands, and desert safaris. It is where futuristic ambition meets Arabian heritage.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    bestSeason: "November - March",
    avgDuration: "4 - 6 Days",
    rating: 4.6,
    country: "UAE",
  },
  {
    id: "dest-5",
    name: "Paris",
    description:
      "The City of Light enchants with its iconic Eiffel Tower, world-class museums like the Louvre, charming sidewalk cafés, and romantic strolls along the Seine. Paris is an eternal classic that never fails to mesmerize.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
    bestSeason: "April - June, September - November",
    avgDuration: "5 - 7 Days",
    rating: 4.8,
    country: "France",
  },
  {
    id: "dest-6",
    name: "Bali",
    description:
      "The Island of the Gods captivates with emerald rice terraces, ancient Hindu temples, world-class surfing, and a deeply spiritual culture. From the arts hub of Ubud to the beach clubs of Seminyak, Bali is pure magic.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
    bestSeason: "April - October",
    avgDuration: "5 - 7 Days",
    rating: 4.7,
    country: "Indonesia",
  },
  {
    id: "dest-7",
    name: "Leh-Ladakh",
    description:
      "A stark high-altitude desert landscape cradled between the Himalayas and the Karakoram range. Ladakh offers bone-rattling mountain passes, pristine monasteries, crystal-clear high-altitude lakes, and an unmatched sense of solitude.",
    image: "https://images.unsplash.com/photo-1626015368085-6dd0d5a54a4e?w=800&h=600&fit=crop",
    bestSeason: "June - September",
    avgDuration: "5 - 8 Days",
    rating: 4.8,
    country: "India",
  },
  {
    id: "dest-8",
    name: "Kashmir",
    description:
      "Often called 'Paradise on Earth', Kashmir is a tapestry of tulip gardens, houseboats drifting on Dal Lake, pine-clad mountains, and warm Kashmiri hospitality. Every season paints it in a different, unforgettable hue.",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150a32?w=800&h=600&fit=crop",
    bestSeason: "March - October",
    avgDuration: "5 - 7 Days",
    rating: 4.7,
    country: "India",
  },
];

// ============================================================
// Trips
// ============================================================

export const trips: Trip[] = [
  // ---- TRIP 1: Manali (upcoming) ----
  {
    id: "trip-1",
    destination: "Manali",
    coverImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=800&fit=crop",
    days: 4,
    nights: 3,
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    budget: 25000,
    spent: 0,
    travelStyle: "Adventure",
    status: "upcoming",
    preferences: {
      foodPreference: "Vegetarian",
      interests: ["Trekking", "Nature", "Photography"],
      budget: 25000,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival & Old Manali Exploration",
        activities: [
          {
            id: "act-m1-1",
            time: "09:00 AM",
            title: "Arrive at Manali Bus Stand",
            location: "Manali Bus Stand",
            description: "Board an early morning Volvo from Delhi. Arrive in Manali and check into the hotel.",
            cost: 1200,
            duration: "12 hrs (overnight journey)",
            category: "transport",
          },
          {
            id: "act-m1-2",
            time: "01:00 PM",
            title: "Lattice & Lunch at Johnson's Café",
            location: "Johnson's Café, Old Manali",
            description: "Enjoy a hearty Himachali lunch at one of the most iconic cafés in Old Manali.",
            cost: 600,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-m1-3",
            time: "03:00 PM",
            title: "Explore Old Manali & Manu Temple",
            location: "Old Manali",
            description: "Wander through cobblestone lanes, shop for woollens, and visit the ancient Manu Temple.",
            cost: 200,
            duration: "3 hrs",
            category: "activity",
          },
          {
            id: "act-m1-4",
            time: "07:00 PM",
            title: "Dinner at Dylan's Toasted & Brewed",
            location: "Old Manali",
            description: "Relax with a wood-fired pizza and hot chocolate in this cosy café.",
            cost: 500,
            duration: "1.5 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 2,
        title: "Solang Valley Adventure",
        activities: [
          {
            id: "act-m2-1",
            time: "08:00 AM",
            title: "Drive to Solang Valley",
            location: "Solang Valley",
            description: "Take a scenic 30-minute drive to the adventure hub of Solang Valley.",
            cost: 500,
            duration: "30 min",
            category: "transport",
          },
          {
            id: "act-m2-2",
            time: "09:00 AM",
            title: "Paragliding over the Valley",
            location: "Solang Valley",
            description: "Soar over snow-dusted peaks with a tandem paragliding session.",
            cost: 3000,
            duration: "20 min (flight)",
            category: "activity",
          },
          {
            id: "act-m2-3",
            time: "12:00 PM",
            title: "Zorbing & Lunch",
            location: "Solang Valley",
            description: "Try zorbing on the snow patch and enjoy a plate of Maggi at a valley stall.",
            cost: 800,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-m2-4",
            time: "05:00 PM",
            title: "Visit Hadimba Devi Temple",
            location: "Hadimba Temple",
            description: "A serene pagoda-style temple surrounded by towering deodar trees.",
            cost: 0,
            duration: "1 hr",
            category: "activity",
          },
        ],
      },
      {
        day: 3,
        title: "Rohtang Pass Excursion",
        activities: [
          {
            id: "act-m3-1",
            time: "06:00 AM",
            title: "Early departure for Rohtang Pass",
            location: "Rohtang Pass",
            description: "Start early to beat the traffic. Drive through dramatic mountain landscapes.",
            cost: 1500,
            duration: "3 hrs",
            category: "transport",
          },
          {
            id: "act-m3-2",
            time: "09:30 AM",
            title: "Snow play & Photography at Rohtang",
            location: "Rohtang Pass (3,978 m)",
            description: "Enjoy the panoramic views of the Pir Panjal range and play in the snow.",
            cost: 100,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-m3-3",
            time: "12:30 PM",
            title: "Lunch at Roadside Dhaba",
            location: "Marhi",
            description: "Stop for dal-chawal and hot parathas at Marhi on the way back.",
            cost: 400,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-m3-4",
            time: "04:00 PM",
            title: "Vashisht Hot Springs",
            location: "Vashisht Village",
            description: "Soak in the natural sulphur hot springs of Vashisht and visit the old stone temple.",
            cost: 50,
            duration: "1.5 hrs",
            category: "activity",
          },
        ],
      },
      {
        day: 4,
        title: "Departure Day",
        activities: [
          {
            id: "act-m4-1",
            time: "07:00 AM",
            title: "Morning Walk along Beas River",
            location: "Manali Club House",
            description: "A peaceful morning stroll along the riverbank before packing up.",
            cost: 0,
            duration: "1 hr",
            category: "activity",
          },
          {
            id: "act-m4-2",
            time: "09:00 AM",
            title: "Check-out & Shopping",
            location: "Mall Road, Manali",
            description: "Pick up souvenirs, Kullu shawls, and local jams from Mall Road.",
            cost: 1000,
            duration: "1.5 hrs",
            category: "shopping",
          },
          {
            id: "act-m4-3",
            time: "11:00 AM",
            title: "Depart for Delhi",
            location: "Manali Bus Stand",
            description: "Board the return Volvo. Arrive Delhi the next morning.",
            cost: 1200,
            duration: "12 hrs",
            category: "transport",
          },
        ],
      },
    ],
  },

  // ---- TRIP 2: Goa (completed) ----
  {
    id: "trip-2",
    destination: "Goa",
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=800&fit=crop",
    days: 3,
    nights: 2,
    startDate: "2026-06-10",
    endDate: "2026-06-12",
    budget: 18000,
    spent: 16500,
    travelStyle: "Relaxation",
    status: "completed",
    preferences: {
      foodPreference: "Non-Vegetarian",
      interests: ["Beaches", "Nightlife", "History"],
      budget: 18000,
    },
    itinerary: [
      {
        day: 1,
        title: "North Goa Beach Hopping",
        activities: [
          {
            id: "act-g1-1",
            time: "10:00 AM",
            title: "Arrive in Goa & Check-in",
            location: "Calangute",
            description: "Fly into Goa airport, pick up a rental scooter, and check into the beach shack stay.",
            cost: 2500,
            duration: "2 hrs",
            category: "hotel",
          },
          {
            id: "act-g1-2",
            time: "12:00 PM",
            title: "Beach Hopping: Calangute → Baga → Anjuna",
            location: "North Goa",
            description: "Ride along the coast, stopping at each beach for views, water sports, and vibes.",
            cost: 800,
            duration: "4 hrs",
            category: "activity",
          },
          {
            id: "act-g1-3",
            time: "05:00 PM",
            title: "Sunset at Curlies Beach Shack",
            location: "Anjuna Beach",
            description: "Watch the sun melt into the Arabian Sea with a cocktail in hand at Curlies.",
            cost: 1200,
            duration: "2 hrs",
            category: "food",
          },
          {
            id: "act-g1-4",
            time: "09:00 PM",
            title: "Saturday Night Market",
            location: "Arpora",
            description: "Browse through the vibrant night market for handicrafts, clothes, and live music.",
            cost: 1500,
            duration: "3 hrs",
            category: "shopping",
          },
        ],
      },
      {
        day: 2,
        title: "South Goa Heritage & Serenity",
        activities: [
          {
            id: "act-g2-1",
            time: "08:00 AM",
            title: "Breakfast at Artjuna",
            location: "Anjuna",
            description: "Organic breakfast and smoothie bowl at this bohemian garden café.",
            cost: 500,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-g2-2",
            time: "10:00 AM",
            title: "Basilica of Bom Jesus & Se Cathedral",
            location: "Old Goa",
            description: "Explore the UNESCO-listed churches that showcase 16th-century Portuguese Baroque architecture.",
            cost: 0,
            duration: "3 hrs",
            category: "activity",
          },
          {
            id: "act-g2-3",
            time: "02:00 PM",
            title: "Lunch at Fisherman's Wharf",
            location: "Cavelossim",
            description: "Indulge in Goan prawn balchão and fish thali by the Sal River.",
            cost: 1500,
            duration: "1.5 hrs",
            category: "food",
          },
          {
            id: "act-g2-4",
            time: "04:00 PM",
            title: "Palolem Beach Relaxation",
            location: "Palolem",
            description: "Unwind at the crescent-shaped Palolem beach with a book and gentle waves.",
            cost: 300,
            duration: "3 hrs",
            category: "activity",
          },
        ],
      },
      {
        day: 3,
        title: "Farewell Goa",
        activities: [
          {
            id: "act-g3-1",
            time: "07:00 AM",
            title: "Early Morning Beach Walk",
            location: "Calangute Beach",
            description: "A quiet sunrise walk along the shore before the crowds arrive.",
            cost: 0,
            duration: "1 hr",
            category: "activity",
          },
          {
            id: "act-g3-2",
            time: "09:00 AM",
            title: "Brunch at Infantaria",
            location: "Calangute",
            description: "Famous Goan bakery — grab fresh poi bread, beef cutlet, and custard.",
            cost: 400,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-g3-3",
            time: "11:00 AM",
            title: "Check-out & Airport Transfer",
            location: "Dabolim Airport",
            description: "Return the scooter and head to the airport for the flight back home.",
            cost: 600,
            duration: "1.5 hrs",
            category: "transport",
          },
        ],
      },
    ],
  },

  // ---- TRIP 3: Dwarka (completed) ----
  {
    id: "trip-3",
    destination: "Dwarka",
    coverImage: "https://images.unsplash.com/photo-1609766857326-18b4f3b00f1e?w=1200&h=800&fit=crop",
    days: 2,
    nights: 1,
    startDate: "2026-04-05",
    endDate: "2026-04-06",
    budget: 8000,
    spent: 7200,
    travelStyle: "Spiritual",
    status: "completed",
    preferences: {
      foodPreference: "Vegetarian",
      interests: ["Temple", "History", "Spirituality"],
      budget: 8000,
    },
    itinerary: [
      {
        day: 1,
        title: "Dwarka Darshan",
        activities: [
          {
            id: "act-d1-1",
            time: "06:00 AM",
            title: "Train from Ahmedabad to Dwarka",
            location: "Ahmedabad Railway Station",
            description: "Overnight Saurashtra Express to Dwarka. Arrive early morning.",
            cost: 600,
            duration: "10 hrs",
            category: "transport",
          },
          {
            id: "act-d1-2",
            time: "08:00 AM",
            title: "Check-in at Hotel near Temple",
            location: "Dwarka",
            description: "Freshen up and have breakfast at the hotel after checking in.",
            cost: 1500,
            duration: "1 hr",
            category: "hotel",
          },
          {
            id: "act-d1-3",
            time: "09:30 AM",
            title: "Dwarkadhish Temple Darshan",
            location: "Dwarkadhish Temple",
            description: "Visit the five-storey Jagat Mandir, one of the Char Dham, adorned with intricate carvings.",
            cost: 0,
            duration: "2.5 hrs",
            category: "activity",
          },
          {
            id: "act-d1-4",
            time: "01:00 PM",
            title: "Gujarati Thali Lunch",
            location: "Dwarka",
            description: "Authentic Gujarati thali with dhokla, kadhi, and shrikhand at a local restaurant.",
            cost: 300,
            duration: "1 hr",
            category: "food",
          },
        ],
      },
      {
        day: 2,
        title: "Bet Dwarka & Departure",
        activities: [
          {
            id: "act-d2-1",
            time: "07:00 AM",
            title: "Boat ride to Bet Dwarka",
            location: "Bet Dwarka Island",
            description: "Take a short ferry ride to the island believed to be Lord Krishna's residence.",
            cost: 200,
            duration: "30 min",
            category: "transport",
          },
          {
            id: "act-d2-2",
            time: "08:00 AM",
            title: "Explore Bet Dwarka Temples",
            location: "Bet Dwarka",
            description: "Visit the main temple and the ancient undersea ruins nearby.",
            cost: 0,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-d2-3",
            time: "11:00 AM",
            title: "Rukmini Devi Temple",
            location: "Dwarka",
            description: "A beautiful temple dedicated to Rukmini Devi, just outside the main town.",
            cost: 0,
            duration: "1 hr",
            category: "activity",
          },
          {
            id: "act-d2-4",
            time: "01:00 PM",
            title: "Lunch & Depart for Ahmedabad",
            location: "Dwarka",
            description: "Quick lunch before boarding the afternoon train back to Ahmedabad.",
            cost: 400,
            duration: "10 hrs",
            category: "transport",
          },
        ],
      },
    ],
  },

  // ---- TRIP 4: Dubai (upcoming) ----
  {
    id: "trip-4",
    destination: "Dubai",
    coverImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop",
    days: 5,
    nights: 4,
    startDate: "2026-10-20",
    endDate: "2026-10-24",
    budget: 85000,
    spent: 12000,
    travelStyle: "Luxury",
    status: "upcoming",
    preferences: {
      foodPreference: "Non-Vegetarian",
      interests: ["Architecture", "Shopping", "Adventure"],
      budget: 85000,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival & Downtown Dubai",
        activities: [
          {
            id: "act-db1-1",
            time: "11:00 AM",
            title: "Arrive at Dubai International Airport",
            location: "DXB Airport",
            description: "Clear immigration, collect luggage, and take a taxi to the hotel in Downtown Dubai.",
            cost: 2500,
            duration: "1 hr",
            category: "transport",
          },
          {
            id: "act-db1-2",
            time: "01:00 PM",
            title: "Check-in at Address Downtown",
            location: "Address Downtown Hotel",
            description: "Check into the premium hotel with views of the Burj Khalifa.",
            cost: 15000,
            duration: "1 hr",
            category: "hotel",
          },
          {
            id: "act-db1-3",
            time: "03:00 PM",
            title: "Dubai Mall Exploration",
            location: "Dubai Mall",
            description: "Explore the massive mall — visit the Dubai Aquarium, Ice Rink, and high-street stores.",
            cost: 3000,
            duration: "4 hrs",
            category: "shopping",
          },
          {
            id: "act-db1-4",
            time: "08:00 PM",
            title: "Dinner with Fountain View",
            location: "Atmosphere Restaurant, Burj Khalifa",
            description: "Fine dining with panoramic city views and a front-row seat to the Dubai Fountain show.",
            cost: 8000,
            duration: "2 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 2,
        title: "Desert Safari",
        activities: [
          {
            id: "act-db2-1",
            time: "03:00 PM",
            title: "Pick-up for Desert Safari",
            location: "Hotel Lobby",
            description: "A 4x4 Land Cruiser picks you up for an evening desert adventure.",
            cost: 4000,
            duration: "6 hrs (including return)",
            category: "activity",
          },
          {
            id: "act-db2-2",
            time: "04:00 PM",
            title: "Dune Bashing & Camel Ride",
            location: "Arabian Desert",
            description: "Thrilling dune bashing followed by a serene camel ride across golden sands.",
            cost: 0,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-db2-3",
            time: "06:30 PM",
            title: "BBQ Dinner & Tanoura Dance",
            location: "Desert Camp",
            description: "Lavish Arabian BBQ buffet, henna art, and mesmerizing Tanoura and belly-dance performances.",
            cost: 0,
            duration: "3 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 3,
        title: "Palm Jumeirah & Marina",
        activities: [
          {
            id: "act-db3-1",
            time: "09:00 AM",
            title: "Monorail to Atlantis",
            location: "Palm Jumeirah",
            description: "Take the Palm Monorail with stunning aerial views of the palm-shaped island.",
            cost: 500,
            duration: "30 min",
            category: "transport",
          },
          {
            id: "act-db3-2",
            time: "10:00 AM",
            title: "Aquaventure Waterpark",
            location: "Atlantis The Palm",
            description: "A full morning of water slides, lazy river, and the legendary Leap of Faith.",
            cost: 6000,
            duration: "4 hrs",
            category: "activity",
          },
          {
            id: "act-db3-3",
            time: "03:00 PM",
            title: "Dubai Marina Walk & Lunch",
            location: "Dubai Marina",
            description: "Stroll the marina promenade and have lunch at one of the waterfront restaurants.",
            cost: 2500,
            duration: "2 hrs",
            category: "food",
          },
          {
            id: "act-db3-4",
            time: "06:00 PM",
            title: "Dhow Cruise Dinner",
            location: "Dubai Marina",
            description: "Glide through the illuminated Marina canal on a traditional wooden dhow with dinner.",
            cost: 5000,
            duration: "2 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 4,
        title: "Old Dubai & Culture",
        activities: [
          {
            id: "act-db4-1",
            time: "09:00 AM",
            title: "Al Fahidi Historical District",
            location: "Al Fahidi",
            description: "Walk through the wind-tower architecture of old Dubai and visit the Dubai Museum.",
            cost: 200,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-db4-2",
            time: "11:30 AM",
            title: "Abra Ride Across Creek",
            location: "Dubai Creek",
            description: "Take the iconic wooden abra boat across the creek to the spice and gold souks.",
            cost: 100,
            duration: "15 min",
            category: "transport",
          },
          {
            id: "act-db4-3",
            time: "12:00 PM",
            title: "Spice Souk & Gold Souk Shopping",
            location: "Deira",
            description: "Bargain for saffron, frankincense, and admire the dazzling gold jewellery displays.",
            cost: 5000,
            duration: "3 hrs",
            category: "shopping",
          },
          {
            id: "act-db4-4",
            time: "04:00 PM",
            title: "Burj Khalifa At The Top",
            location: "Burj Khalifa",
            description: "Ascend to the 148th floor observation deck for a sunset view of the entire city.",
            cost: 5000,
            duration: "1.5 hrs",
            category: "activity",
          },
        ],
      },
      {
        day: 5,
        title: "Departure",
        activities: [
          {
            id: "act-db5-1",
            time: "08:00 AM",
            title: "Breakfast at the Hotel",
            location: "Address Downtown",
            description: "Enjoy a lavish buffet breakfast before checking out.",
            cost: 0,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-db5-2",
            time: "10:00 AM",
            title: "Last-minute Shopping at Mall of Emirates",
            location: "Mall of the Emirates",
            description: "Quick shopping run and see Ski Dubai from outside.",
            cost: 3000,
            duration: "2 hrs",
            category: "shopping",
          },
          {
            id: "act-db5-3",
            time: "01:00 PM",
            title: "Airport Transfer & Departure",
            location: "DXB Airport",
            description: "Taxi to the airport. Fly back home with a bag full of memories.",
            cost: 2000,
            duration: "2 hrs",
            category: "transport",
          },
        ],
      },
    ],
  },

  // ---- TRIP 5: Paris (draft) ----
  {
    id: "trip-5",
    destination: "Paris",
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=800&fit=crop",
    days: 6,
    nights: 5,
    startDate: "2027-03-15",
    endDate: "2027-03-20",
    budget: 150000,
    spent: 0,
    travelStyle: "Cultural",
    status: "draft",
    preferences: {
      foodPreference: "Non-Vegetarian",
      interests: ["Art", "History", "Wine", "Architecture"],
      budget: 150000,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival & Eiffel Tower",
        activities: [
          {
            id: "act-p1-1",
            time: "10:00 AM",
            title: "Arrive at Charles de Gaulle Airport",
            location: "CDG Airport",
            description: "Take the RER B train to central Paris after clearing immigration.",
            cost: 5500,
            duration: "1 hr",
            category: "transport",
          },
          {
            id: "act-p1-2",
            time: "12:00 PM",
            title: "Check-in at Hotel Le Marais",
            location: "Le Marais, Paris",
            description: "Boutique hotel in the heart of the historic Le Marais district.",
            cost: 25000,
            duration: "1 hr",
            category: "hotel",
          },
          {
            id: "act-p1-3",
            time: "03:00 PM",
            title: "Eiffel Tower Summit Visit",
            location: "Eiffel Tower",
            description: "Ascend to the summit for breathtaking 360-degree views of the entire city.",
            cost: 3500,
            duration: "2.5 hrs",
            category: "activity",
          },
          {
            id: "act-p1-4",
            time: "07:00 PM",
            title: "Seine River Dinner Cruise",
            location: "Port de la Bourdonnais",
            description: "Float past illuminated landmarks while enjoying French cuisine on a glass-top boat.",
            cost: 8000,
            duration: "2 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 2,
        title: "Art & Museums",
        activities: [
          {
            id: "act-p2-1",
            time: "09:00 AM",
            title: "Louvre Museum",
            location: "Louvre Museum",
            description: "Spend the morning with the Mona Lisa, Winged Victory, and Venus de Milo.",
            cost: 2200,
            duration: "4 hrs",
            category: "activity",
          },
          {
            id: "act-p2-2",
            time: "01:00 PM",
            title: "Lunch at Café de Flore",
            location: "Saint-Germain-des-Prés",
            description: "Historic literary café — croque monsieur and crème brûlée among the Hemingway crowd.",
            cost: 4000,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-p2-3",
            time: "03:00 PM",
            title: "Musée d'Orsay",
            location: "Musée d'Orsay",
            description: "Impressionist masterpieces by Monet, Renoir, and Van Gogh in a stunning converted railway station.",
            cost: 1800,
            duration: "3 hrs",
            category: "activity",
          },
          {
            id: "act-p2-4",
            time: "07:00 PM",
            title: "Dinner in Montmartre",
            location: "Montmartre",
            description: "Cozy bistro dinner in the bohemian neighbourhood beneath the Sacré-Cœur.",
            cost: 5000,
            duration: "2 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 3,
        title: "Versailles Day Trip",
        activities: [
          {
            id: "act-p3-1",
            time: "08:00 AM",
            title: "Train to Versailles",
            location: "Gare Saint-Lazare",
            description: "Take the RER C to the Palace of Versailles for a day trip.",
            cost: 1200,
            duration: "45 min",
            category: "transport",
          },
          {
            id: "act-p3-2",
            time: "09:30 AM",
            title: "Palace of Versailles Tour",
            location: "Palace of Versailles",
            description: "Explore the Hall of Mirrors, the King's Grand Apartments, and the stunning gardens.",
            cost: 3000,
            duration: "4 hrs",
            category: "activity",
          },
          {
            id: "act-p3-3",
            time: "02:00 PM",
            title: "Lunch at La Flottille",
            location: "Versailles Gardens",
            description: "Lakeside restaurant overlooking the Grand Canal inside the palace gardens.",
            cost: 5000,
            duration: "1.5 hrs",
            category: "food",
          },
          {
            id: "act-p3-4",
            time: "04:00 PM",
            title: "Garden Stroll & Fountain Show",
            location: "Versailles Gardens",
            description: "Walk through the manicured gardens and catch the Musical Fountain Show in season.",
            cost: 0,
            duration: "2 hrs",
            category: "activity",
          },
        ],
      },
      {
        day: 4,
        title: "Champs-Élysées & Shopping",
        activities: [
          {
            id: "act-p4-1",
            time: "10:00 AM",
            title: "Arc de Triomphe & Champs-Élysées",
            location: "Champs-Élysées",
            description: "Climb the Arc for panoramic views, then stroll down the world's most famous avenue.",
            cost: 1500,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-p4-2",
            time: "12:30 PM",
            title: "Shopping at Galeries Lafayette",
            location: "Galeries Lafayette",
            description: "A stunning Art Nouveau department store with everything from Chanel to macarons.",
            cost: 15000,
            duration: "3 hrs",
            category: "shopping",
          },
          {
            id: "act-p4-3",
            time: "04:00 PM",
            title: "Macaron Tasting at Ladurée",
            location: "Ladurée, Champs-Élysées",
            description: "Indulge in Paris's finest macarons at the legendary Ladurée patisserie.",
            cost: 2000,
            duration: "30 min",
            category: "food",
          },
          {
            id: "act-p4-4",
            time: "07:30 PM",
            title: "Moulin Rouge Show",
            location: "Moulin Rouge, Pigalle",
            description: "A spectacular cabaret show with champagne — an unforgettable Parisian night.",
            cost: 20000,
            duration: "2.5 hrs",
            category: "activity",
          },
        ],
      },
      {
        day: 5,
        title: "Hidden Paris",
        activities: [
          {
            id: "act-p5-1",
            time: "09:00 AM",
            title: "Notre-Dame & Île de la Cité",
            location: "Île de la Cité",
            description: "View the restored Notre-Dame from outside and explore the charming island neighbourhood.",
            cost: 0,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-p5-2",
            time: "11:30 AM",
            title: "Shakespeare and Company Bookshop",
            location: "Latin Quarter",
            description: "Browse the legendary English-language bookshop that has hosted Hemingway and Joyce.",
            cost: 1500,
            duration: "1 hr",
            category: "shopping",
          },
          {
            id: "act-p5-3",
            time: "01:00 PM",
            title: "Lunch at Le Bouillon Chartier",
            location: "Grands Boulevards",
            description: "Classic French brasserie with incredibly affordable prix-fixe meals.",
            cost: 2000,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-p5-4",
            time: "03:00 PM",
            title: "Luxembourg Gardens & Panthéon",
            location: "Latin Quarter",
            description: "Relax in the Luxembourg Gardens, then visit the Panthéon to see Voltaire's tomb.",
            cost: 1200,
            duration: "3 hrs",
            category: "activity",
          },
        ],
      },
      {
        day: 6,
        title: "Departure",
        activities: [
          {
            id: "act-p6-1",
            time: "08:00 AM",
            title: "Croissant & Coffee at a Parisian Bakery",
            location: "Local Patisserie",
            description: "One last flaky butter croissant and café crème to remember Paris by.",
            cost: 800,
            duration: "45 min",
            category: "food",
          },
          {
            id: "act-p6-2",
            time: "10:00 AM",
            title: "Check-out & RER to Airport",
            location: "CDG Airport",
            description: "Check out of the hotel and take the RER B to Charles de Gaulle Airport.",
            cost: 5500,
            duration: "1 hr",
            category: "transport",
          },
        ],
      },
    ],
  },

  // ---- TRIP 6: Bali (upcoming) ----
  {
    id: "trip-6",
    destination: "Bali",
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&fit=crop",
    days: 5,
    nights: 4,
    startDate: "2026-12-05",
    endDate: "2026-12-09",
    budget: 65000,
    spent: 8500,
    travelStyle: "Balanced",
    status: "upcoming",
    preferences: {
      foodPreference: "Non-Vegetarian",
      interests: ["Nature", "Temples", "Beaches", "Yoga"],
      budget: 65000,
    },
    itinerary: [
      {
        day: 1,
        title: "Arrival in Ubud",
        activities: [
          {
            id: "act-b1-1",
            time: "02:00 PM",
            title: "Arrive at Ngurah Rai Airport",
            location: "Bali Airport",
            description: "Land in Bali and hire a private driver to take you to Ubud (1.5 hrs).",
            cost: 2500,
            duration: "1.5 hrs",
            category: "transport",
          },
          {
            id: "act-b1-2",
            time: "04:00 PM",
            title: "Check-in at Ubud Villa",
            location: "Ubud",
            description: "A lush jungle-view villa with an infinity pool overlooking the rice terraces.",
            cost: 8000,
            duration: "1 hr",
            category: "hotel",
          },
          {
            id: "act-b1-3",
            time: "05:30 PM",
            title: "Ubud Monkey Forest",
            location: "Monkey Forest Road",
            description: "Wander through the sacred sanctuary of long-tailed macaques and ancient banyan trees.",
            cost: 500,
            duration: "1.5 hrs",
            category: "activity",
          },
          {
            id: "act-b1-4",
            time: "07:30 PM",
            title: "Dinner at Locavore",
            location: "Ubud",
            description: "Award-winning farm-to-table Indonesian tasting menu at one of Asia's best restaurants.",
            cost: 6000,
            duration: "2 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 2,
        title: "Temples & Rice Terraces",
        activities: [
          {
            id: "act-b2-1",
            time: "07:00 AM",
            title: "Tegallalang Rice Terraces",
            location: "Tegallalang",
            description: "Walk through the iconic layered rice paddies in the soft morning light.",
            cost: 300,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-b2-2",
            time: "10:00 AM",
            title: "Tirta Empul Water Temple",
            location: "Tampaksiring",
            description: "Participate in the sacred purification ritual in the crystal-clear spring pools.",
            cost: 400,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-b2-3",
            time: "01:00 PM",
            title: "Balinese Lunch at Warung Biah Biah",
            location: "Ubud",
            description: "Authentic nasi campur and lawar in a traditional open-air Balinese eatery.",
            cost: 600,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-b2-4",
            time: "04:00 PM",
            title: "Ubud Art Market Shopping",
            location: "Ubud Art Market",
            description: "Hunt for handcrafted batik, wooden carvings, and silver jewellery.",
            cost: 2000,
            duration: "2 hrs",
            category: "shopping",
          },
        ],
      },
      {
        day: 3,
        title: "Seminyak Beach Day",
        activities: [
          {
            id: "act-b3-1",
            time: "09:00 AM",
            title: "Drive to Seminyak",
            location: "Seminyak",
            description: "Private car transfer from Ubud to the trendy beach town of Seminyak.",
            cost: 1500,
            duration: "1 hr",
            category: "transport",
          },
          {
            id: "act-b3-2",
            time: "10:30 AM",
            title: "Beach Club & Surfing Lesson",
            location: "Seminyak Beach",
            description: "Catch some waves with a beginner surf lesson, then relax at Potato Head Beach Club.",
            cost: 3000,
            duration: "4 hrs",
            category: "activity",
          },
          {
            id: "act-b3-3",
            time: "03:00 PM",
            title: "Spa & Massage",
            location: "Spring Spa, Seminyak",
            description: "Traditional Balinese massage and flower bath to recover from the surf session.",
            cost: 2000,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-b3-4",
            time: "07:00 PM",
            title: "Sunset Dinner at La Plancha",
            location: "Batu Bolong Beach",
            description: "Colourful beanbag seating right on the sand, watching the Bali sunset with cocktails.",
            cost: 2500,
            duration: "2 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 4,
        title: "Uluwatu & Kecak Dance",
        activities: [
          {
            id: "act-b4-1",
            time: "08:00 AM",
            title: "Yoga Class at Yoga Barn",
            location: "Yoga Barn, Ubud",
            description: "Start the day with a rejuvenating vinyasa flow class in an open-air bamboo studio.",
            cost: 800,
            duration: "1.5 hrs",
            category: "activity",
          },
          {
            id: "act-b4-2",
            time: "11:00 AM",
            title: "Nusa Penida Day Trip (Snorkelling)",
            location: "Nusa Penida",
            description: "Fast boat to Nusa Penida — snorkel with manta rays at Manta Point.",
            cost: 5000,
            duration: "5 hrs",
            category: "activity",
          },
          {
            id: "act-b4-3",
            time: "05:00 PM",
            title: "Uluwatu Temple & Kecak Fire Dance",
            location: "Uluwatu Temple",
            description: "Watch the dramatic Kecak dance performance against a sunset backdrop atop the cliff.",
            cost: 1500,
            duration: "2 hrs",
            category: "activity",
          },
          {
            id: "act-b4-4",
            time: "08:00 PM",
            title: "Seafood Dinner at Jimbaran Bay",
            location: "Jimbaran",
            description: "Feast on grilled fish, prawns, and lobster right on the sand under torchlight.",
            cost: 4000,
            duration: "2 hrs",
            category: "food",
          },
        ],
      },
      {
        day: 5,
        title: "Departure",
        activities: [
          {
            id: "act-b5-1",
            time: "08:00 AM",
            title: "Breakfast & Check-out",
            location: "Seminyak Villa",
            description: "Tropical fruit platter and Balinese coffee before saying goodbye to Bali.",
            cost: 0,
            duration: "1 hr",
            category: "food",
          },
          {
            id: "act-b5-2",
            time: "10:00 AM",
            title: "Last-minute Shopping at Seminyak Square",
            location: "Seminyak",
            description: "Pick up coffee beans, vanilla, and batik sarongs to take back home.",
            cost: 2000,
            duration: "1.5 hrs",
            category: "shopping",
          },
          {
            id: "act-b5-3",
            time: "12:00 PM",
            title: "Airport Transfer & Departure",
            location: "Ngurah Rai Airport",
            description: "Private transfer to the airport. Farewell, Bali.",
            cost: 1500,
            duration: "45 min",
            category: "transport",
          },
        ],
      },
    ],
  },
];

// ============================================================
// Expenses
// ============================================================

export const expenses: Expense[] = [
  // Goa Trip
  { id: "exp-1", tripId: "trip-2", category: "Hotels", description: "Beach shack stay — 2 nights", amount: 5000, date: "2026-06-10", currency: "INR" },
  { id: "exp-2", tripId: "trip-2", category: "Transportation", description: "Scooter rental — 3 days", amount: 1800, date: "2026-06-10", currency: "INR" },
  { id: "exp-3", tripId: "trip-2", category: "Food", description: "Meals across 3 days (cafés & shacks)", amount: 4200, date: "2026-06-10", currency: "INR" },
  { id: "exp-4", tripId: "trip-2", category: "Activities", description: "Water sports — parasailing & jet ski", amount: 2500, date: "2026-06-11", currency: "INR" },
  { id: "exp-5", tripId: "trip-2", category: "Shopping", description: "Night market — clothes & souvenirs", amount: 1500, date: "2026-06-10", currency: "INR" },
  { id: "exp-6", tripId: "trip-2", category: "Transportation", description: "Airport taxi (both ways)", amount: 1500, date: "2026-06-12", currency: "INR" },

  // Dwarka Trip
  { id: "exp-7", tripId: "trip-3", category: "Transportation", description: "Train tickets (Ahmedabad ↔ Dwarka)", amount: 1200, date: "2026-04-05", currency: "INR" },
  { id: "exp-8", tripId: "trip-3", category: "Hotels", description: "Hotel near temple — 1 night", amount: 1500, date: "2026-04-05", currency: "INR" },
  { id: "exp-9", tripId: "trip-3", category: "Food", description: "Meals — thalis & snacks", amount: 1500, date: "2026-04-05", currency: "INR" },
  { id: "exp-10", tripId: "trip-3", category: "Activities", description: "Bet Dwarka boat ride & entry", amount: 500, date: "2026-04-06", currency: "INR" },
  { id: "exp-11", tripId: "trip-3", category: "Miscellaneous", description: "Prasad & offerings", amount: 500, date: "2026-04-05", currency: "INR" },

  // Dubai Trip (advance payments)
  { id: "exp-12", tripId: "trip-4", category: "Hotels", description: "Hotel booking advance — Address Downtown (4 nights)", amount: 12000, date: "2026-07-15", currency: "INR" },

  // Bali Trip (advance payments)
  { id: "exp-13", tripId: "trip-6", category: "Transportation", description: "Flight tickets (Delhi → Bali, 2 pax)", amount: 5500, date: "2026-07-01", currency: "INR" },
  { id: "exp-14", tripId: "trip-6", category: "Hotels", description: "Villa booking deposit — Ubud (2 nights)", amount: 3000, date: "2026-07-01", currency: "INR" },

  // Manali Trip (advance)
  { id: "exp-15", tripId: "trip-1", category: "Transportation", description: "Volvo bus tickets (Delhi → Manali, round trip)", amount: 2400, date: "2026-07-20", currency: "INR" },

  // Miscellaneous
  { id: "exp-16", tripId: "trip-2", category: "Miscellaneous", description: "Travel insurance", amount: 500, date: "2026-06-09", currency: "INR" },
  { id: "exp-17", tripId: "trip-4", category: "Activities", description: "Desert safari booking confirmation", amount: 4000, date: "2026-07-18", currency: "INR" },
];

// ============================================================
// Trip Itinerary (for detail pages — same as trip.itinerary, exported separately for convenience)
// ============================================================

export const tripItineraries: Record<string, ItineraryDay[]> = Object.fromEntries(
  trips.map((trip) => [trip.id, trip.itinerary])
);
