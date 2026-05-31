import { API_URL } from "./AuthService";
import { getSession } from "../storage/session";
import type { User } from "../models/user";

export async function fetchCurrentUser(): Promise<User> {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const data = (await response.json().catch(() => ({}))) as any;

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to fetch user");
  }

  const user = data as User;

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
