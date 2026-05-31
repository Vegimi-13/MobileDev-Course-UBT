import React from "react";
import { View, StyleSheet } from "react-native";
import { HomeScreen } from "./HomeScreen";
import { ProfileScreen } from "./ProfileScreen";
import BottomNav from "../components/BottomNav";
import { useMainViewModel } from "../viewmodels/useMainViewModel";

type MainAppProps = {
  apiUrl: string;
  onLogout: () => void;
};

export function MainApp({ apiUrl, onLogout }: MainAppProps) {
  const { activeTab, selectTab } = useMainViewModel();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === "home" && <HomeScreen apiUrl={apiUrl} />}
        {activeTab === "profile" && <ProfileScreen onLogout={onLogout} />}
        {activeTab !== "home" && activeTab !== "profile" && (
          // lightweight placeholder for other tabs
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {/* @ts-ignore */}
            <></>
          </View>
        )}
      </View>

      <BottomNav activeTab={activeTab} onSelect={selectTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
