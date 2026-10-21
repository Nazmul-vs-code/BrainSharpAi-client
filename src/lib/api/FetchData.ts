const API_BASE_URL = 
  process.env.NEXT_PUBLIC_SERVER_URL || "https://brainsharp-backend.onrender.com";

interface FetchOptions {
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
  token?: string; // Optional session token passed dynamically
}

export async function FetchData<T = any>(
  endpoint: string, 
  options?: FetchOptions
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    let url = `${API_BASE_URL}${endpoint}`;
    
    // Append query parameters if provided (e.g., ?userId=123)
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    // Attach token if passed as a parameter
    if (options?.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.message || "Failed to fetch data",
        status: response.status,
      };
    }

    return {
      data: result,
      status: response.status,
    };
  } catch (err: any) {
    console.error("FetchData Error:", err);
    return {
      error: err.message || "Network error occurred",
      status: 500,
    };
  }
}