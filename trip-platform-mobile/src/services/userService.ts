import type { User } from "../models/user";
import { apiRequest } from "./apiClient";

export type UpdateCurrentUserPayload = Partial<
  Pick<User, "firstName" | "lastName" | "username" | "bio">
>;

export async function fetchCurrentUser(): Promise<User> {
  const user = await apiRequest<User>("/api/users/me", {
    authenticated: true,
  });

  return {
    ...user,
    bio:
      user.bio ??
      "Explorer. Coffee addict. Always planning the next trip and the one after that.",
  };
}

export async function updateCurrentUser(
  payload: UpdateCurrentUserPayload,
): Promise<User> {
  const user = await apiRequest<User>("/api/users/me", {
    authenticated: true,
    body: payload,
    method: "PATCH",
  });

  return user;
}

export async function searchUsers(query: string): Promise<User[]> {
  return apiRequest<User[]>(
    `/api/users/search?q=${encodeURIComponent(query.trim())}`,
    {
      authenticated: true,
    },
  );
}
