import type { AuthTokens, LoginPayload, RegisterPayload } from "../models/auth";

const rawApiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const API_URL = rawApiUrl.replace(/\/$/, "");

type ApiErrorBody = {
  message?: string;
};

async function request<TResponse>(
  path: string,
  body: LoginPayload | RegisterPayload,
): Promise<TResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as ApiErrorBody;

  if (!response.ok) {
    throw new Error(data.message ?? "Something went wrong. Please try again.");
  }

  return data as TResponse;
}

export const AuthService = {
  login(payload: LoginPayload) {
    return request<AuthTokens>("/api/auth/login", payload);
  },

  async register(payload: RegisterPayload) {
    await request("/api/auth/register", payload);

    return AuthService.login({
      email: payload.email,
      password: payload.password,
    });
  },
};
