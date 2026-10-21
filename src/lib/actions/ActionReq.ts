const API_BASE_URL = 
  process.env.NEXT_PUBLIC_SERVER_URL || "https://brainsharp-backend.onrender.com";

type HttpMethod = "POST" | "PUT" | "DELETE" | "PATCH";

interface ActionOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  token?: string; // Optional session token passed dynamically
}

export async function ActionReq<T = any>(
  endpoint: string, 
  options: ActionOptions
): Promise<{ data?: T; error?: string; status: number }> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options.method || "POST";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    // Attach token if passed as a parameter
    if (options?.token) {
      headers["Authorization"] = `Bearer ${options.token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.message || "Action request failed",
        status: response.status,
      };
    }

    return {
      data: result,
      status: response.status,
    };
  } catch (err: any) {
    console.error("ActionReq Error:", err);
    return {
      error: err.message || "Network error occurred",
      status: 500,
    };
  }
}