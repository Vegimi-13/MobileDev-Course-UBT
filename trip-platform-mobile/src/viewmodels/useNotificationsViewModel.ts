import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppNotification } from "../models/notification";
import {
  markNotificationRead,
  fetchNotifications,
  markAllNotificationsRead,
} from "../services/notificationService";
import { acceptTripInvite, declineTripInvite } from "../services/tripService";

export function useNotificationsViewModel() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setNotifications(await fetchNotifications());
    } catch (err: any) {
      setError(err?.message ?? "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const newNotifications = notifications.filter((item) => !item.isRead);
  const earlierNotifications = notifications.filter((item) => item.isRead);

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, isRead: true })),
    );
    markAllNotificationsRead().catch(load);
  };

  const acceptInvite = async (notification: AppNotification) => {
    if (!notification.tripPublicId) return;

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, actionable: false, isRead: true, message: "invite accepted for" }
          : item,
      ),
    );

    try {
      await acceptTripInvite(notification.tripPublicId);
      await markNotificationRead(notification.id);
    } catch {
      await load();
    }
  };

  const declineInvite = async (notification: AppNotification) => {
    if (!notification.tripPublicId) return;

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, actionable: false, isRead: true, message: "invite declined for" }
          : item,
      ),
    );

    try {
      await declineTripInvite(notification.tripPublicId);
      await markNotificationRead(notification.id);
    } catch {
      await load();
    }
  };

  const summaryText = useMemo(() => {
    if (unreadCount === 0) {
      return "All caught up";
    }

    return `${unreadCount} new notification${unreadCount === 1 ? "" : "s"}`;
  }, [unreadCount]);

  return {
    earlierNotifications,
    acceptInvite,
    declineInvite,
    error,
    isLoading,
    markAllRead,
    newNotifications,
    refresh: load,
    summaryText,
    unreadCount,
  } as const;
}
