import { api, type ApiResponse } from "./client";
import { type NormalizedTrip } from "@/types/shared-trip";

export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  country?: string;
  cover_image?: string;
  days: number;
  nights: number;
  start_date?: string;
  end_date?: string;
  budget: number;
  spent: number;
  travel_style?: string;
  status: "upcoming" | "completed" | "draft";
  itinerary: any[];
  preferences?: any;
  created_at: string;
  updated_at: string;
  // The single source of truth — NormalizedTrip stored as-is
  full_itinerary?: NormalizedTrip;
}

export interface TripStats {
  total_trips: number;
  total_destinations: number;
  total_budget: number;
  total_spent: number;
  completed: number;
  upcoming: number;
  draft: number;
}

export interface CreateTripPayload {
  destination: string;
  country?: string;
  days: number;
  nights?: number;
  start_date?: string;
  end_date?: string;
  budget?: number;
  travel_style?: string;
  food_preference?: string;
  interests?: string[];
  itinerary?: any[];
  // NormalizedTrip — stored as-is, no transformation
  full_itinerary?: NormalizedTrip;
}

export async function getTrips(status?: string) {
  try {
    const params = status ? `?status=${status}` : "";
    return await api.get<ApiResponse<Trip[]>>(`/api/trips${params}`);
  } catch (err) {
    console.warn("Unauthenticated or backend unavailable, returning empty trips:", err);
    return { success: false, data: [] as Trip[] };
  }
}

export async function getTripStats() {
  try {
    return await api.get<ApiResponse<TripStats>>("/api/trips/stats");
  } catch (err) {
    console.warn("Unauthenticated or backend unavailable, returning default stats:", err);
    return {
      success: false,
      data: {
        total_trips: 0,
        total_destinations: 0,
        total_budget: 0,
        total_spent: 0,
        completed: 0,
        upcoming: 0,
        draft: 0,
      },
    };
  }
}

export function getTrip(id: string) {
  return api.get<ApiResponse<Trip>>(`/api/trips/${id}`);
}

export function createTrip(data: CreateTripPayload) {
  return api.post<ApiResponse<Trip>>("/api/trips", data);
}

export function updateTrip(id: string, data: Partial<CreateTripPayload>) {
  return api.put<ApiResponse<Trip>>(`/api/trips/${id}`, data);
}

export function deleteTrip(id: string) {
  return api.delete<ApiResponse>(`/api/trips/${id}`);
}

export function aiUpdateItinerary(tripId: string, prompt: string) {
  return api.post<ApiResponse<Trip>>(`/api/trips/${tripId}/ai-update`, { prompt });
}
