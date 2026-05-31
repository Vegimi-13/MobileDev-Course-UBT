import type { User } from "../models/user";
import { apiRequest } from "./apiClient";

export type UpdateCurrentUserPayload = Partial<
  Pick<User, "firstName" | "lastName" | "username" | "bio" | "avatarUrl">
>;

export async function fetchCurrentUser(): Promise<User> {
  const user = await apiRequest<User>("/api/users/me", {
    authenticated: true,
  });

  return {
    ...user,
    avatarUrl:
      user.avatarUrl ??
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    bio:
      user.bio ??
      "Explorer. Coffee addict. Always planning the next trip and the one after that.",
    followersCount: user.followersCount ?? 0,
    followingCount: user.followingCount ?? 0,
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

  return {
    ...user,
    followersCount: user.followersCount ?? 0,
    followingCount: user.followingCount ?? 0,
  };
}

export async function searchUsers(query: string): Promise<User[]> {
  return apiRequest<User[]>(
    `/api/users/search?q=${encodeURIComponent(query.trim())}`,
    {
      authenticated: true,
    },
  );
}
