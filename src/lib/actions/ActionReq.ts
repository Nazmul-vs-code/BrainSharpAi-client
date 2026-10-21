import { requestApi, type ApiResponse } from "@/lib/api/request";

type HttpMethod = "POST" | "PUT" | "DELETE" | "PATCH";

interface ActionOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

export async function ActionReq<T = unknown>(
  endpoint: string,
  options: ActionOptions,
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");
  if (options.body !== undefined) headers.set("content-type", "application/json");
  if (options.token) headers.set("authorization", `Bearer ${options.token}`);

  return requestApi<T>(endpoint, {
    method: options.method || "POST",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}
