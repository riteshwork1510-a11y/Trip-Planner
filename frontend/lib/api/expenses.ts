import { api, type ApiResponse } from "./client";

export type ExpenseCategory = "Hotels" | "Food" | "Transportation" | "Activities" | "Shopping" | "Miscellaneous";

export interface Expense {
  id: string;
  user_id: string;
  trip_id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseStats {
  total_expenses: number;
  total_spent: number;
  categories: Record<string, { total: number; count: number }>;
}

export interface CreateExpensePayload {
  trip_id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
  currency?: string;
  notes?: string;
}

export function getExpenses(tripId?: string) {
  const params = tripId ? `?trip_id=${tripId}` : "";
  return api.get<ApiResponse<Expense[]>>(`/api/expenses${params}`);
}

export function getExpenseStats() {
  return api.get<ApiResponse<ExpenseStats>>("/api/expenses/stats");
}

export function createExpense(data: CreateExpensePayload) {
  return api.post<ApiResponse<Expense>>("/api/expenses", data);
}

export function deleteExpense(id: string) {
  return api.delete<ApiResponse>(`/api/expenses/${id}`);
}
