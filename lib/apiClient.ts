import { getSession } from 'next-auth/react';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

// interface ApiError {
//   status?: number;
//   data?: any;
// }

export class ApiError extends Error {
  status: number | undefined;
  data: any;
  constructor(message: string, status?: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  const { requireAuth = false, headers: customHeaders, ...rest } = options;
  
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/json');
  // headers.set('cache', 'no-cache');
  // headers.set('pragma', 'no-cache');
  // headers.set('Expires', '0');
  // headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  if (requireAuth) {
    const session: any = await getSession();
    console.log("here is the session => ", session);
    if (!session?.accessToken) {
      throw new ApiError('Unauthorized', 401);
    }
    headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Network error');
  }
}

export const apiClient = {
  get: <T>(url: string, options?: FetchOptions) => 
    fetchWithAuth(url, { ...options, method: 'GET' }) as Promise<T>,
    
  post: <T>(url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<T>,
    
  put: <T>(url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<T>,
    
  patch: <T>(url: string, data?: any, options?: FetchOptions) =>
    fetchWithAuth(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }) as Promise<T>,
    
  delete: <T>(url: string, options?: FetchOptions) =>
    fetchWithAuth(url, { ...options, method: 'DELETE' }) as Promise<T>,
};