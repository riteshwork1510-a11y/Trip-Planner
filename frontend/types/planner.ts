export interface ActivityItem {
  id: string;
  timeSlot: "Morning" | "Afternoon" | "Evening" | "Night";
  title: string;
  description: string;
  location: string;
  estimatedCost: string;
  category: "Sightseeing" | "Food" | "Adventure" | "Culture" | "Relaxation" | "Shopping";
  tips?: string;
}

export interface DayItinerary {
  dayNumber: number;
  dateTitle: string;
  theme: string;
  activities: ActivityItem[];
}

export interface BudgetBreakdown {
  accommodation: string;
  foodAndDining: string;
  activitiesAndAttractions: string;
  localTransport: string;
  totalEstimatedCost: string;
  currency: string;
}

export interface GeneratedItinerary {
  id: string;
  destination: string;
  daysCount: number;
  travelers: string;
  budgetLevel: string;
  pace: string;
  interests: string[];
  title: string;
  summary: string;
  bestTimeToVisit: string;
  vibe: string;
  budgetBreakdown: BudgetBreakdown;
  packingList: string[];
  localTips: string[];
  days: DayItinerary[];
  createdAt: string;
}

export interface PlannerFormData {
  destination: string;
  durationDays: number;
  travelers: "solo" | "couple" | "family" | "friends";
  budgetLevel: "budget" | "moderate" | "luxury";
  pace: "relaxed" | "balanced" | "fast";
  interests: string[];
  specialPreferences?: string;
  userApiKey?: string;
}
