import { useState } from "react";

export type TabKey = "home" | "explore" | "add" | "alerts" | "profile";

export function useMainViewModel(initial: TabKey = "home") {
  const [activeTab, setActiveTab] = useState<TabKey>(initial);

  const selectTab = (tab: TabKey) => setActiveTab(tab);

  return {
    activeTab,
    selectTab,
  } as const;
}
