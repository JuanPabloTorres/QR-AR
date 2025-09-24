// src/lib/apiClient.ts
import { Experience } from "@/types/experience";
import { ApiResponse, PaginatedResponse } from "@/types/api";

// Re-export types for convenience (backward compatibility)
export type { Experience, ApiResponse, PaginatedResponse };

// Use Next.js API routes as proxy to avoid CORS issues
const baseUrl = "/api";

// Helper function to handle API requests with better error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    cache: "no-store",
    ...options,
  };

  console.log(`API Request: ${options.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, defaultOptions);

    console.log(`API Response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
      }

      throw new Error(errorMessage);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();
    console.log(`API Data received:`, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${url}:`, error);

    // Enhanced error handling for common scenarios
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Could not connect to the server. Make sure the API server is running on port 5028."
      );
    }

    throw error;
  }
}

export async function listExperiences(params?: {
  search?: string;
  type?: string;
  page?: number;
  pageSize?: number;
  onlyActive?: boolean;
}): Promise<PaginatedResponse<Experience>> {
  const queryParams = new URLSearchParams();

  if (params?.search) queryParams.set("search", params.search);
  if (params?.type) queryParams.set("type", params.type);
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.pageSize) queryParams.set("pageSize", String(params.pageSize));
  if (params?.onlyActive) queryParams.set("onlyActive", "true");

  const endpoint = `/experiences${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  return apiRequest<PaginatedResponse<Experience>>(endpoint);
}

export async function getExperienceById(
  id: string
): Promise<Experience | null> {
  try {
    return await apiRequest<Experience>(
      `/experiences/${encodeURIComponent(id)}`
    );
  } catch (error) {
    // If it's a 404, return null instead of throwing
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}

export async function createExperience(
  data: Omit<Experience, "id" | "createdAtUtc">
): Promise<Experience> {
  return apiRequest<Experience>("/experiences", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExperience(
  id: string,
  data: Omit<Experience, "id" | "createdAtUtc">
): Promise<Experience> {
  return apiRequest<Experience>(`/experiences/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteExperience(id: string): Promise<void> {
  return apiRequest<void>(`/experiences/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// Health check function to test API connectivity
export async function checkApiHealth(): Promise<{
  status: string;
  timestamp: string;
}> {
  try {
    return await apiRequest<{ status: string; timestamp: string }>("/health");
  } catch (error) {
    console.error("API Health check failed:", error);
    throw error;
  }
}
