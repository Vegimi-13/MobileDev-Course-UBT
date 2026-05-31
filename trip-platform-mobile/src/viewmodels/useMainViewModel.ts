import { useEffect, useState } from "react";
import { fetchNotifications } from "../services/notificationService";

export type TabKey = "home" | "explore" | "add" | "alerts" | "profile";

export function useMainViewModel(initial: TabKey = "home") {
  const [activeTab, setActiveTab] = useState<TabKey>(initial);
  const [unreadCount, setUnreadCount] = useState(0);

  const selectTab = (tab: TabKey) => setActiveTab(tab);

  useEffect(() => {
    fetchNotifications()
      .then((items) => setUnreadCount(items.filter((item) => !item.isRead).length))
      .catch(() => setUnreadCount(0));
  }, []);

  return {
    activeTab,
    unreadCount,
    selectTab,
  } as const;
}
