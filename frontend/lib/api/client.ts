const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  errorCode?: string;

  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const msg = body?.detail?.message || body?.message || "Something went wrong";
      const code = body?.detail?.error_code || body?.error_code;
      throw new ApiError(msg, res.status, code);
    }

    return body as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Unable to connect to the server. Please try again.", 0);
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  put: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, { method: "PUT", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};
