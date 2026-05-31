import React from "react";
import { StyleSheet, View } from "react-native";
import { CreateTripScreen } from "./CreateTripScreen";
import { ExploreScreen } from "./ExploreScreen";
import { HomeScreen } from "./HomeScreen";
import { NotificationsScreen } from "./NotificationsScreen";
import { ProfileScreen } from "./ProfileScreen";
import BottomNav from "../components/BottomNav";
import { useMainViewModel } from "../viewmodels/useMainViewModel";

type MainAppProps = {
  apiUrl: string;
  onLogout: () => void;
};

export function MainApp({ apiUrl, onLogout }: MainAppProps) {
  const { activeTab, unreadCount, selectTab } = useMainViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === "home" && <HomeScreen apiUrl={apiUrl} />}
        {activeTab === "explore" && <ExploreScreen />}
        {activeTab === "alerts" && <NotificationsScreen onLogout={onLogout} />}
        {activeTab === "profile" && <ProfileScreen onLogout={onLogout} />}
        {activeTab === "add" && (
          <CreateTripScreen
            onDone={() => selectTab("home")}
            onExplore={() => selectTab("explore")}
          />
        )}
      </View>

      {activeTab !== "add" && (
        <BottomNav
          activeTab={activeTab}
          onSelect={selectTab}
          unreadCount={unreadCount}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
