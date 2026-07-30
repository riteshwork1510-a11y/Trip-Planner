import { api, type ApiResponse } from "./client";

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  default_currency?: string;
  travel_style?: string;
  food_preference?: string;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  default_currency?: string;
  travel_style?: string;
  food_preference?: string;
}

export interface TokenData {
  access_token: string;
  token_type: string;
}

export function registerUser(data: RegisterPayload) {
  return api.post<ApiResponse<{ id: string; email: string; full_name: string }>>(
    "/api/auth/register",
    data
  );
}

export function loginUser(data: LoginPayload) {
  return api.post<ApiResponse<TokenData>>("/api/auth/login", data);
}

export function logoutUser() {
  return api.post<ApiResponse>("/api/auth/logout");
}

export function getCurrentUser() {
  return api.get<ApiResponse<AuthUser>>("/api/auth/me");
}

export function refreshToken() {
  return api.post<ApiResponse<TokenData>>("/api/auth/refresh");
}

export function forgotPassword(email: string) {
  return api.post<ApiResponse>("/api/auth/forgot-password", { email });
}

export function resetPassword(token: string, password: string) {
  return api.post<ApiResponse>("/api/auth/reset-password", { token, password });
}
