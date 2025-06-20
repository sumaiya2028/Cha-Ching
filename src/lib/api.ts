// src/lib/api.ts

const API_BASE_URL = "http://localhost:8081";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Optional: handle different status codes here
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "API request failed");
  }

  return response.json();
}

// GET helper
export async function apiGet<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: "GET" });
}

// POST helper with body
export async function apiPost<T, B = unknown>(
  endpoint: string,
  body: B
): Promise<T> {
  return request<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
