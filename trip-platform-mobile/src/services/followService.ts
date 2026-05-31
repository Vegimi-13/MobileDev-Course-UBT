import type { User } from "../models/user";
import { apiRequest } from "./apiClient";

export async function followUser(userId: string) {
  return apiRequest<{ following: true }>(`/api/follows/${userId}`, {
    authenticated: true,
    method: "POST",
  });
}

export async function unfollowUser(userId: string) {
  return apiRequest<{ following: false }>(`/api/follows/${userId}`, {
    authenticated: true,
    method: "DELETE",
  });
}

export async function fetchFollowers(userId: string) {
  return apiRequest<User[]>(`/api/follows/${userId}/followers`);
}

export async function fetchFollowing(userId: string) {
  return apiRequest<User[]>(`/api/follows/${userId}/following`);
}
