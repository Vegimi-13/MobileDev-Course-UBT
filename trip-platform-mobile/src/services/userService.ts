import { API_URL } from "./AuthService";
import { getSession } from "../storage/session";
import type { User } from "../models/user";

export async function fetchCurrentUser(): Promise<User> {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const data = (await response.json().catch(() => ({}))) as any;

  if (!response.ok) {
    throw new Error(data.message ?? "Failed to fetch user");
  }

  return data as User;
}
