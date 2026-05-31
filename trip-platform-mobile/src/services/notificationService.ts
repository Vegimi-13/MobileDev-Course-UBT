import type { AppNotification } from "../models/notification";
import { apiRequest } from "./apiClient";

type ApiNotification = {
  id: string;
  type: AppNotification["type"];
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    firstName: string;
    lastName: string;
    username?: string | null;
  } | null;
  trip?: {
    title: string;
  } | null;
};

const avatarUrl =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80";

const timeAgo = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.max(Math.floor(diffMs / 60000), 1);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const mapNotification = (item: ApiNotification): AppNotification => ({
  id: item.id,
  type: item.type === "COMMENT" ? "COMMENT" : item.type,
  actorName: item.sender
    ? `${item.sender.firstName} ${item.sender.lastName}`.trim()
    : "Trip Platform",
  avatarUrl,
  message: item.message,
  tripTitle: item.trip?.title,
  createdAtLabel: timeAgo(item.createdAt),
  isRead: item.isRead,
  actionable: item.type === "TRIP_INVITE",
});

export async function fetchNotifications(): Promise<AppNotification[]> {
  const notifications = await apiRequest<ApiNotification[]>("/api/notifications/me", {
    authenticated: true,
  });
  return notifications.map(mapNotification);
}

export async function markNotificationRead(notificationId: string) {
  return apiRequest(`/api/notifications/${notificationId}/read`, {
    authenticated: true,
    method: "PATCH",
  });
}

export async function markAllNotificationsRead() {
  return apiRequest<{ updated: number }>("/api/notifications/read-all", {
    authenticated: true,
    method: "PATCH",
  });
}
