import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { headers as getServerHeaders } from "next/headers";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  isServer?: boolean;
}

export class ApiError extends Error {
  status: number | undefined;
  data: any;
  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const {
    requireAuth = false,
    isServer = false,
    headers: customHeaders,
    ...rest
  } = options;

  const headers = new Headers(customHeaders);
  headers.set("Content-Type", "application/json");

  if (requireAuth) {
    let accessToken: string | undefined;

    if (isServer) {
      // Use getServerSession in server components
      const session = await getSession() as { accessToken?: string };
      if (!session?.accessToken) {
        throw new ApiError("Unauthorized", 401);
      }
      accessToken = session.accessToken;
    } else {
      // Use getSession in client components
      const session = await getSession() as { accessToken?: string };
      if (!session?.accessToken) {
        throw new ApiError("Unauthorized", 401);
      }
      accessToken = session.accessToken;
    }

    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    // if(!response.ok){
    //   throw new Error(response.statusText);
    // }

    if (!response.ok) {
      const errorMessage =
        (isJson && data?.message) || // Prefer JSON response with a 'message' field
        (typeof data === "string" ? data : "An error occurred"); // Fallback for string responses or generic message

      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error"
    );
  }
}

export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) =>
    fetchWithAuth(url, { ...options, method: "GET" }) as Promise<T>,

  post: <T>(url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<T>,

  put: <T>(url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<T>,

  patch: <T>(url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<T>,

  delete: <T>(url: string, options?: FetchOptions) =>
    fetchWithAuth(url, { ...options, method: "DELETE" }) as Promise<T>,
};
