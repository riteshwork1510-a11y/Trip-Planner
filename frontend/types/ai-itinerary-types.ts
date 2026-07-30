export interface TripSummary {
  destination: string;
  duration: string;
  travelStyle: string;
  estimatedBudget: string;
  bestSeason: string;
  overallTheme: string;
  tripDifficulty: string;
  averageDailyTravelTime: string;
  recommendedPace: string;
}

export interface TripHighlight {
  title: string;
  description: string;
  whyIncluded: string;
}

export interface ActivityDetail {
  id: string;
  timeSlot: string;
  title: string;
  description: string;
  location: string;
  estimatedCost: string;
  category: string;
  tips?: string;
}

export interface DailyItineraryDay {
  dayNumber: number;
  title: string;
  morning: ActivityDetail;
  afternoon: ActivityDetail;
  lunch: ActivityDetail;
  evening: ActivityDetail;
  dinner: ActivityDetail;
  night: ActivityDetail;
  estimatedCost: string;
  travelDistance: string;
  travelTime: string;
  stayRecommendation: string;
  importantNotes?: string;
}

export interface BudgetBreakdownDetailed {
  accommodation: string;
  food: string;
  transportation: string;
  entryFees: string;
  shoppingBuffer: string;
  emergencyBuffer: string;
  totalCost: string;
  remainingBudget: string;
  currency: string;
}

export interface HotelRecommendation {
  hotelName: string;
  hotelArea: string;
  hotelCategory: string;
  estimatedPrice: string;
  reasonForRecommendation: string;
  nearbyAttractions: string[];
}

export interface RestaurantOption {
  restaurantName: string;
  cuisine: string;
  estimatedCost: string;
  reason: string;
  nearbyAttraction: string;
}

export interface RestaurantRecommendation {
  breakfast: RestaurantOption;
  lunch: RestaurantOption;
  dinner: RestaurantOption;
}

export interface TransportOption {
  mode: string;
  travelTime: string;
  estimatedCost: string;
  reason: string;
}

export interface PackingChecklist {
  clothing: string[];
  electronics: string[];
  documents: string[];
  health: string[];
  weatherItems: string[];
  photography: string[];
  localEssentials: string[];
}

export interface TravelTips {
  localCustoms: string[];
  dressCode: string[];
  safety: string[];
  weather: string[];
  photographyEtiquette: string[];
  festivalInformation?: string[];
  languageTips: string[];
}

export interface FullItineraryOutput {
  tripSummary: TripSummary;
  tripHighlights: TripHighlight[];
  dailyItinerary: DailyItineraryDay[];
  budgetBreakdown: BudgetBreakdownDetailed;
  hotelRecommendation: HotelRecommendation[];
  restaurantRecommendation: RestaurantRecommendation;
  transportRecommendation: TransportOption[];
  packingChecklist: PackingChecklist;
  travelTips: TravelTips;
  emergencyAdvice: string[];
  weatherAdvice: string;
  importantNotes: string[];
}

export interface TripGenerationRequest {
  destination: string;
  country?: string;
  state?: string;
  city?: string;
  duration_days: number;
  duration_nights?: number;
  total_budget?: number;
  budget_per_person?: number;
  currency?: string;
  travelers_count?: number;
  travel_type?: string;
  travel_style?: string;
  interests?: string[];
  preferred_transport?: string;
  preferred_hotel_category?: string;
  special_requirements?: string;
  starting_location?: string;
  preferred_pace?: string;
  preferred_language?: string;
  user_api_key?: string;
}

export interface TripGenerationResponse {
  success: boolean;
  generation_id: string;
  request_id: string;
  destination: string;
  status: string;
  model_used: string;
  validated_output: FullItineraryOutput | Record<string, any>;
  latency_ms: number;
  created_at: string;
}
