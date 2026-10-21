import { requestApi, type ApiResponse } from "@/lib/api/request";

interface FetchOptions {
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
  token?: string;
}

export async function FetchData<T = unknown>(
  endpoint: string,
  options?: FetchOptions,
): Promise<ApiResponse<T>> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(options?.params ?? {})) {
    query.set(key, String(value));
  }

  const url = query.size ? `${endpoint}?${query.toString()}` : endpoint;
  const headers = new Headers(options?.headers);
  headers.set("accept", "application/json");
  if (options?.token) headers.set("authorization", `Bearer ${options.token}`);

  return requestApi<T>(url, { method: "GET", headers });
}
