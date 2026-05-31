import { API_URL } from "./AuthService";
import { getSession } from "../storage/session";

type RequestOptions = {
  authenticated?: boolean;
  body?: unknown;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
};

type ApiErrorBody = {
  message?: string;
};

export async function apiRequest<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.authenticated) {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = (await response.json().catch(() => ({}))) as ApiErrorBody;

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data as TResponse;
}
