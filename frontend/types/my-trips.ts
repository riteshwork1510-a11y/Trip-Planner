export type TripStatus = "all" | "upcoming" | "ongoing" | "completed" | "cancelled" | "draft";

export interface MyTrip {
  id: string;
  tripId?: string;
  destination: string;
  city: string;
  state: string;
  country: string;
  tripTitle: string;
  packageName: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  durationNights: number;
  budgetTotal: number;
  minimumBudget: number;
  recommendedBudget: number;
  maximumBudget: number;
  budgetFormatted: string;
  travelStyle: string;
  travelersCount: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "draft";
  subtitle: string;
  summary: string;
  weatherInfo?: {
    temperature?: string;
    condition?: string;
    season?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TripStatsSummary {
  totalTrips: number;
  upcomingTrips: number;
  ongoingTrips: number;
  completedTrips: number;
  savedItineraries: number;
}
