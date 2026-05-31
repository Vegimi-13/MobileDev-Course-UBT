import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LogOut } from "lucide-react-native";
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
          <View style={styles.placeholder}>
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderTitle}>Create Trip</Text>
              <Text style={styles.placeholderText}>
                The trip builder can plug into the Prisma Trip fields next:
                destination, dates, visibility, join policy, category, and tags.
              </Text>
              <Pressable style={styles.placeholderButton} onPress={onLogout}>
                <LogOut color="#FFFFFF" size={17} strokeWidth={2.2} />
                <Text style={styles.placeholderButtonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <BottomNav
        activeTab={activeTab}
        onSelect={selectTab}
        unreadCount={unreadCount}
      />
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
  placeholder: {
    alignItems: "center",
    backgroundColor: "#FBF4EC",
    flex: 1,
    justifyContent: "center",
    padding: 22,
  },
  placeholderCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#EEE5DC",
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    width: "100%",
  },
  placeholderTitle: {
    color: "#17172B",
    fontSize: 24,
    fontWeight: "900",
  },
  placeholderText: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  placeholderButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FF6535",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  placeholderButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
