export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function requestApi<T>(
  endpoint: string,
  init: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/backend${endpoint}`, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
    });
    const responseText = await response.text();
    let result: unknown;

    if (responseText) {
      try {
        result = JSON.parse(responseText) as unknown;
      } catch {
        result = responseText;
      }
    }

    if (!response.ok) {
      let error = typeof result === "string" ? result : "The API request failed.";
      if (typeof result === "object" && result !== null) {
        const errorPayload = result as Record<string, unknown>;
        const message = errorPayload.message ?? errorPayload.error;
        if (typeof message === "string") error = message;
      }
      return { error, status: response.status };
    }

    return { data: result as T, status: response.status };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      error: error instanceof Error ? error.message : "Network error occurred.",
      status: 0,
    };
  }
}
