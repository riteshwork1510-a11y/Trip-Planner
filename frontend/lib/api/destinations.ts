import { api, type ApiResponse } from "./client";

export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image?: string;
  best_season?: string;
  avg_duration?: string;
  rating: number;
  categories: string[];
}

export function getDestinations(search?: string, category?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  const qs = params.toString();
  return api.get<ApiResponse<Destination[]>>(`/api/destinations${qs ? `?${qs}` : ""}`);
}

export function getDestination(id: string) {
  return api.get<ApiResponse<Destination>>(`/api/destinations/${id}`);
}
